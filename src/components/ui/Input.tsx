import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`
          bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5
          text-slate-100 placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition-colors text-sm
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  inputMode?: 'numeric' | 'decimal';
  className?: string;
  placeholder?: string;
}

export function NumericInput({
  value,
  onChange,
  label,
  min = 0,
  max = 9999,
  inputMode = 'numeric',
  className = '',
  placeholder,
}: NumericInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider text-center">
          {label}
        </label>
      )}
      <input
        type="text"
        inputMode={inputMode}
        value={value || ''}
        placeholder={placeholder ?? '0'}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, '');
          const num = parseFloat(raw);
          if (!isNaN(num) && num >= min && num <= max) {
            onChange(num);
          } else if (raw === '' || raw === '0') {
            onChange(0);
          }
        }}
        className={`
          bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2
          text-slate-100 text-center font-mono text-base
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition-colors min-w-[60px]
          ${className}
        `}
      />
    </div>
  );
}
