export enum GamePhase {
  MENU,
  CHAPTER_SELECT,
  PRESCRIPTION,
  PLAYING,
  ROUND_RESULT,
  GAME_OVER
}

export interface Drug {
  id: string;
  name: string;
  familyId: string;
  baseDamage: number; // Effectiveness against susceptible bacteria
  nephrotoxicity: number; // 0 to 10 scale
  cost: number; // Resistance cost
}

export interface DrugFamily {
  id: string;
  name: string;
  drugs: Drug[];
}

export interface TextbookChapter {
  id: string;
  title: string;
  sectionId: string;
}

export interface TextbookSection {
  id: string;
  title: string;
  chapters: TextbookChapter[];
}

export interface Disease {
  id: string;
  chapterId: string; // Links to the TextbookChapter
  name: string;
  description: string;
  pathogen: string;
  bacteriaColor: string;
  baseBacteriaCount: number;
  susceptibleTo: string[]; // Drug IDs
  resistantTo: string[]; // Drug IDs
  optimalTreatment: {
    drugId: string;
    durationDays: number;
    intervalHours: number;
    doseMg: number;
  };
}

export interface PlayerStats {
  bpSystolic: number; // Starts 120. < 90 is shock.
  creatinine: number; // Starts 0.8. > 2.0 is failure.
  resistanceScore: number;
  level: number;
}

export interface Prescription {
  drug: Drug;
  doseMg: number;
  intervalHours: number; // 6, 8, 12, 24
  durationDays: number;
}

export interface SimulationConfig {
  ammoCount: number;
  damagePerShot: number;
  toxicityPerShot: number;
  bacteriaCount: number;
  bacteriaSpeed: number;
  bacteriaColor: string;
  isCorrectDrug: boolean;
}