import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { db } from '../db/database';
export function useBodyWeightLogs(limit?: number) {
  return useLiveQuery(
    () => {
      let q = db.bodyWeightLogs.orderBy('date').reverse();
      if (limit) q = q.limit(limit);
      return q.toArray();
    },
    [limit]
  ) ?? [];
}

export async function addBodyWeightLog(weight: number, date: string, notes?: string): Promise<void> {
  // Check if entry exists for this date
  const existing = await db.bodyWeightLogs.where('date').equals(date).first();
  if (existing) {
    await db.bodyWeightLogs.update(existing.id, { weight, notes });
  } else {
    await db.bodyWeightLogs.add({
      id: uuid(),
      weight,
      date,
      notes,
    });
  }
}

export async function deleteBodyWeightLog(id: string): Promise<void> {
  await db.bodyWeightLogs.delete(id);
}
