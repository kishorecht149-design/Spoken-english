import OpenAI from "openai";
import { AiFallbackLayer, Prisma, type CourseLevel } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

type TutorMode = "conversation" | "speaking-feedback";

export interface TutorContext {
  userId?: string;
  userLevel?: CourseLevel;
  lessonTitle?: string;
  lessonObjective?: string;
  topic?: string;
  history?: Array<{ role: "student" | "coach"; content: string }>;
}

export interface ConversationTutorResponse {
  reply: string;
  tips: string[];
  layer?: AiFallbackLayer;
  qualityScore?: number;
}

export interface SpeakingFeedbackResponse {
  fluencyScore: number;
  grammarScore: number;
  pronunciationScore: number;
  overallScore: number;
  feedback: string;
  correctedVersion: string;
  tryAgainPrompt: string;
  layer?: AiFallbackLayer;
  qualityScore?: number;
}

export interface ResponseQuality {
  score: number;
  isValid: boolean;
  reasons: string[];
}

const staticResponses = {
  greeting: [
    "Good. Let's speak in simple, clear sentences. Start with one complete sentence, and I will help you improve it.",
    "I am ready. Speak naturally first; then we will polish grammar, clarity, and confidence."
  ],
  encouragement: [
    "Good attempt! You are close. Now make it clearer and say it once more.",
    "Nice start. Do not stop at one line. Add one reason and one example."
  ],
  retry: [
    "Try again with this structure: answer first, then reason, then example.",
    "Say it again slowly. Focus on a complete sentence, not perfect grammar."
  ],
  correction: [
    "Good attempt! Try saying it like this. I will correct the sentence and you repeat it.",
    "You're close. Let's improve it step by step and then you will say it again."
  ]
};

const commonFixes = [
  {
    pattern: /\bhe go\b/gi,
    replacement: "he goes",
    why: "Use 'goes' with he, she, or it."
  },
  {
    pattern: /\bshe go\b/gi,
    replacement: "she goes",
    why: "Use 'goes' with he, she, or it."
  },
  {
    pattern: /\bi am go\b/gi,
    replacement: "I am going",
    why: "Use 'I am going' for an action happening now."
  },
  {
    pattern: /\bmyself ([A-Z][a-z]+)/g,
    replacement: "My name is $1",
    why: "Introductions sound natural with 'My name is' or 'I am'."
  },
  {
    pattern: /\bi didn't got\b/gi,
    replacement: "I didn't get",
    why: "After 'didn't', use the base verb."
  },
  {
    pattern: /\bi can able to\b/gi,
    replacement: "I can",
    why: "Use either 'can' or 'am able to', not both."
  },
  {
    pattern: /\bi am agree\b/gi,
    replacement: "I agree",
    why: "'Agree' is already the action."
  },
  {
    pattern: /\bdiscuss about\b/gi,
    replacement: "discuss",
    why: "Do not use 'about' after 'discuss'."
  }
];

function getOpenAiClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = 12000) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("AI request timed out")), timeoutMs);
    })
  ]);
}

function safeJsonParse<T>(value: string | undefined): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function evaluateResponseQuality(response: unknown): ResponseQuality {
  const reasons: string[] = [];
  const text = typeof response === "string" ? response : JSON.stringify(response || {});
  const trimmed = text.trim();
  let score = 100;

  if (!trimmed) {
    return { score: 0, isValid: false, reasons: ["empty_response"] };
  }

  if (trimmed.length < 80) {
    score -= 35;
    reasons.push("too_short");
  }

  if (/^(ok|yes|no|sure|fine)[.!]?$/i.test(trimmed)) {
    score -= 45;
    reasons.push("generic_reply");
  }

  if (/error|failed|cannot help|as an ai|i am unable/i.test(trimmed)) {
    score -= 50;
    reasons.push("bad_user_experience_language");
  }

  const sentences = trimmed.split(/[.!?]+/).filter(Boolean);
  const uniqueSentences = new Set(sentences.map((sentence) => sentence.toLowerCase().trim()));
  if (sentences.length >= 3 && uniqueSentences.size <= 1) {
    score -= 35;
    reasons.push("repeated_response");
  }

  if (!/try|say|repeat|improve|correct|practice|speak|sentence|example/i.test(trimmed)) {
    score -= 20;
    reasons.push("not_coaching_oriented");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    isValid: score >= 70,
    reasons
  };
}

