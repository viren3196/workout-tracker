import { db } from '../db/database';
import type { BackupData, BackupProvider } from './types';
import { CURRENT_BACKUP_VERSION } from './types';

export class LocalBackupProvider implements BackupProvider {
  async export(): Promise<BackupData> {
    const [exercises, workouts, personalRecords, templates, bodyWeightLogs, settings] =
      await Promise.all([
        db.exercises.toArray(),
        db.workouts.toArray(),
        db.personalRecords.toArray(),
        db.templates.toArray(),
        db.bodyWeightLogs.toArray(),
        db.settings.toArray(),
      ]);

    return {
      version: CURRENT_BACKUP_VERSION,
      exportedAt: Date.now(),
      exercises,
      workouts,
      personalRecords,
      templates,
      bodyWeightLogs,
      settings,
    };
  }

  async import(data: BackupData): Promise<void> {
    if (!data.version || data.version > CURRENT_BACKUP_VERSION) {
      throw new Error(`Unsupported backup version: ${data.version}. Current: ${CURRENT_BACKUP_VERSION}`);
    }
    if (!data.exercises || !data.workouts) {
      throw new Error('Invalid backup data: missing required fields');
    }

    await db.transaction('rw', [db.exercises, db.workouts, db.personalRecords, db.templates, db.bodyWeightLogs, db.settings], async () => {
      await db.exercises.clear();
      await db.workouts.clear();
      await db.personalRecords.clear();
      await db.templates.clear();
      await db.bodyWeightLogs.clear();
      await db.settings.clear();

      if (data.exercises.length) await db.exercises.bulkAdd(data.exercises);
      if (data.workouts.length) await db.workouts.bulkAdd(data.workouts);
      if (data.personalRecords.length) await db.personalRecords.bulkAdd(data.personalRecords);
      if (data.templates.length) await db.templates.bulkAdd(data.templates);
      if (data.bodyWeightLogs.length) await db.bodyWeightLogs.bulkAdd(data.bodyWeightLogs);
      if (data.settings.length) await db.settings.bulkAdd(data.settings);
    });
  }
}

export function downloadBackup(data: BackupData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ironlog-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function readBackupFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as BackupData;
        resolve(data);
      } catch {
        reject(new Error('Failed to parse backup file. Make sure it is a valid IronLog backup.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
