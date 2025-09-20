export interface Question {
  category: string;
  value: number;
  question: string;
  answer?: string;
  answers?: string[];
  isFinal?: boolean;
  used?: boolean;
  image?: string;
  audio?: string;
}

export interface Player {
  name: string;
  score: number;
}
