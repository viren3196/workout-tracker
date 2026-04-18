import { format, formatDistanceToNow, differenceInSeconds, startOfWeek, endOfWeek, isToday, isSameDay, subDays } from 'date-fns';
import type { Workout, WorkoutSet, WorkoutExercise } from '../types';

// 1RM Estimation (Epley Formula)
export function estimatedOneRepMax(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

// Volume for a single set
export function setVolume(set: WorkoutSet): number {
  if (set.isWarmup) return 0;
  return set.weight * set.reps;
}

// Volume for an exercise in a workout
export function exerciseVolume(exercise: WorkoutExercise): number {
  return exercise.sets.reduce((sum, s) => sum + setVolume(s), 0);
}

// Total volume for a workout
export function workoutVolume(workout: Workout): number {
  return workout.exercises.reduce((sum, e) => sum + exerciseVolume(e), 0);
}

// Working sets count (excluding warmups)
export function workingSetsCount(workout: Workout): number {
  return workout.exercises.reduce(
    (sum, e) => sum + e.sets.filter((s) => !s.isWarmup).length,
    0
  );
}

// Workout duration in seconds
export function workoutDuration(workout: Workout): number {
  if (!workout.startedAt) return 0;
  const end = workout.completedAt || Date.now();
  return differenceInSeconds(end, workout.startedAt);
}

// Format duration
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// Format timer display (MM:SS)
export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Format date for display
export function formatDate(timestamp: number): string {
  return format(timestamp, 'EEE, MMM d');
}

export function formatDateFull(timestamp: number): string {
  return format(timestamp, 'EEEE, MMMM d, yyyy');
}

export function formatTime(timestamp: number): string {
  return format(timestamp, 'h:mm a');
}

export function formatRelative(timestamp: number): string {
  return formatDistanceToNow(timestamp, { addSuffix: true });
}

// Weight display
export function formatWeight(weight: number, unit: 'kg' | 'lb' = 'kg'): string {
  if (weight === 0) return 'BW';
  const val = unit === 'lb' ? weight * 2.205 : weight;
  const rounded = Math.round(val * 10) / 10;
  return `${rounded}${unit}`;
}

// Streak calculation
export function calculateStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;
  const sorted = [...workouts]
    .filter((w) => w.completedAt)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  if (sorted.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();

  // Check if worked out today
  const latestWorkout = sorted[0];
  if (!isToday(latestWorkout.completedAt!)) {
    // Check if worked out yesterday
    if (!isSameDay(latestWorkout.completedAt!, subDays(currentDate, 1))) {
      return 0;
    }
    currentDate = subDays(currentDate, 1);
  }

  for (const workout of sorted) {
    if (isSameDay(workout.completedAt!, currentDate)) {
      if (streak === 0 || !isSameDay(workout.completedAt!, subDays(currentDate, 0))) {
        streak++;
        currentDate = subDays(currentDate, 1);
      }
    }
  }

  return streak;
}

// Weekly workout count
export function weeklyWorkoutDays(workouts: Workout[]): number {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const workoutDays = new Set<string>();
  for (const w of workouts) {
    if (w.completedAt) {
      const d = new Date(w.completedAt);
      if (d >= weekStart && d <= weekEnd) {
        workoutDays.add(format(d, 'yyyy-MM-dd'));
      }
    }
  }
  return workoutDays.size;
}

// Haptic feedback
export function haptic(ms = 10): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(ms);
  }
}

// Debounce
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// Generate a simple color for muscle groups
export const MUSCLE_GROUP_COLORS: Record<string, string> = {
  chest: '#ef4444',
  shoulders: '#f97316',
  triceps: '#eab308',
  biceps: '#84cc16',
  back: '#22c55e',
  legs: '#06b6d4',
  abs: '#6366f1',
  forearms: '#a855f7',
  glutes: '#ec4899',
  fullbody: '#f43f5e',
};
