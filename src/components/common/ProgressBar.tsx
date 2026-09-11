import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'blue' | 'amber' | 'indigo' | 'violet' | 'fuchsia' | 'teal' | 'auto';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  showText = true,
  size = 'md',
  color = 'auto',
}) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);

  let barColor = 'bg-gradient-to-r from-teal-500 to-emerald-500';
  if (color === 'auto') {
    if (clamped >= 80) barColor = 'bg-gradient-to-r from-emerald-500 to-teal-500';
    else if (clamped >= 50) barColor = 'bg-gradient-to-r from-violet-500 to-fuchsia-500';
    else if (clamped >= 30) barColor = 'bg-gradient-to-r from-amber-500 to-orange-500';
    else barColor = 'bg-gradient-to-r from-rose-500 to-red-500';
  } else if (color === 'emerald') {
    barColor = 'bg-gradient-to-r from-emerald-500 to-teal-500';
  } else if (color === 'blue') {
    barColor = 'bg-gradient-to-r from-teal-500 to-cyan-500';
  } else if (color === 'amber') {
    barColor = 'bg-gradient-to-r from-amber-500 to-orange-500';
  } else if (color === 'indigo') {
    barColor = 'bg-gradient-to-r from-indigo-500 to-purple-500';
  } else if (color === 'violet') {
    barColor = 'bg-gradient-to-r from-violet-500 to-fuchsia-500';
  } else if (color === 'fuchsia') {
    barColor = 'bg-gradient-to-r from-fuchsia-500 to-pink-500';
  } else if (color === 'teal') {
    barColor = 'bg-gradient-to-r from-teal-500 to-emerald-500';
  }

  const heightClasses = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3.5' : 'h-2.5';

  return (
    <div className="w-full">
      {(label || showText) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-slate-700 dark:text-slate-300">
          {label && <span className="font-semibold">{label}</span>}
          {showText && <span className="font-extrabold text-slate-900 dark:text-white">{clamped}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${heightClasses} p-0.5 border border-slate-200/50 dark:border-slate-700/50`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor} shadow-sm`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
