const tones = {
  cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  amber: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  rose: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  violet: 'border-violet-400/30 bg-violet-400/10 text-violet-200',
  slate: 'border-white/10 bg-white/5 text-slate-200',
};

export function Badge({ children, tone = 'slate', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${tones[tone] || tones.slate} ${className}`}>
      {children}
    </span>
  );
}
