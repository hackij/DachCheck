export type Level = "basis" | "advanced" | "pro";
export type Category = "roof-form" | "roof-variation" | "dormer" | "roof-detail" | "definition" | "transfer";

export type Question = {
  id: string;
  category: Category;
  knowledgeLevel: Level;
  difficulty: 1 | 2 | 3;
  image?: string;
  imageType: "illustration" | "photo";
  visual: string;
  question: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  hint: string;
  alternativeTerms?: string[];
  source: string;
  sourceLicense: string;
  core?: boolean;
};

export type Mode = "guided" | "free" | "mixed" | "review";
