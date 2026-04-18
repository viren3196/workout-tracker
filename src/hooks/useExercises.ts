import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Exercise, MuscleGroup } from '../types';

export function useExercises() {
  const exercises = useLiveQuery(() => db.exercises.toArray()) ?? [];
  return exercises;
}

export function useExercise(id: string | undefined) {
  return useLiveQuery(() => (id ? db.exercises.get(id) : undefined), [id]);
}

export function useExercisesByCategory(category?: MuscleGroup) {
  return useLiveQuery(
    () => (category ? db.exercises.where('category').equals(category).toArray() : db.exercises.toArray()),
    [category]
  ) ?? [];
}

export function useFavoriteExercises() {
  return useLiveQuery(() => db.exercises.where('isFavorite').equals(1).toArray()) ?? [];
}

export function useRecentExercises(limit = 10) {
  return useLiveQuery(
    () => db.exercises.orderBy('lastUsed').reverse().limit(limit).toArray(),
    [limit]
  ) ?? [];
}

export async function toggleFavorite(exerciseId: string): Promise<void> {
  const ex = await db.exercises.get(exerciseId);
  if (ex) {
    await db.exercises.update(exerciseId, { isFavorite: !ex.isFavorite });
  }
}

export async function addCustomExercise(exercise: Exercise): Promise<void> {
  await db.exercises.add(exercise);
}

export async function deleteCustomExercise(exerciseId: string): Promise<void> {
  const ex = await db.exercises.get(exerciseId);
  if (ex?.isCustom) {
    await db.exercises.delete(exerciseId);
  }
}
