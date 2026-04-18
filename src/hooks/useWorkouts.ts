import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export function useWorkouts(limit?: number) {
  return useLiveQuery(
    () => {
      let q = db.workouts.orderBy('startedAt').reverse();
      if (limit) q = q.limit(limit);
      return q.toArray();
    },
    [limit]
  ) ?? [];
}

export function useWorkout(id: string | undefined) {
  return useLiveQuery(() => (id ? db.workouts.get(id) : undefined), [id]);
}

export function useWorkoutsByExercise(exerciseId: string | undefined) {
  return useLiveQuery(async () => {
    if (!exerciseId) return [];
    const all = await db.workouts.orderBy('startedAt').reverse().toArray();
    return all.filter((w) =>
      w.exercises.some((e) => e.exerciseId === exerciseId)
    );
  }, [exerciseId]) ?? [];
}

export async function deleteWorkout(id: string): Promise<void> {
  await db.workouts.delete(id);
  // Also clean up PRs for this workout
  const prs = await db.personalRecords.where('workoutId').equals(id).toArray();
  await db.personalRecords.bulkDelete(prs.map((p) => p.id));
}
