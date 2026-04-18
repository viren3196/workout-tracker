import { useNavigate } from 'react-router-dom';
import { useWorkouts } from '../hooks/useWorkouts';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate, formatDuration, workoutDuration, workoutVolume, formatWeight } from '../utils';
import { useExercise } from '../hooks/useExercises';

export function HistoryPage() {
  const workouts = useWorkouts();
  const navigate = useNavigate();

  const completed = workouts.filter((w) => w.completedAt);

  return (
    <div>
      <Header title="History" />
      <div className="px-4 py-4">
        {completed.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="No Workouts Yet"
            description="Complete your first workout and it will appear here."
            actionLabel="Start Workout"
            onAction={() => navigate('/workout')}
          />
        ) : (
          <div className="space-y-3">
            {completed.map((w) => (
              <Card key={w.id} onClick={() => navigate(`/history/${w.id}`)} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-slate-200">{w.name || 'Workout'}</h3>
                    <p className="text-xs text-slate-500">{formatDate(w.startedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-slate-300">{formatDuration(workoutDuration(w))}</p>
                    <p className="text-xs text-slate-500">{formatWeight(workoutVolume(w))} vol</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {w.exercises.slice(0, 4).map((e) => (
                    <ExerciseBadge key={e.id} exerciseId={e.exerciseId} setCount={e.sets.length} />
                  ))}
                  {w.exercises.length > 4 && (
                    <span className="text-xs text-slate-500 self-center">+{w.exercises.length - 4} more</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExerciseBadge({ exerciseId, setCount }: { exerciseId: string; setCount: number }) {
  const exercise = useExercise(exerciseId);
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-400">
      {exercise?.name ?? 'Unknown'} <span className="text-slate-600">{setCount}s</span>
    </span>
  );
}
