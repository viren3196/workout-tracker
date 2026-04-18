import { useState } from 'react';
import { format } from 'date-fns';
import { useBodyWeightLogs, addBodyWeightLog, deleteBodyWeightLog } from '../hooks/useBodyWeight';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function BodyWeightPage() {
  const logs = useBodyWeightLogs(60);
  const [weight, setWeight] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;
    await addBodyWeightLog(w, format(new Date(), 'yyyy-MM-dd'));
    setWeight('');
    setShowForm(false);
  };

  const chartData = [...logs].reverse().map((l) => ({
    date: format(new Date(l.date), 'MMM d'),
    weight: l.weight,
  }));

  return (
    <div>
      <Header title="Body Weight" showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Quick add */}
        {showForm ? (
          <Card className="p-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  label="Weight (kg)"
                  type="text"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="75.0"
                  autoFocus
                />
              </div>
              <Button onClick={handleAdd} disabled={!weight}>Log</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </Card>
        ) : (
          <Button fullWidth onClick={() => setShowForm(true)}>
            + Log Today's Weight
          </Button>
        )}

        {/* Chart */}
        {chartData.length >= 2 && (
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Log list */}
        {logs.length === 0 ? (
          <EmptyState
            title="No Weight Entries"
            description="Start logging your weight to track trends over time."
          />
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-800/30">
                <div>
                  <p className="text-sm text-slate-300">{format(new Date(log.date), 'EEE, MMM d yyyy')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-100">{log.weight} kg</span>
                  <button
                    onClick={() => deleteBodyWeightLog(log.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-900/30 text-slate-600 hover:text-red-400"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
