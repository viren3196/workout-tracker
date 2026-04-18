import { useRestTimer } from '../../context/RestTimerContext';
import { formatTimer } from '../../utils';

export function RestTimerFloat() {
  const { isRunning, secondsLeft, totalSeconds, stopTimer } = useRestTimer();

  if (!isRunning && secondsLeft === 0) return null;

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        onClick={stopTimer}
        className={`
          relative w-16 h-16 rounded-full shadow-lg shadow-black/50
          flex items-center justify-center
          ${isRunning ? 'bg-indigo-600' : 'bg-emerald-600'}
          transition-colors
        `}
      >
        <svg className="absolute inset-0 w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="4"
          />
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <span className="text-white text-xs font-bold font-mono">
          {formatTimer(secondsLeft)}
        </span>
      </button>
    </div>
  );
}
