import { haptic } from '../../utils';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  label?: string;
  inputMode?: 'numeric' | 'decimal';
}

export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  label,
  inputMode = 'numeric',
}: StepperProps) {
  const decrease = () => {
    const next = Math.max(min, value - step);
    onChange(Math.round(next * 100) / 100);
    haptic();
  };
  const increase = () => {
    const next = Math.min(max, value + step);
    onChange(Math.round(next * 100) / 100);
    haptic();
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider text-center">
          {label}
        </label>
      )}
      <div className="flex items-center gap-0">
        <button
          type="button"
          onClick={decrease}
          className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-200 text-lg font-bold transition-colors select-none"
        >
          -
        </button>
        <input
          type="text"
          inputMode={inputMode}
          value={value || ''}
          placeholder="0"
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, '');
            const num = parseFloat(raw);
            if (!isNaN(num) && num >= min && num <= max) {
              onChange(num);
            } else if (raw === '' || raw === '0') {
              onChange(0);
            }
          }}
          className="w-16 h-10 bg-slate-800 border-y border-slate-700 text-center text-slate-100 font-mono text-base focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={increase}
          className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-200 text-lg font-bold transition-colors select-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
