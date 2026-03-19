import { useState } from 'react';

interface Props {
  onSubmit: (name: string) => void;
  onBack: () => void;
}

export function PlayerEntry({ onSubmit, onBack }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="flex items-center px-5 pt-10 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 animate-slide-up">
        <div className="max-w-sm mx-auto w-full">
          <p className="text-xs font-bold tracking-[0.35em] text-emerald-500 uppercase mb-3">
            Round Setup
          </p>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
            Who's<br />Playing?
          </h2>
          <p className="text-zinc-500 text-sm mb-10">
            Your name goes on the leaderboard.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={30}
                autoFocus
                className="w-full bg-surface border border-zinc-800 rounded-xl px-5 py-4 text-white text-lg font-semibold placeholder-zinc-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/40 transition-all"
              />
              {name.trim() && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: name.trim()
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : '#2a2a2a',
                color: name.trim() ? '#000' : '#666',
                boxShadow: name.trim() ? '0 0 20px rgba(245,158,11,0.3)' : 'none',
              }}
            >
              BEGIN ROUND →
            </button>
          </form>

          {/* Round preview */}
          <div className="mt-10 p-4 rounded-xl border border-zinc-800 bg-surface">
            <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-3">Round format</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Wedges', value: '2', sub: 'distances' },
                { label: 'Mid Irons', value: '2', sub: 'distances' },
                { label: 'Long Irons', value: '2', sub: 'distances' },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-surface-2 rounded-lg p-2.5">
                  <div className="text-xl font-black text-white">{value}</div>
                  <div className="text-[9px] font-semibold text-zinc-500 tracking-wider uppercase">{label}</div>
                  <div className="text-[9px] text-zinc-700">{sub}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-600 text-center mt-3">3 shots per distance · 18 total shots</p>
          </div>
        </div>
      </div>
    </div>
  );
}
