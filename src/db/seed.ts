import { db } from './database';
import { DEFAULT_EXERCISES } from '../data/exercises';

export async function seedDatabase(): Promise<void> {
  const count = await db.exercises.count();
  if (count === 0) {
    await db.exercises.bulkAdd(DEFAULT_EXERCISES);
  }

  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.add({
      id: 'user-settings',
      weightUnit: 'kg',
      defaultRestTimer: 90,
      theme: 'dark',
    });
  }
}
