import { useParams, useNavigate } from 'react-router-dom';
import { useWorkout, deleteWorkout } from '../hooks/useWorkouts';
import { useExercise } from '../hooks/useExercises';
import { useWorkoutContext } from '../context/WorkoutContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, PRBadge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatDateFull, formatDuration, workoutDuration, workoutVolume, workingSetsCount, formatWeight } from '../utils';
import { saveWorkoutAsTemplate } from '../hooks/useTemplates';
import { useState } from 'react';
import type { WorkoutExercise } from '../types';

export function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const workout = useWorkout(id);
  const navigate = useNavigate();
  const { startWorkout, addExercise } = useWorkoutContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [savedTemplate, setSavedTemplate] = useState(false);

  if (!workout) {
    return (
      <div>
        <Header title="Workout" showBack />
        <div className="p-8 text-center text-slate-500">Workout not found</div>
      </div>
    );
  }

  const handleRepeat = () => {
    startWorkout(workout.name);
    for (const ex of workout.exercises) {
      addExercise(ex.exerciseId, ex.sets[0]?.equipmentType ?? 'BARBELL', ex.sets[0]?.weightMode ?? 'TOTAL_WEIGHT');
    }
    navigate('/workout');
  };

  const handleSaveTemplate = async () => {
    await saveWorkoutAsTemplate(workout, workout.name || 'My Template');
    setSavedTemplate(true);
    setTimeout(() => setSavedTemplate(false), 2000);
  };

  return (
    <div>
      <Header
        title={workout.name || 'Workout'}
        showBack
        right={
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Summary */}
        <Card className="p-4">
          <p className="text-sm text-slate-400 mb-3">{formatDateFull(workout.startedAt)}</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-0.5">Duration</p>
              <p className="text-lg font-bold text-slate-100 font-mono">{formatDuration(workoutDuration(workout))}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-0.5">Volume</p>
              <p className="text-lg font-bold text-slate-100">{formatWeight(workoutVolume(workout))}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-0.5">Sets</p>
              <p className="text-lg font-bold text-slate-100">{workingSetsCount(workout)}</p>
            </div>
          </div>
        </Card>

        {workout.notes && (
          <Card className="p-4">
            <p className="text-xs text-slate-500 mb-1">Notes</p>
            <p className="text-sm text-slate-300">{workout.notes}</p>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="primary" fullWidth onClick={handleRepeat}>
            Repeat Workout
          </Button>
          <Button variant="secondary" fullWidth onClick={handleSaveTemplate}>
            {savedTemplate ? 'Saved!' : 'Save Template'}
          </Button>
        </div>

        {/* Exercises */}
        <div className="space-y-3">
          {workout.exercises.map((we) => (
            <WorkoutExerciseDetail key={we.id} workoutExercise={we} />
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          await deleteWorkout(workout.id);
          navigate('/history');
        }}
        title="Delete Workout?"
        message="This will permanently delete this workout and its data."
        confirmLabel="Delete"
      />
    </div>
  );
}

function WorkoutExerciseDetail({ workoutExercise }: { workoutExercise: WorkoutExercise }) {
  const exercise = useExercise(workoutExercise.exerciseId);

  return (
    <Card className="p-4">
      <h3 className="font-medium text-slate-200 mb-3">{exercise?.name ?? 'Unknown Exercise'}</h3>
      <div className="space-y-1.5">
        {workoutExercise.sets.map((set, i) => (
          <div key={set.id} className="flex items-center gap-3 text-sm">
            <span className="w-6 text-xs text-slate-500">{set.isWarmup ? 'W' : i + 1}</span>
            <span className={`font-mono ${set.isWarmup ? 'text-slate-500' : 'text-slate-200'}`}>
              {formatWeight(set.weight)}
            </span>
            <span className="text-slate-600">x</span>
            <span className={`font-mono ${set.isWarmup ? 'text-slate-500' : 'text-slate-200'}`}>
              {set.reps}
            </span>
            {set.isPR && <PRBadge />}
            {set.rpe && <Badge variant="warning">RPE {set.rpe}</Badge>}
          </div>
        ))}
      </div>
      {workoutExercise.notes && (
        <p className="mt-2 text-xs text-slate-500">{workoutExercise.notes}</p>
      )}
    </Card>
  );
}
