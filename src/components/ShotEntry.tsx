import { useState } from 'react';
import type { DistanceData } from '../types';

const BUCKET_LABEL: Record<string, string> = {
  Wedges: 'WEDGE',
  Mid: 'MID IRON',
  Long: 'LONG IRON',
};

const BUCKET_COLOR: Record<string, string> = {
  Wedges: '#10b981',
  Mid: '#3b82f6',
  Long: '#a855f7',
};

interface Props {
  distance: DistanceData;
  shotNumber: number; // 1-based
  distanceNumber: number; // 1-based
  onSubmit: (proximity: number) => void;
}

export function ShotEntry({ distance, shotNumber, onSubmit }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(input);
    if (isNaN(val) || val <= 0) {
      setError('Enter a valid proximity in feet.');
      return;
    }
    if (val > 999) {
      setError('That seems too large. Check your entry.');
      return;
    }
    setError('');
    setInput('');
    onSubmit(val);
  };

  const bucketColor = BUCKET_COLOR[distance.bucket];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Distance hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-4">
        {/* Bucket badge */}
        <div
          className="text-[10px] font-bold tracking-[0.35em] px-3 py-1 rounded-full mb-6"
          style={{ color: bucketColor, background: `${bucketColor}18`, border: `1px solid ${bucketColor}35` }}
        >
          {BUCKET_LABEL[distance.bucket]}
        </div>

        {/* Big distance */}
        <div className="text-center mb-6">
          <span
            className="font-black leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(5rem, 28vw, 9rem)',
              color: 'white',
              lineHeight: 1,
            }}
          >
            {distance.yards}
          </span>
          <span className="block text-zinc-500 font-bold text-xl tracking-widest mt-1">YARDS</span>
        </div>

        {/* Benchmark hint */}
        <div className="flex gap-6 mb-10 text-center">
          <div>
            <div className="text-xs text-zinc-600 tracking-widest uppercase mb-0.5">Scratch</div>
            <div className="text-base font-bold text-zinc-400">{distance.scratchBenchmark}ft</div>
          </div>
          <div className="w-px bg-zinc-800" />
          <div>
            <div className="text-xs text-zinc-600 tracking-widest uppercase mb-0.5">Tour Median</div>
            <div className="text-base font-bold text-zinc-400">{distance.tourMedian}ft</div>
          </div>
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <label className="block text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase mb-3 text-center">
            Proximity (feet)
          </label>
          <div className="relative mb-3">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0.1"
              max="999"
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              placeholder="e.g. 18.5"
              autoFocus
              className="w-full bg-surface border-2 border-zinc-700 rounded-xl px-5 py-4 text-white text-2xl font-bold text-center placeholder-zinc-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}
            />
            {input && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium text-sm">ft</span>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center mb-3 animate-fade-in">{error}</p>
          )}

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-30"
            style={{
              background: input.trim() ? 'linear-gradient(135deg, #10b981, #059669)' : '#2a2a2a',
              color: input.trim() ? '#fff' : '#666',
              boxShadow: input.trim() ? '0 0 20px rgba(16,185,129,0.3)' : 'none',
            }}
          >
            RECORD SHOT
          </button>
        </form>
      </div>

      {/* Shot indicator */}
      <div className="flex justify-center gap-2 pb-6">
        {[1, 2, 3].map(n => (
          <div
            key={n}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: n < shotNumber ? '#10b981' : n === shotNumber ? 'white' : '#2a2a2a',
              transform: n === shotNumber ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
