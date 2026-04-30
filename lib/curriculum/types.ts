import type { CourseLevel, LessonType } from "@/types";

export interface AiScenario {
  role: string;
  situation: string;
  openingLine: string;
  coachInstructions: string[];
}

export interface CurriculumLesson {
  id: string;
  day: number;
  title: string;
  type: LessonType;
  durationMinutes: number;
  objective: string;
  explanation: string;
  examples: string[];
  speakingTask: string;
  practiceExercise: string;
  speakingPrompts: string[];
  realLifeScenario: string;
  aiScenario: AiScenario;
  dailyChallenge: string;
  pronunciationDrill: string;
  commonMistake: {
    wrong: string;
    correct: string;
    why: string;
  };
  confidenceBooster: string;
}

export interface CurriculumLevel {
  id: string;
  title: string;
  level: CourseLevel;
  promise: string;
  methodology: string[];
  lessons: CurriculumLesson[];
}

export interface VerbalyxCurriculum {
  program: string;
  version: string;
  levels: CurriculumLevel[];
}
