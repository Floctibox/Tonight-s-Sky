export function LoadingScreen() {
  return (
    <div className="panel">
      <div className="relative z-10 space-y-4">
        <div className="h-4 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-white/10" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
