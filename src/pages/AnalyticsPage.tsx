import { useMemo } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';
import { useExercises } from '../hooks/useExercises';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { workoutVolume, MUSCLE_GROUP_COLORS, formatWeight } from '../utils';
import { MUSCLE_GROUP_LABELS } from '../types';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';

export function AnalyticsPage() {
  const workouts = useWorkouts();
  const exercises = useExercises();
  const completed = workouts.filter((w) => w.completedAt);

  // Volume over time (last 30 days)
  const volumeData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });
    return days.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayWorkouts = completed.filter(
        (w) => format(w.completedAt!, 'yyyy-MM-dd') === dayStr
      );
      const vol = dayWorkouts.reduce((sum, w) => sum + workoutVolume(w), 0);
      return { date: format(day, 'MMM d'), volume: vol };
    });
  }, [completed]);

  // Frequency (last 4 weeks)
  const frequencyData = useMemo(() => {
    const weeks: { week: string; count: number }[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = subDays(new Date(), (i + 1) * 7);
      const weekEnd = subDays(new Date(), i * 7);
      const count = completed.filter((w) => {
        const d = w.completedAt!;
        return d >= weekStart.getTime() && d < weekEnd.getTime();
      }).length;
      weeks.push({ week: `Week ${4 - i}`, count });
    }
    return weeks;
  }, [completed]);

  // Muscle group distribution
  const muscleData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const w of completed) {
      for (const e of w.exercises) {
        const ex = exercises.find((x) => x.id === e.exerciseId);
        if (ex) {
          counts[ex.category] = (counts[ex.category] || 0) + e.sets.filter((s) => !s.isWarmup).length;
        }
      }
    }
    return Object.entries(counts)
      .map(([key, value]) => ({
        name: MUSCLE_GROUP_LABELS[key as keyof typeof MUSCLE_GROUP_LABELS] || key,
        value,
        color: MUSCLE_GROUP_COLORS[key] || '#6366f1',
      }))
      .sort((a, b) => b.value - a.value);
  }, [completed, exercises]);

  // Top exercises
  const topExercises = useMemo(() => {
    const counts: Record<string, { name: string; sets: number }> = {};
    for (const w of completed) {
      for (const e of w.exercises) {
        const ex = exercises.find((x) => x.id === e.exerciseId);
        if (ex) {
          if (!counts[ex.id]) counts[ex.id] = { name: ex.name, sets: 0 };
          counts[ex.id].sets += e.sets.filter((s) => !s.isWarmup).length;
        }
      }
    }
    return Object.values(counts).sort((a, b) => b.sets - a.sets).slice(0, 8);
  }, [completed, exercises]);

  return (
    <div>
      <Header title="Analytics" />
      <div className="px-4 py-4 space-y-4">
        {completed.length < 2 ? (
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            title="Analytics Coming Soon"
            description={`Complete ${2 - completed.length} more workout${2 - completed.length > 1 ? 's' : ''} to unlock charts and insights.`}
          />
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <p className="text-[10px] text-slate-500 uppercase">Total Workouts</p>
                <p className="text-2xl font-bold text-slate-100">{completed.length}</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-[10px] text-slate-500 uppercase">Total Volume</p>
                <p className="text-2xl font-bold text-slate-100">
                  {formatWeight(completed.reduce((sum, w) => sum + workoutVolume(w), 0))}
                </p>
              </Card>
            </div>

            {/* Volume trend */}
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Volume (30 Days)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <XAxis dataKey="date" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} interval={4} />
                    <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val) => [`${formatWeight(Number(val))}`, 'Volume']}
                    />
                    <Bar dataKey="volume" fill="#6366f1" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Workout frequency */}
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Weekly Frequency</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={frequencyData}>
                    <XAxis dataKey="week" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Muscle group split */}
            {muscleData.length > 0 && (
              <Card className="p-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Muscle Groups</h3>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={muscleData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={50}
                          paddingAngle={2}
                        >
                          {muscleData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1">
                    {muscleData.slice(0, 6).map((m) => (
                      <div key={m.name} className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="text-slate-400 flex-1">{m.name}</span>
                        <span className="text-slate-300 font-mono">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Top exercises */}
            {topExercises.length > 0 && (
              <Card className="p-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Top Exercises</h3>
                <div className="space-y-2">
                  {topExercises.map((ex, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-5 text-xs text-slate-500">{i + 1}.</span>
                      <span className="flex-1 text-sm text-slate-300 truncate">{ex.name}</span>
                      <span className="text-sm font-mono text-slate-400">{ex.sets} sets</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