function buildTutorSystemPrompt(mode: TutorMode, context: TutorContext) {
  return [
    "You are Verbalyx Coach, a friendly but strict spoken English trainer for Indian learners.",
    "Never say AI error, system error, or technical failure.",
    "Correct mistakes instantly and push the learner to speak again.",
    "Use this feedback format when correcting: What you said, Mistake, Correct version, Why it is better, Try again prompt.",
    "Use practical Indian contexts and simple explanations. Teach patterns, not grammar theory.",
    `Learner level: ${context.userLevel || "BEGINNER"}.`,
    context.lessonTitle ? `Lesson: ${context.lessonTitle}.` : "",
    context.lessonObjective ? `Objective: ${context.lessonObjective}.` : "",
    mode === "conversation"
      ? "Return JSON only with reply and tips. Keep reply conversational and ask a follow-up question."
      : "Return JSON only with fluencyScore, grammarScore, pronunciationScore, overallScore, feedback, correctedVersion, tryAgainPrompt."
  ]
    .filter(Boolean)
    .join("\n");
}

async function callConversationModel({
  model,
  topic,
  message,
  context
}: {
  model: string;
  topic: string;
  message: string;
  context: TutorContext;
}) {
  const client = getOpenAiClient();
  if (!client) throw new Error("OpenAI key unavailable");

  const completion = await withTimeout(
    client.responses.create({
      model,
      input: [
        { role: "system", content: buildTutorSystemPrompt("conversation", context) },
        {
          role: "user",
          content: JSON.stringify({
            topic,
            studentMessage: message,
            recentHistory: context.history?.slice(-6) || []
          })
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "conversation_reply",
          schema: {
            type: "object",
            properties: {
              reply: { type: "string" },
              tips: { type: "array", items: { type: "string" } }
            },
            required: ["reply", "tips"],
            additionalProperties: false
          }
        }
      }
    })
  );

  const parsed = safeJsonParse<ConversationTutorResponse>(completion.output_text);
  if (!parsed?.reply || !Array.isArray(parsed.tips)) throw new Error("Invalid model response");
  return parsed;
}

async function callSpeakingModel({
  model,
  transcript,
  targetPrompt,
  context
}: {
  model: string;
  transcript: string;
  targetPrompt: string;
  context: TutorContext;
}) {
  const client = getOpenAiClient();
  if (!client) throw new Error("OpenAI key unavailable");

  const completion = await withTimeout(
    client.responses.create({
      model,
      input: [
        { role: "system", content: buildTutorSystemPrompt("speaking-feedback", context) },
        {
          role: "user",
          content: JSON.stringify({
            targetPrompt,
            transcript,
            level: context.userLevel || "BEGINNER",
            lesson: context.lessonTitle
          })
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "speech_feedback",
          schema: {
            type: "object",
            properties: {
              fluencyScore: { type: "number" },
              grammarScore: { type: "number" },
              pronunciationScore: { type: "number" },
              overallScore: { type: "number" },
              feedback: { type: "string" },
              correctedVersion: { type: "string" },
              tryAgainPrompt: { type: "string" }
            },
            required: ["fluencyScore", "grammarScore", "pronunciationScore", "overallScore", "feedback", "correctedVersion", "tryAgainPrompt"],
            additionalProperties: false
          }
        }
      }
    })
  );

  const parsed = safeJsonParse<SpeakingFeedbackResponse>(completion.output_text);
  if (!parsed?.feedback || !parsed.correctedVersion || !parsed.tryAgainPrompt) throw new Error("Invalid model response");
  return parsed;
}

function applyRuleCorrections(text: string) {
  const fixes: string[] = [];
  let corrected = text.trim();

  for (const fix of commonFixes) {
    if (fix.pattern.test(corrected)) {
      corrected = corrected.replace(fix.pattern, fix.replacement);
      fixes.push(fix.why);
    }
    fix.pattern.lastIndex = 0;
  }

  return { corrected, fixes };
}

function ruleBasedConversation(topic: string, message: string, context: TutorContext): ConversationTutorResponse {
  const { corrected, fixes } = applyRuleCorrections(message);
  const levelInstruction =
    context.userLevel === "ADVANCED"
      ? "Now add evidence and a clear recommendation."
      : context.userLevel === "INTERMEDIATE"
        ? "Now add one reason and one example."
        : "Now repeat it slowly as one complete sentence.";

  return {
    reply: [
      fixes.length ? `Good attempt. What you said: "${message}". Correct version: "${corrected}". ${fixes[0]}` : staticResponses.encouragement[0],
      `Topic: ${topic}. ${levelInstruction}`,
      `Try again prompt: Say your answer again, then ask me one question about this situation.`
    ].join(" "),
    tips: [
      fixes[0] || "Use one complete sentence before adding details.",
      "Speak again using: answer + reason + example."
    ]
  };
}

