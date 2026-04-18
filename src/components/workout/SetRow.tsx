import { useState } from 'react';
import type { WorkoutSet } from '../../types';
import { Stepper } from '../ui/Stepper';
import { PRBadge } from '../ui/Badge';

interface SetRowProps {
  set: WorkoutSet;
  index: number;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onComplete: () => void;
}

export function SetRow({ set, index, onUpdate, onRemove, onDuplicate, onComplete }: SetRowProps) {
  const [showActions, setShowActions] = useState(false);
  const isCompleted = !!set.completedAt;

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl transition-colors
        ${isCompleted ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-slate-800/40'}
        ${set.isWarmup ? 'opacity-70' : ''}
      `}
    >
      {/* Set number / warmup */}
      <div className="w-8 flex-shrink-0 text-center">
        {set.isWarmup ? (
          <span className="text-[10px] font-bold text-amber-400 uppercase">W</span>
        ) : (
          <span className="text-sm font-bold text-slate-400">{index + 1}</span>
        )}
      </div>

      {/* Weight stepper */}
      <Stepper
        value={set.weight}
        onChange={(v) => onUpdate({ weight: v })}
        step={2.5}
        label="KG"
        inputMode="decimal"
      />

      {/* Reps stepper */}
      <Stepper
        value={set.reps}
        onChange={(v) => onUpdate({ reps: v })}
        step={1}
        label="REPS"
      />

      {/* PR badge */}
      {set.isPR && <PRBadge />}

      {/* Complete button */}
      <button
        onClick={() => {
          if (!isCompleted) {
            onComplete();
          }
        }}
        className={`
          w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all
          ${isCompleted
            ? 'bg-emerald-600 text-white'
            : 'bg-slate-700 hover:bg-indigo-600 text-slate-400 hover:text-white'}
        `}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </button>

      {/* More actions */}
      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-500"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        {showActions && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 bg-[#222240] border border-slate-700 rounded-xl shadow-xl py-1 min-w-[140px]">
              <button
                onClick={() => { onUpdate({ isWarmup: !set.isWarmup }); setShowActions(false); }}
                className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {set.isWarmup ? 'Mark as Working' : 'Mark as Warmup'}
              </button>
              <button
                onClick={() => { onDuplicate(); setShowActions(false); }}
                className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Duplicate Set
              </button>
              <button
                onClick={() => { onRemove(); setShowActions(false); }}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-700 transition-colors"
              >
                Delete Set
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
