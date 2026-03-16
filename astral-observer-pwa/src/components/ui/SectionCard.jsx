export function SectionCard({ className = '', eyebrow, title, icon, children, footer }) {
  return (
    <section className={`panel ${className}`}>
      <div className="relative z-10 flex h-full flex-col gap-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>

          {icon ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
              {icon}
            </div>
          ) : null}
        </header>

        <div className="hairline" />

        <div className="relative z-10 flex-1">{children}</div>

        {footer ? <div className="pt-1 text-xs text-slate-400">{footer}</div> : null}
      </div>
    </section>
  );
}
