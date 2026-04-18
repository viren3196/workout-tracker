import { useState } from 'react';
import type { WorkoutExercise } from '../../types';
import { useExercise } from '../../hooks/useExercises';
import { useWorkoutContext } from '../../context/WorkoutContext';
import { useRestTimer } from '../../context/RestTimerContext';
import { useSettings } from '../../hooks/useSettings';
import { SetRow } from './SetRow';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { checkAndRecordPR } from '../../hooks/usePRs';
import { haptic } from '../../utils';

interface ExerciseCardProps {
  workoutExercise: WorkoutExercise;
  exerciseIndex: number;
}

export function ExerciseCard({ workoutExercise, exerciseIndex }: ExerciseCardProps) {
  const exercise = useExercise(workoutExercise.exerciseId);
  const { activeWorkout, addSet, updateSet, removeSet, duplicateSet, completeSet, removeExercise, updateExerciseNotes } = useWorkoutContext();
  const { startTimer } = useRestTimer();
  const settings = useSettings();
  const [showNotes, setShowNotes] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!exercise) return null;

  const handleCompleteSet = async (setIndex: number) => {
    completeSet(exerciseIndex, setIndex);
    const set = workoutExercise.sets[setIndex];
    if (set && !set.isWarmup && set.weight > 0 && set.reps > 0 && activeWorkout) {
      const newPRs = await checkAndRecordPR(workoutExercise.exerciseId, set, activeWorkout.id);
      if (newPRs.length > 0) {
        updateSet(exerciseIndex, setIndex, { isPR: true });
        haptic(50);
      }
    }
    // Start rest timer
    startTimer(settings.defaultRestTimer);
  };

  return (
    <Card className="overflow-hidden">
      {/* Exercise header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 truncate">{exercise.name}</h3>
          <p className="text-xs text-slate-500 capitalize">{exercise.category}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-900/30 text-slate-500 hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Notes */}
      {showNotes && (
        <div className="px-4 py-2 border-b border-slate-800/50">
          <textarea
            value={workoutExercise.notes || ''}
            onChange={(e) => updateExerciseNotes(exerciseIndex, e.target.value)}
            placeholder="Exercise notes..."
            rows={2}
            className="w-full bg-slate-800/40 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          />
        </div>
      )}

      {/* Column headers */}
      <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
        <div className="w-8 text-center">Set</div>
        <div className="flex-1 text-center">Weight</div>
        <div className="flex-1 text-center">Reps</div>
        <div className="w-10" />
        <div className="w-8" />
      </div>

      {/* Sets */}
      <div className="px-2 pb-2 space-y-1">
        {workoutExercise.sets.map((set, setIndex) => (
          <SetRow
            key={set.id}
            set={set}
            index={set.isWarmup ? setIndex : workoutExercise.sets.filter((s, i) => i <= setIndex && !s.isWarmup).length - 1}
            onUpdate={(updates) => updateSet(exerciseIndex, setIndex, updates)}
            onRemove={() => removeSet(exerciseIndex, setIndex)}
            onDuplicate={() => duplicateSet(exerciseIndex, setIndex)}
            onComplete={() => handleCompleteSet(setIndex)}
          />
        ))}
      </div>

      {/* Add set button */}
      <div className="px-4 pb-3">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={() => addSet(exerciseIndex)}
          className="border border-dashed border-slate-700"
        >
          + Add Set
        </Button>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="px-4 pb-3 flex gap-2">
          <Button variant="secondary" size="sm" fullWidth onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            fullWidth
            onClick={() => removeExercise(exerciseIndex)}
          >
            Remove Exercise
          </Button>
        </div>
      )}
    </Card>
  );
}
