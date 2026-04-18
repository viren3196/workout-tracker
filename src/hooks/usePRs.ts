import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { db } from '../db/database';
import type { PersonalRecord, WorkoutSet } from '../types';
import { estimatedOneRepMax } from '../utils';

export function usePRs(exerciseId?: string) {
  return useLiveQuery(
    () => {
      if (exerciseId) {
        return db.personalRecords.where('exerciseId').equals(exerciseId).toArray();
      }
      return db.personalRecords.toArray();
    },
    [exerciseId]
  ) ?? [];
}

export function useRecentPRs(limit = 5) {
  return useLiveQuery(
    () => db.personalRecords.orderBy('achievedAt').reverse().limit(limit).toArray(),
    [limit]
  ) ?? [];
}

export async function checkAndRecordPR(
  exerciseId: string,
  set: WorkoutSet,
  workoutId: string
): Promise<PersonalRecord[]> {
  if (set.isWarmup || set.reps === 0 || set.weight === 0) return [];

  const existingPRs = await db.personalRecords
    .where('exerciseId')
    .equals(exerciseId)
    .toArray();

  const newPRs: PersonalRecord[] = [];

  // Check weight PR
  const weightPR = existingPRs.find((p) => p.type === 'weight');
  if (!weightPR || set.weight > weightPR.value) {
    const pr: PersonalRecord = {
      id: uuid(),
      exerciseId,
      type: 'weight',
      value: set.weight,
      workoutId,
      setId: set.id,
      achievedAt: Date.now(),
    };
    newPRs.push(pr);
    if (weightPR) await db.personalRecords.delete(weightPR.id);
  }

  // Check volume PR (single set)
  const vol = set.weight * set.reps;
  const volPR = existingPRs.find((p) => p.type === 'volume');
  if (!volPR || vol > volPR.value) {
    const pr: PersonalRecord = {
      id: uuid(),
      exerciseId,
      type: 'volume',
      value: vol,
      workoutId,
      setId: set.id,
      achievedAt: Date.now(),
    };
    newPRs.push(pr);
    if (volPR) await db.personalRecords.delete(volPR.id);
  }

  // Check estimated 1RM PR
  const e1rm = estimatedOneRepMax(set.weight, set.reps);
  const e1rmPR = existingPRs.find((p) => p.type === 'estimated1rm');
  if (!e1rmPR || e1rm > e1rmPR.value) {
    const pr: PersonalRecord = {
      id: uuid(),
      exerciseId,
      type: 'estimated1rm',
      value: e1rm,
      workoutId,
      setId: set.id,
      achievedAt: Date.now(),
    };
    newPRs.push(pr);
    if (e1rmPR) await db.personalRecords.delete(e1rmPR.id);
  }

  // Check reps PR (at a given weight)
  const repsPR = existingPRs.find((p) => p.type === 'reps');
  if (!repsPR || set.reps > repsPR.value) {
    const pr: PersonalRecord = {
      id: uuid(),
      exerciseId,
      type: 'reps',
      value: set.reps,
      workoutId,
      setId: set.id,
      achievedAt: Date.now(),
    };
    newPRs.push(pr);
    if (repsPR) await db.personalRecords.delete(repsPR.id);
  }

  if (newPRs.length > 0) {
    await db.personalRecords.bulkAdd(newPRs);
  }

  return newPRs;
}
