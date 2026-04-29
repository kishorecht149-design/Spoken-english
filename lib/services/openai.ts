import OpenAI from "openai";

function getOpenAiClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({ apiKey });
}

export async function evaluateSpeaking({
  transcript,
  targetPrompt
}: {
  transcript: string;
  targetPrompt: string;
}) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      fluencyScore: 78,
      grammarScore: 80,
      pronunciationScore: 76,
      overallScore: 78,
      feedback:
        "OpenAI key is not configured yet, so this is fallback feedback. Keep sentence pace steady and use complete responses."
    };
  }

  const client = getOpenAiClient();
  if (!client) {
    throw new Error("OpenAI client unavailable.");
  }

  const completion = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are an English speaking evaluator. Return JSON with fluencyScore, grammarScore, pronunciationScore, overallScore, feedback."
      },
      {
        role: "user",
        content: `Prompt: ${targetPrompt}\nTranscript: ${transcript}`
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
            feedback: { type: "string" }
          },
          required: [
            "fluencyScore",
            "grammarScore",
            "pronunciationScore",
            "overallScore",
            "feedback"
          ],
          additionalProperties: false
        }
      }
    }
  });

  return JSON.parse(completion.output_text);
}

export async function simulateConversation(topic: string, message: string) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      reply: `Let's keep practicing "${topic}". Tell me more about ${message.toLowerCase()}.`,
      tips: ["Use one example from daily life.", "Add one linking phrase like 'because' or 'however'."]
    };
  }

  const client = getOpenAiClient();
  if (!client) {
    throw new Error("OpenAI client unavailable.");
  }

  const completion = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "Act like a warm English tutor. Continue the conversation naturally. Return JSON with reply and tips."
      },
      {
        role: "user",
        content: `Topic: ${topic}\nStudent message: ${message}`
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
  });

  return JSON.parse(completion.output_text);
}
