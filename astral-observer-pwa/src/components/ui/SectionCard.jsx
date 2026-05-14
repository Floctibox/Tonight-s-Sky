export function SectionCard({ className = '', eyebrow, title, icon, children, footer, isExpanded = true, onToggleExpand }) {
  return (
    <section className={`panel ${className}`}>
      <div className="relative z-10 flex flex-col gap-5">
        <header className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {eyebrow ? (
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>

          <div className="flex items-center gap-2">
            {onToggleExpand && (
              <button
                onClick={onToggleExpand}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200 hover:border-white/20 hover:bg-white/10 transition"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? '−' : '+'}
              </button>
            )}
            
            {icon ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                {icon}
              </div>
            ) : null}
          </div>
        </header>

        <div className="hairline" />

        <div className="relative z-10">{children}</div>

        {footer ? <div className="pt-1 text-xs text-slate-400">{footer}</div> : null}
      </div>
    </section>
  );
}