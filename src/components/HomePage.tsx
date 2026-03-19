interface Props {
  onStart: () => void;
  onLeaderboard: () => void;
}

export function HomePage({ onStart, onLeaderboard }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-dot-grid flex flex-col">
      {/* Ambient glow top */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse at center, #1a3a1a 0%, transparent 70%)' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-10 pb-2">
        <div className="flex items-center gap-2">
          <TargetIcon />
          <span className="text-xs font-semibold tracking-[0.25em] text-zinc-500 uppercase">
            Memory Combine
          </span>
        </div>
        <span className="text-xs text-zinc-600 tracking-wider">v1.0</span>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Big title */}
        <div className="mb-2 animate-fade-in">
          <p className="text-xs font-bold tracking-[0.4em] text-emerald-500 uppercase mb-3">
            PGA Tour Proximity Benchmark
          </p>
          <h1 className="font-black leading-none tracking-tighter text-white">
            <span className="block text-[clamp(3.5rem,18vw,7rem)] text-zinc-200">MEMORY</span>
            <span
              className="block text-[clamp(3.5rem,18vw,7rem)]"
              style={{ color: '#f59e0b' }}
            >
              COMBINE
            </span>
          </h1>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8 w-full max-w-xs animate-fade-in-slow">
          <div className="flex-1 h-px bg-zinc-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Stat strip */}
        <div className="flex gap-8 mb-10 animate-fade-in-slow">
          {[
            { label: 'Distances', value: '6' },
            { label: 'Shots', value: '18' },
            { label: 'Buckets', value: '3' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">{label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full max-w-xs animate-slide-up-delayed">
          <button
            onClick={onStart}
            className="w-full py-4 px-8 rounded-xl font-bold text-base tracking-wide text-black transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              boxShadow: '0 0 24px rgba(245,158,11,0.35)',
            }}
          >
            START ROUND
          </button>
          <button
            onClick={onLeaderboard}
            className="w-full py-4 px-8 rounded-xl font-semibold text-base tracking-wide text-zinc-300 border border-zinc-700 bg-zinc-900/60 transition-all duration-200 active:scale-95 hover:border-zinc-500 hover:text-white"
          >
            LEADERBOARD
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 pt-4 text-center">
        <p className="text-[10px] text-zinc-700 tracking-wider">
          Data: <span className="text-zinc-600">@LouStagner</span> · PGA Tour proximity benchmarks
        </p>
      </footer>
    </div>
  );
}

function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
      <circle cx="12" cy="12" r="2" fill="#10b981" />
      <line x1="12" y1="2" x2="12" y2="5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="19" x2="12" y2="22" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
