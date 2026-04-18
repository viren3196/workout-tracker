export type MuscleGroup =
  | 'chest'
  | 'shoulders'
  | 'triceps'
  | 'biceps'
  | 'back'
  | 'legs'
  | 'abs'
  | 'forearms'
  | 'glutes'
  | 'fullbody';

export type EquipmentType =
  | 'BARBELL'
  | 'DUMBBELL'
  | 'MACHINE'
  | 'CABLE'
  | 'BODYWEIGHT'
  | 'BODYWEIGHT_PLUS'
  | 'BODYWEIGHT_ASSISTED'
  | 'PLATE_LOADED'
  | 'OTHER';

export type WeightMode =
  | 'TOTAL_WEIGHT'
  | 'PLATES_ONLY'
  | 'PER_SIDE'
  | 'COMBINED'
  | 'STACK_WEIGHT'
  | 'BODYWEIGHT_ONLY'
  | 'ADDED_WEIGHT'
  | 'ASSISTED_WEIGHT';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  equipmentType: EquipmentType;
  weightMode: WeightMode;
  defaultBarWeight?: number;
  isFavorite: boolean;
  isCustom: boolean;
  lastUsed?: number;
  notes?: string;
}

export interface WorkoutSet {
  id: string;
  order: number;
  reps: number;
  weight: number;
  equipmentType: EquipmentType;
  weightMode: WeightMode;
  isWarmup: boolean;
  isPR: boolean;
  completedAt?: number;
  notes?: string;
  rpe?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  order: number;
  notes?: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name?: string;
  startedAt: number;
  completedAt?: number;
  notes?: string;
  exercises: WorkoutExercise[];
  templateId?: string;
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  type: 'weight' | 'volume' | 'estimated1rm' | 'reps';
  value: number;
  workoutId: string;
  setId: string;
  achievedAt: number;
}

export interface TemplateExercise {
  exerciseId: string;
  order: number;
  defaultSets?: number;
  defaultReps?: number;
  defaultWeight?: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: TemplateExercise[];
  createdAt: number;
  lastUsedAt?: number;
}

export interface BodyWeightLog {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

export interface UserSettings {
  id: string;
  weightUnit: 'kg' | 'lb';
  defaultRestTimer: number;
  bodyWeight?: number;
  theme: 'dark' | 'light';
}

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  shoulders: 'Shoulders',
  triceps: 'Triceps',
  biceps: 'Biceps',
  back: 'Back',
  legs: 'Legs',
  abs: 'Abs / Core',
  forearms: 'Forearms',
  glutes: 'Glutes',
  fullbody: 'Full Body',
};

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  BARBELL: 'Barbell',
  DUMBBELL: 'Dumbbell',
  MACHINE: 'Machine',
  CABLE: 'Cable',
  BODYWEIGHT: 'Bodyweight',
  BODYWEIGHT_PLUS: 'Bodyweight + Weight',
  BODYWEIGHT_ASSISTED: 'Assisted',
  PLATE_LOADED: 'Plate Loaded',
  OTHER: 'Other',
};
