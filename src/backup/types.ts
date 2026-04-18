import type { Exercise, Workout, PersonalRecord, WorkoutTemplate, BodyWeightLog, UserSettings } from '../types';

export interface BackupData {
  version: number;
  exportedAt: number;
  exercises: Exercise[];
  workouts: Workout[];
  personalRecords: PersonalRecord[];
  templates: WorkoutTemplate[];
  bodyWeightLogs: BodyWeightLog[];
  settings: UserSettings[];
}

export interface BackupProvider {
  export(): Promise<BackupData>;
  import(data: BackupData): Promise<void>;
}

export const CURRENT_BACKUP_VERSION = 1;
