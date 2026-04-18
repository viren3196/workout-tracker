import { useNavigate } from 'react-router-dom';
import { useWorkouts } from '../hooks/useWorkouts';
import { useRecentPRs } from '../hooks/usePRs';
import { useExercise } from '../hooks/useExercises';
import { useWorkoutContext } from '../context/WorkoutContext';
import { Card } from '../components/ui/Card';
import { PRBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatDate, formatDuration, workoutDuration, workingSetsCount, formatWeight, weeklyWorkoutDays } from '../utils';

export function DashboardPage() {
  const navigate = useNavigate();
  const workouts = useWorkouts(10);
  const recentPRs = useRecentPRs(5);
  const { isWorkoutActive, startWorkout } = useWorkoutContext();

  const completedWorkouts = workouts.filter((w) => w.completedAt);
  const weeklyDays = weeklyWorkoutDays(completedWorkouts);
  const totalWorkouts = completedWorkouts.length;

  const handleStartWorkout = () => {
    if (isWorkoutActive) {
      navigate('/workout');
    } else {
      startWorkout();
      navigate('/workout');
    }
  };

  return (
    <div className="px-4 pt-6 pb-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">IronLog</h1>
          <p className="text-sm text-slate-500">Track your strength</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="This Week" value={`${weeklyDays}`} sub="days" />
        <StatCard label="Total" value={`${totalWorkouts}`} sub="workouts" />
        <StatCard
          label="Last"
          value={completedWorkouts[0] ? formatDate(completedWorkouts[0].completedAt!) : '--'}
          sub=""
          small
        />
      </div>

      {/* Start / Continue Workout */}
      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={handleStartWorkout}
        className="!py-5 !text-base !font-bold shadow-lg shadow-indigo-600/20"
      >
        {isWorkoutActive ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Continue Workout
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Workout
          </span>
        )}
      </Button>

      {/* Recent PRs */}
      {recentPRs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent PRs</h2>
          <div className="space-y-2">
            {recentPRs.map((pr) => (
              <PRCard key={pr.id} pr={pr} />
            ))}
          </div>
        </section>
      )}

      {/* Recent workouts */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Workouts</h2>
          {completedWorkouts.length > 3 && (
            <button onClick={() => navigate('/history')} className="text-xs text-indigo-400 hover:text-indigo-300">
              View All
            </button>
          )}
        </div>
        {completedWorkouts.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-sm text-slate-500">Complete your first workout to see it here</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {completedWorkouts.slice(0, 5).map((w) => (
              <Card
                key={w.id}
                onClick={() => navigate(`/history/${w.id}`)}
                className="p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-200">{w.name || 'Workout'}</h3>
                    <p className="text-xs text-slate-500">{formatDate(w.startedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-slate-300">{formatDuration(workoutDuration(w))}</p>
                    <p className="text-xs text-slate-500">
                      {w.exercises.length} ex / {workingSetsCount(w)} sets
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card onClick={() => navigate('/templates')} className="p-4 text-center">
            <svg className="w-6 h-6 mx-auto mb-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <p className="text-sm font-medium text-slate-300">Templates</p>
          </Card>
          <Card onClick={() => navigate('/body-weight')} className="p-4 text-center">
            <svg className="w-6 h-6 mx-auto mb-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <p className="text-sm font-medium text-slate-300">Body Weight</p>
          </Card>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub, small }: { label: string; value: string; sub: string; small?: boolean }) {
  return (
    <Card className="p-3 text-center">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`font-bold text-slate-100 ${small ? 'text-xs' : 'text-xl'}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-500">{sub}</p>}
    </Card>
  );
}

function PRCard({ pr }: { pr: { exerciseId: string; type: string; value: number; achievedAt: number } }) {
  const exercise = useExercise(pr.exerciseId);
  return (
    <Card className="p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <PRBadge />
        <div>
          <p className="text-sm font-medium text-slate-200">{exercise?.name ?? 'Unknown'}</p>
          <p className="text-xs text-slate-500 capitalize">{pr.type.replace('estimated1rm', 'Est. 1RM')}</p>
        </div>
      </div>
      <p className="text-sm font-bold text-amber-400">
        {pr.type === 'reps' ? `${pr.value} reps` : formatWeight(pr.value)}
      </p>
    </Card>
  );
}
