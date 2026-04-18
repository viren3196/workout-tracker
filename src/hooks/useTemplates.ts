import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuid } from 'uuid';
import { db } from '../db/database';
import type { TemplateExercise, Workout } from '../types';

export function useTemplates() {
  return useLiveQuery(() => db.templates.orderBy('lastUsedAt').reverse().toArray()) ?? [];
}

export function useTemplate(id: string | undefined) {
  return useLiveQuery(() => (id ? db.templates.get(id) : undefined), [id]);
}

export async function createTemplate(name: string, exercises: TemplateExercise[]): Promise<string> {
  const id = uuid();
  await db.templates.add({
    id,
    name,
    exercises,
    createdAt: Date.now(),
  });
  return id;
}

export async function saveWorkoutAsTemplate(workout: Workout, name: string): Promise<string> {
  const exercises: TemplateExercise[] = workout.exercises.map((e, i) => ({
    exerciseId: e.exerciseId,
    order: i,
    defaultSets: e.sets.filter((s) => !s.isWarmup).length,
    defaultReps: e.sets.find((s) => !s.isWarmup)?.reps,
    defaultWeight: e.sets.find((s) => !s.isWarmup)?.weight,
  }));
  return createTemplate(name, exercises);
}

export async function deleteTemplate(id: string): Promise<void> {
  await db.templates.delete(id);
}

export async function updateTemplateLastUsed(id: string): Promise<void> {
  await db.templates.update(id, { lastUsedAt: Date.now() });
}
