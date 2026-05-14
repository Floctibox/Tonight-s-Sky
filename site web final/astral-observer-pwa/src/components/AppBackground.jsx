export function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="starfield absolute inset-0" />
      <div className="absolute left-[-8rem] top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute right-[-6rem] top-32 h-96 w-96 rounded-full bg-violet-500/12 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/[0.08] blur-3xl" />
    </div>
  );
}
