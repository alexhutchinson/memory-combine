import { useEffect, useState } from 'react';
import type { LeaderboardEntry } from '../types';
import { fetchLeaderboard } from '../services/sheetsService';
import { formatScore, scoreToFeedback, getTierTextClass } from '../utils';

interface Props {
  onBack: () => void;
}

const MEDAL = ['🥇', '🥈', '🥉'];

export function Leaderboard({ onBack }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard()
      .then(data => setEntries(data))
      .catch(() => setError('Could not load leaderboard. Check your Google Sheets configuration.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="px-5 pt-10 pb-5 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium mb-5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <p className="text-xs font-bold tracking-[0.35em] text-amber-500 uppercase mb-1">All-Time</p>
        <h2 className="text-3xl font-black text-white tracking-tight">Leaderboard</h2>
        <p className="text-zinc-600 text-sm mt-1">Top 20 rounds · sorted by avg score</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {loading && <LoadingSkeleton />}

        {!loading && error && (
          <div className="rounded-xl border border-zinc-800 bg-surface p-6 text-center mt-4">
            <div className="text-2xl mb-3">⚠️</div>
            <p className="text-zinc-400 text-sm font-medium mb-1">Leaderboard unavailable</p>
            <p className="text-zinc-600 text-xs">{error}</p>
            <p className="text-zinc-700 text-xs mt-3">
              Set up Google Sheets in your deployment env vars — see README.
            </p>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-surface p-8 text-center mt-4">
            <div className="text-4xl mb-3">⛳</div>
            <p className="text-zinc-400 font-semibold">No scores yet.</p>
            <p className="text-zinc-600 text-sm mt-1">Be the first to post a round.</p>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="space-y-2">
            {/* Top 3 */}
            {entries.slice(0, 3).map((entry, i) => (
              <TopEntry key={i} entry={entry} rank={i + 1} />
            ))}

            {/* Rest */}
            {entries.length > 3 && (
              <div className="rounded-xl border border-zinc-800 bg-surface overflow-hidden mt-3">
                {entries.slice(3).map((entry, i) => (
                  <RegularEntry key={i + 3} entry={entry} rank={i + 4} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TopEntry({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const fb = scoreToFeedback(entry.score);
  const isFirst = rank === 1;

  return (
    <div
      className={`rounded-xl border p-4 animate-slide-up ${isFirst ? 'animate-pulse-gold' : ''}`}
      style={{
        background: isFirst
          ? 'linear-gradient(135deg, #1a1200 0%, #111111 100%)'
          : rank === 2
          ? 'linear-gradient(135deg, #0e0e14 0%, #111111 100%)'
          : '#111111',
        borderColor: isFirst
          ? 'rgba(245,158,11,0.5)'
          : rank === 2
          ? 'rgba(148,163,184,0.3)'
          : 'rgba(180,130,70,0.25)',
        animationDelay: `${rank * 0.08}s`,
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl w-9 text-center">{MEDAL[rank - 1]}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-base truncate">{entry.name}</div>
          <div className="text-xs text-zinc-600 mt-0.5">{entry.date}</div>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-xl font-black ${getTierTextClass(fb)}`}>{formatScore(entry.score)}</div>
          <div className={`text-[9px] font-bold tracking-wider ${getTierTextClass(fb)}`}>{fb}</div>
        </div>
      </div>
    </div>
  );
}

function RegularEntry({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const fb = scoreToFeedback(entry.score);
  return (
    <div className="flex items-center px-4 py-3 border-b border-zinc-800/50 last:border-0">
      <span className="text-zinc-600 font-bold text-sm w-7 shrink-0">#{rank}</span>
      <div className="flex-1 min-w-0 mx-3">
        <span className="text-sm font-semibold text-zinc-300 truncate block">{entry.name}</span>
        <span className="text-[10px] text-zinc-700">{entry.date}</span>
      </div>
      <span className={`text-sm font-bold ${getTierTextClass(fb)}`}>{formatScore(entry.score)}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2 mt-2 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-xl border border-zinc-800 bg-surface p-4 h-16" />
      ))}
      <div className="rounded-xl border border-zinc-800 bg-surface overflow-hidden mt-3">
        {[4, 5, 6, 7, 8].map(i => (
          <div key={i} className="flex items-center px-4 py-3 border-b border-zinc-800/50 last:border-0 gap-3">
            <div className="w-7 h-4 bg-zinc-800 rounded" />
            <div className="flex-1 h-4 bg-zinc-800 rounded" />
            <div className="w-10 h-4 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
