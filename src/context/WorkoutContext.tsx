import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { db } from '../db/database';
import type { Workout, WorkoutSet, EquipmentType, WeightMode } from '../types';
import { haptic, debounce } from '../utils';

interface WorkoutContextValue {
  activeWorkout: Workout | null;
  isWorkoutActive: boolean;
  startWorkout: (name?: string, templateId?: string) => void;
  finishWorkout: () => Promise<void>;
  discardWorkout: () => void;
  addExercise: (exerciseId: string, equipmentType: EquipmentType, weightMode: WeightMode) => void;
  removeExercise: (exerciseIndex: number) => void;
  reorderExercise: (from: number, to: number) => void;
  addSet: (exerciseIndex: number, prefill?: Partial<WorkoutSet>) => void;
  updateSet: (exerciseIndex: number, setIndex: number, updates: Partial<WorkoutSet>) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  duplicateSet: (exerciseIndex: number, setIndex: number) => void;
  completeSet: (exerciseIndex: number, setIndex: number) => void;
  updateExerciseNotes: (exerciseIndex: number, notes: string) => void;
  updateWorkoutNotes: (notes: string) => void;
  updateWorkoutName: (name: string) => void;
  workoutDurationSeconds: number;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const durationRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Load active workout from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('activeWorkout');
    if (saved) {
      try {
        const w = JSON.parse(saved) as Workout;
        if (!w.completedAt) {
          setActiveWorkout(w);
        }
      } catch { /* ignore corrupt data */ }
    }
  }, []);

  // Duration timer
  useEffect(() => {
    if (activeWorkout && !activeWorkout.completedAt) {
      const updateDuration = () => {
        setDurationSeconds(Math.floor((Date.now() - activeWorkout.startedAt) / 1000));
      };
      updateDuration();
      durationRef.current = setInterval(updateDuration, 1000);
      return () => clearInterval(durationRef.current);
    } else {
      setDurationSeconds(0);
    }
  }, [activeWorkout?.startedAt, activeWorkout?.completedAt]);

  // Auto-save debounced
  const saveToStorage = useCallback(
    debounce((w: Workout) => {
      localStorage.setItem('activeWorkout', JSON.stringify(w));
    }, 500),
    []
  );

  const updateWorkout = useCallback((updater: (w: Workout) => Workout) => {
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const startWorkout = useCallback((name?: string, templateId?: string) => {
    const w: Workout = {
      id: uuid(),
      name: name || undefined,
      startedAt: Date.now(),
      exercises: [],
      templateId,
    };
    setActiveWorkout(w);
    localStorage.setItem('activeWorkout', JSON.stringify(w));
  }, []);

  const finishWorkout = useCallback(async () => {
    if (!activeWorkout) return;
    const completed = { ...activeWorkout, completedAt: Date.now() };
    await db.workouts.add(completed);

    // Update lastUsed on exercises
    for (const ex of completed.exercises) {
      await db.exercises.update(ex.exerciseId, { lastUsed: Date.now() });
    }

    setActiveWorkout(null);
    localStorage.removeItem('activeWorkout');
    clearInterval(durationRef.current);
  }, [activeWorkout]);

  const discardWorkout = useCallback(() => {
    setActiveWorkout(null);
    localStorage.removeItem('activeWorkout');
    clearInterval(durationRef.current);
  }, []);

  const addExercise = useCallback((exerciseId: string, equipmentType: EquipmentType, weightMode: WeightMode) => {
    updateWorkout((w) => ({
      ...w,
      exercises: [
        ...w.exercises,
        {
          id: uuid(),
          exerciseId,
          order: w.exercises.length,
          sets: [
            {
              id: uuid(),
              order: 0,
              reps: 0,
              weight: 0,
              equipmentType,
              weightMode,
              isWarmup: false,
              isPR: false,
            },
          ],
        },
      ],
    }));
  }, [updateWorkout]);

  const removeExercise = useCallback((exerciseIndex: number) => {
    updateWorkout((w) => ({
      ...w,
      exercises: w.exercises
        .filter((_, i) => i !== exerciseIndex)
        .map((e, i) => ({ ...e, order: i })),
    }));
  }, [updateWorkout]);

  const reorderExercise = useCallback((from: number, to: number) => {
    updateWorkout((w) => {
      const exercises = [...w.exercises];
      const [moved] = exercises.splice(from, 1);
      exercises.splice(to, 0, moved);
      return { ...w, exercises: exercises.map((e, i) => ({ ...e, order: i })) };
    });
  }, [updateWorkout]);

  const addSet = useCallback((exerciseIndex: number, prefill?: Partial<WorkoutSet>) => {
    updateWorkout((w) => {
      const exercises = [...w.exercises];
      const ex = { ...exercises[exerciseIndex] };
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet: WorkoutSet = {
        id: uuid(),
        order: ex.sets.length,
        reps: prefill?.reps ?? lastSet?.reps ?? 0,
        weight: prefill?.weight ?? lastSet?.weight ?? 0,
        equipmentType: prefill?.equipmentType ?? lastSet?.equipmentType ?? ex.sets[0]?.equipmentType ?? 'BARBELL',
        weightMode: prefill?.weightMode ?? lastSet?.weightMode ?? ex.sets[0]?.weightMode ?? 'TOTAL_WEIGHT',
        isWarmup: prefill?.isWarmup ?? false,
        isPR: false,
      };
      ex.sets = [...ex.sets, newSet];
      exercises[exerciseIndex] = ex;
      return { ...w, exercises };
    });
    haptic();
  }, [updateWorkout]);

  const updateSet = useCallback((exerciseIndex: number, setIndex: number, updates: Partial<WorkoutSet>) => {
    updateWorkout((w) => {
      const exercises = [...w.exercises];
      const ex = { ...exercises[exerciseIndex] };
      const sets = [...ex.sets];
      sets[setIndex] = { ...sets[setIndex], ...updates };
      ex.sets = sets;
      exercises[exerciseIndex] = ex;
      return { ...w, exercises };
    });
  }, [updateWorkout]);

  const removeSet = useCallback((exerciseIndex: number, setIndex: number) => {
    updateWorkout((w) => {
      const exercises = [...w.exercises];
      const ex = { ...exercises[exerciseIndex] };
      ex.sets = ex.sets.filter((_, i) => i !== setIndex).map((s, i) => ({ ...s, order: i }));
      exercises[exerciseIndex] = ex;
      return { ...w, exercises };
    });
  }, [updateWorkout]);

  const duplicateSet = useCallback((exerciseIndex: number, setIndex: number) => {
    updateWorkout((w) => {
      const exercises = [...w.exercises];
      const ex = { ...exercises[exerciseIndex] };
      const source = ex.sets[setIndex];
      const dup: WorkoutSet = {
        ...source,
        id: uuid(),
        order: ex.sets.length,
        completedAt: undefined,
        isPR: false,
      };
      ex.sets = [...ex.sets, dup];
      exercises[exerciseIndex] = ex;
      return { ...w, exercises };
    });
    haptic();
  }, [updateWorkout]);

  const completeSet = useCallback((exerciseIndex: number, setIndex: number) => {
    updateWorkout((w) => {
      const exercises = [...w.exercises];
      const ex = { ...exercises[exerciseIndex] };
      const sets = [...ex.sets];
      sets[setIndex] = { ...sets[setIndex], completedAt: Date.now() };
      ex.sets = sets;
      exercises[exerciseIndex] = ex;
      return { ...w, exercises };
    });
    haptic(20);
  }, [updateWorkout]);

  const updateExerciseNotes = useCallback((exerciseIndex: number, notes: string) => {
    updateWorkout((w) => {
      const exercises = [...w.exercises];
      exercises[exerciseIndex] = { ...exercises[exerciseIndex], notes };
      return { ...w, exercises };
    });
  }, [updateWorkout]);

  const updateWorkoutNotes = useCallback((notes: string) => {
    updateWorkout((w) => ({ ...w, notes }));
  }, [updateWorkout]);

  const updateWorkoutName = useCallback((name: string) => {
    updateWorkout((w) => ({ ...w, name }));
  }, [updateWorkout]);

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        isWorkoutActive: !!activeWorkout && !activeWorkout.completedAt,
        startWorkout,
        finishWorkout,
        discardWorkout,
        addExercise,
        removeExercise,
        reorderExercise,
        addSet,
        updateSet,
        removeSet,
        duplicateSet,
        completeSet,
        updateExerciseNotes,
        updateWorkoutNotes,
        updateWorkoutName,
        workoutDurationSeconds: durationSeconds,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkoutContext(): WorkoutContextValue {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkoutContext must be used within WorkoutProvider');
  return ctx;
}
