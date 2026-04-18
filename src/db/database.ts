import Dexie, { type Table } from 'dexie';
import type {
  Exercise,
  Workout,
  PersonalRecord,
  WorkoutTemplate,
  BodyWeightLog,
  UserSettings,
} from '../types';

export class WorkoutDatabase extends Dexie {
  exercises!: Table<Exercise, string>;
  workouts!: Table<Workout, string>;
  personalRecords!: Table<PersonalRecord, string>;
  templates!: Table<WorkoutTemplate, string>;
  bodyWeightLogs!: Table<BodyWeightLog, string>;
  settings!: Table<UserSettings, string>;

  constructor() {
    super('IronLogDB');

    this.version(1).stores({
      exercises: 'id, name, category, isFavorite, isCustom, lastUsed',
      workouts: 'id, startedAt, completedAt, templateId',
      personalRecords: 'id, exerciseId, type, achievedAt',
      templates: 'id, name, createdAt, lastUsedAt',
      bodyWeightLogs: 'id, date',
      settings: 'id',
    });
  }
}

export const db = new WorkoutDatabase();
