import { useParams } from 'react-router-dom';
import { useExercise } from '../hooks/useExercises';
import { useWorkoutsByExercise } from '../hooks/useWorkouts';
import { usePRs } from '../hooks/usePRs';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Badge, PRBadge } from '../components/ui/Badge';
import { MUSCLE_GROUP_LABELS, EQUIPMENT_TYPE_LABELS } from '../types';
import { formatDate, formatWeight } from '../utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const exercise = useExercise(id);
  const workouts = useWorkoutsByExercise(id);
  const prs = usePRs(id);

  if (!exercise) {
    return (
      <div>
        <Header title="Exercise" showBack />
        <div className="p-8 text-center text-slate-500">Exercise not found</div>
      </div>
    );
  }

  // Build progression data
  const progressionData = workouts
    .filter((w) => w.completedAt)
    .map((w) => {
      const exEntry = w.exercises.find((e) => e.exerciseId === id);
      if (!exEntry) return null;
      const workingSets = exEntry.sets.filter((s) => !s.isWarmup && s.weight > 0);
      if (workingSets.length === 0) return null;
      const maxWeight = Math.max(...workingSets.map((s) => s.weight));
      const totalVolume = workingSets.reduce((sum, s) => sum + s.weight * s.reps, 0);
      return {
        date: format(w.completedAt!, 'MMM d'),
        weight: maxWeight,
        volume: totalVolume,
        timestamp: w.completedAt,
      };
    })
    .filter(Boolean)
    .reverse();

  return (
    <div>
      <Header title={exercise.name} showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Info */}
        <div className="flex gap-2">
          <Badge>{MUSCLE_GROUP_LABELS[exercise.category]}</Badge>
          <Badge>{EQUIPMENT_TYPE_LABELS[exercise.equipmentType]}</Badge>
          {exercise.isCustom && <Badge variant="primary">Custom</Badge>}
        </div>

        {/* PRs */}
        {prs.length > 0 && (
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Personal Records</h3>
            <div className="grid grid-cols-2 gap-3">
              {prs.map((pr) => (
                <div key={pr.id} className="text-center">
                  <p className="text-xs text-slate-500 capitalize mb-0.5">
                    {pr.type === 'estimated1rm' ? 'Est. 1RM' : pr.type}
                  </p>
                  <p className="text-lg font-bold text-amber-400">
                    {pr.type === 'reps' ? pr.value : formatWeight(pr.value)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Progression chart */}
        {progressionData.length >= 2 && (
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Weight Progression</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressionData}>
                  <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* History */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">History</h3>
          {workouts.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-slate-500">No history yet for this exercise</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {workouts.filter((w) => w.completedAt).slice(0, 20).map((w) => {
                const exEntry = w.exercises.find((e) => e.exerciseId === id);
                if (!exEntry) return null;
                return (
                  <Card key={w.id} className="p-3">
                    <p className="text-xs text-slate-500 mb-2">{formatDate(w.completedAt!)}</p>
                    <div className="space-y-1">
                      {exEntry.sets.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2 text-sm">
                          <span className="w-6 text-slate-500 text-xs">{s.isWarmup ? 'W' : i + 1}</span>
                          <span className="text-slate-300">{formatWeight(s.weight)}</span>
                          <span className="text-slate-600">x</span>
                          <span className="text-slate-300">{s.reps}</span>
                          {s.isPR && <PRBadge />}
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
