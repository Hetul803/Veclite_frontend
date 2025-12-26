import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'cyan';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/10 text-red-400 border-red-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border
      ${variantClasses[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}