function ruleBasedSpeakingFeedback(transcript: string, targetPrompt: string): SpeakingFeedbackResponse {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const { corrected, fixes } = applyRuleCorrections(transcript);
  const lengthScore = Math.min(90, Math.max(55, words.length * 3));
  const grammarScore = fixes.length ? 68 : 82;
  const fluencyScore = words.length < 20 ? 62 : lengthScore;
  const pronunciationScore = 76;
  const overallScore = Math.round((fluencyScore + grammarScore + pronunciationScore) / 3);

  return {
    fluencyScore,
    grammarScore,
    pronunciationScore,
    overallScore,
    feedback: `What you said: "${transcript}". ${fixes.length ? `Mistake: ${fixes[0]}` : "Good attempt. Your sentence is understandable."} Correct version: "${corrected}". Why it is better: it sounds clearer and more natural in spoken English. Try again: answer "${targetPrompt}" in 3 complete sentences.`,
    correctedVersion: corrected,
    tryAgainPrompt: `Try again with this structure: answer first, then one reason, then one example.`
  };
}

function staticConversation(topic: string, message: string): ConversationTutorResponse {
  return {
    reply: `${staticResponses.correction[0]} Topic: ${topic}. What you said: "${message}". Try this structure: "I think ___ because ___. For example, ___." Now speak again with one reason and one example.`,
    tips: ["Use the pattern: I think + idea + because + reason.", "Do not stop after one short sentence. Add an example."]
  };
}

function staticSpeakingFeedback(transcript: string, targetPrompt: string): SpeakingFeedbackResponse {
  const corrected = transcript.trim() || "I need a little more practice with this answer.";
  return {
    fluencyScore: 72,
    grammarScore: 74,
    pronunciationScore: 73,
    overallScore: 73,
    feedback: `Good attempt. What you said: "${corrected}". Mistake: your answer needs more complete sentences. Correct version: "${corrected} I can explain this with one reason and one example." Why it is better: longer structured answers sound more confident. Try again prompt: ${targetPrompt}`,
    correctedVersion: `${corrected} I can explain this with one reason and one example.`,
    tryAgainPrompt: `Say it again in 3 sentences: answer, reason, example.`
  };
}

async function logFallback({
  userId,
  route,
  layer,
  reason,
  qualityScore,
  primaryFailed,
  secondaryFailed,
  metadata
}: {
  userId?: string;
  route: string;
  layer: AiFallbackLayer;
  reason: string;
  qualityScore: number;
  primaryFailed: boolean;
  secondaryFailed: boolean;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.aiFallbackLog.create({
      data: {
        userId,
        route,
        layer,
        reason,
        qualityScore,
        primaryFailed,
        secondaryFailed,
        metadata: metadata ? (JSON.parse(JSON.stringify(metadata)) as Prisma.InputJsonValue) : undefined
      }
    });
  } catch (error) {
    console.warn("AI fallback log skipped", error);
  }
}

function withMeta<T extends ConversationTutorResponse | SpeakingFeedbackResponse>(response: T, layer: AiFallbackLayer, qualityScore: number): T {
  return { ...response, layer, qualityScore };
}

