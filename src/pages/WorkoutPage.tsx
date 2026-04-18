import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutContext } from '../context/WorkoutContext';
import { ExerciseCard } from '../components/workout/ExerciseCard';
import { ExercisePicker } from '../components/exercises/ExercisePicker';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDuration, formatTimer } from '../utils';
import { useRestTimer } from '../context/RestTimerContext';
export function WorkoutPage() {
  const navigate = useNavigate();
  const {
    activeWorkout,
    isWorkoutActive,
    startWorkout,
    finishWorkout,
    discardWorkout,
    workoutDurationSeconds,
    updateWorkoutName,
    updateWorkoutNotes,
  } = useWorkoutContext();
  const { isRunning, secondsLeft, startTimer, stopTimer, resetTimer } = useRestTimer();
  const [showPicker, setShowPicker] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  if (!isWorkoutActive) {
    return (
      <div className="px-4 pt-16">
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          title="No Active Workout"
          description="Start a new workout session to begin logging your sets and reps."
          actionLabel="Start Workout"
          onAction={() => { startWorkout(); }}
        />
      </div>
    );
  }

  const totalSets = activeWorkout!.exercises.reduce((s, e) => s + e.sets.filter(st => st.completedAt).length, 0);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-lg border-b border-slate-800/50">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <input
                type="text"
                value={activeWorkout!.name || ''}
                onChange={(e) => updateWorkoutName(e.target.value)}
                placeholder="Workout"
                className="bg-transparent text-base font-bold text-slate-100 placeholder-slate-500 focus:outline-none w-36"
              />
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono">{formatDuration(workoutDurationSeconds)}</span>
                <span>|</span>
                <span>{totalSets} sets</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400"
              title="Notes"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <Button variant="success" size="sm" onClick={() => setShowFinishConfirm(true)}>
              Finish
            </Button>
          </div>
        </div>

        {/* Rest timer bar */}
        {isRunning && (
          <div className="flex items-center justify-between px-4 py-2 bg-indigo-900/30 border-t border-indigo-800/30">
            <div className="flex items-center gap-2">
              <span className="text-xs text-indigo-300">Rest</span>
              <span className="font-mono font-bold text-indigo-200">{formatTimer(secondsLeft)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startTimer(secondsLeft + 30)} className="text-xs text-indigo-400 hover:text-indigo-300">+30s</button>
              <button onClick={stopTimer} className="text-xs text-red-400 hover:text-red-300">Skip</button>
            </div>
          </div>
        )}
      </header>

      {/* Workout notes */}
      {showNotes && (
        <div className="px-4 py-3 border-b border-slate-800">
          <textarea
            value={activeWorkout!.notes || ''}
            onChange={(e) => updateWorkoutNotes(e.target.value)}
            placeholder="Workout notes..."
            rows={3}
            className="w-full bg-slate-800/40 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          />
        </div>
      )}

      {/* Exercise list */}
      <div className="flex-1 px-4 py-4 space-y-4 pb-32">
        {activeWorkout!.exercises.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 mb-4">Add your first exercise to get started</p>
          </div>
        ) : (
          activeWorkout!.exercises.map((we, index) => (
            <ExerciseCard key={we.id} workoutExercise={we} exerciseIndex={index} />
          ))
        )}

        {/* Add exercise button */}
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setShowPicker(true)}
          className="!py-4 border-2 border-dashed border-slate-700 !bg-transparent hover:!bg-slate-800/40"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Exercise
          </span>
        </Button>

        {/* Discard */}
        <div className="pt-4">
          <Button variant="danger" size="sm" fullWidth onClick={() => setShowDiscardConfirm(true)}>
            Discard Workout
          </Button>
        </div>
      </div>

      {/* Exercise picker */}
      <ExercisePicker isOpen={showPicker} onClose={() => setShowPicker(false)} />

      {/* Confirm finish */}
      <ConfirmDialog
        isOpen={showFinishConfirm}
        onClose={() => setShowFinishConfirm(false)}
        onConfirm={async () => {
          await finishWorkout();
          resetTimer();
          navigate('/');
        }}
        title="Finish Workout?"
        message={`Save this workout with ${activeWorkout!.exercises.length} exercise(s) and ${totalSets} completed set(s)?`}
        confirmLabel="Finish"
        variant="primary"
      />

      {/* Confirm discard */}
      <ConfirmDialog
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        onConfirm={() => {
          discardWorkout();
          resetTimer();
          navigate('/');
        }}
        title="Discard Workout?"
        message="This will delete all progress for this workout. This cannot be undone."
        confirmLabel="Discard"
        variant="danger"
      />
    </div>
  );
}
