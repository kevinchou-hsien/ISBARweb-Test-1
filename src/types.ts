export type IsbarCategory = 'I' | 'S' | 'B' | 'A' | 'R' | 'NOISE';

export type DifficultyLevel = 'Level 1' | 'Level 2' | 'Level 3';

export interface Keyword {
  id: string;
  text: string;
  category: IsbarCategory;
  description: string;
  isNoise?: boolean;
  priority?: number; // Lower number = higher priority
}

export interface Scenario {
  id: string;
  title: string;
  patientName: string;
  bedNumber: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  fullStory: string;
  keywords: Keyword[];
  difficulty: DifficultyLevel;
  ward: string;
  timeLimit?: number; // In seconds, 0 or undefined means no limit
}