export async function getTutorConversation({
  topic,
  message,
  context = {}
}: {
  topic: string;
  message: string;
  context?: TutorContext;
}): Promise<ConversationTutorResponse> {
  let primaryFailed = false;
  let secondaryFailed = false;
  const primaryModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const secondaryModel = process.env.OPENAI_FALLBACK_MODEL || "gpt-4o-mini";

  try {
    const response = await callConversationModel({ model: primaryModel, topic, message, context });
    const quality = evaluateResponseQuality(response);
    if (quality.isValid) return withMeta(response, AiFallbackLayer.PRIMARY, quality.score);

    primaryFailed = true;
    await logFallback({ userId: context.userId, route: "conversation", layer: AiFallbackLayer.SECONDARY, reason: quality.reasons.join(","), qualityScore: quality.score, primaryFailed, secondaryFailed });
  } catch (error) {
    primaryFailed = true;
    await logFallback({ userId: context.userId, route: "conversation", layer: AiFallbackLayer.SECONDARY, reason: error instanceof Error ? error.message : "primary_failed", qualityScore: 0, primaryFailed, secondaryFailed });
  }

  try {
    const response = await callConversationModel({ model: secondaryModel, topic, message, context });
    const quality = evaluateResponseQuality(response);
    if (quality.isValid) return withMeta(response, AiFallbackLayer.SECONDARY, quality.score);

    secondaryFailed = true;
    await logFallback({ userId: context.userId, route: "conversation", layer: AiFallbackLayer.RULE_BASED, reason: quality.reasons.join(","), qualityScore: quality.score, primaryFailed, secondaryFailed });
  } catch (error) {
    secondaryFailed = true;
    await logFallback({ userId: context.userId, route: "conversation", layer: AiFallbackLayer.RULE_BASED, reason: error instanceof Error ? error.message : "secondary_failed", qualityScore: 0, primaryFailed, secondaryFailed });
  }

  const ruleResponse = ruleBasedConversation(topic, message, context);
  const ruleQuality = evaluateResponseQuality(ruleResponse);
  if (ruleQuality.isValid) return withMeta(ruleResponse, AiFallbackLayer.RULE_BASED, ruleQuality.score);

  const staticResponse = staticConversation(topic, message);
  const staticQuality = evaluateResponseQuality(staticResponse);
  await logFallback({ userId: context.userId, route: "conversation", layer: AiFallbackLayer.STATIC, reason: ruleQuality.reasons.join(","), qualityScore: staticQuality.score, primaryFailed, secondaryFailed });
  return withMeta(staticResponse, AiFallbackLayer.STATIC, staticQuality.score);
}

export async function getTutorSpeakingFeedback({
  transcript,
  targetPrompt,
  context = {}
}: {
  transcript: string;
  targetPrompt: string;
  context?: TutorContext;
}): Promise<SpeakingFeedbackResponse> {
  let primaryFailed = false;
  let secondaryFailed = false;
  const primaryModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const secondaryModel = process.env.OPENAI_FALLBACK_MODEL || "gpt-4o-mini";

  try {
    const response = await callSpeakingModel({ model: primaryModel, transcript, targetPrompt, context });
    const quality = evaluateResponseQuality(response);
    if (quality.isValid) return withMeta(response, AiFallbackLayer.PRIMARY, quality.score);

    primaryFailed = true;
    await logFallback({ userId: context.userId, route: "speaking-feedback", layer: AiFallbackLayer.SECONDARY, reason: quality.reasons.join(","), qualityScore: quality.score, primaryFailed, secondaryFailed });
  } catch (error) {
    primaryFailed = true;
    await logFallback({ userId: context.userId, route: "speaking-feedback", layer: AiFallbackLayer.SECONDARY, reason: error instanceof Error ? error.message : "primary_failed", qualityScore: 0, primaryFailed, secondaryFailed });
  }

  try {
    const response = await callSpeakingModel({ model: secondaryModel, transcript, targetPrompt, context });
    const quality = evaluateResponseQuality(response);
    if (quality.isValid) return withMeta(response, AiFallbackLayer.SECONDARY, quality.score);

    secondaryFailed = true;
    await logFallback({ userId: context.userId, route: "speaking-feedback", layer: AiFallbackLayer.RULE_BASED, reason: quality.reasons.join(","), qualityScore: quality.score, primaryFailed, secondaryFailed });
  } catch (error) {
    secondaryFailed = true;
    await logFallback({ userId: context.userId, route: "speaking-feedback", layer: AiFallbackLayer.RULE_BASED, reason: error instanceof Error ? error.message : "secondary_failed", qualityScore: 0, primaryFailed, secondaryFailed });
  }

  const ruleResponse = ruleBasedSpeakingFeedback(transcript, targetPrompt);
  const ruleQuality = evaluateResponseQuality(ruleResponse);
  if (ruleQuality.isValid) return withMeta(ruleResponse, AiFallbackLayer.RULE_BASED, ruleQuality.score);

  const staticResponse = staticSpeakingFeedback(transcript, targetPrompt);
  const staticQuality = evaluateResponseQuality(staticResponse);
  await logFallback({ userId: context.userId, route: "speaking-feedback", layer: AiFallbackLayer.STATIC, reason: ruleQuality.reasons.join(","), qualityScore: staticQuality.score, primaryFailed, secondaryFailed });
  return withMeta(staticResponse, AiFallbackLayer.STATIC, staticQuality.score);
}
