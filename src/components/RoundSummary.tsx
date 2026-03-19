import { useState } from 'react';
import type { RoundHook } from '../hooks/useRound';
import { avg, formatScore, getTierColor, getTierTextClass, scoreToFeedback, getTierBgClass } from '../utils';
import { submitScore } from '../services/sheetsService';

interface Props {
  round: RoundHook;
}

const BUCKET_LABEL: Record<string, string> = {
  Wedges: 'Wedges',
  Mid: 'Mid Irons',
  Long: 'Long Irons',
};

export function RoundSummary({ round }: Props) {
  const { playerName, distanceGroups, averageScore, bucketAverages, bestDistance, worstDistance, goHome } = round;

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const feedback = scoreToFeedback(averageScore);
  const tierColor = getTierColor(feedback);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitScore(playerName, averageScore, distanceGroups);
      setSubmitted(true);
    } catch {
      setSubmitError('Could not reach leaderboard. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col max-w-md mx-auto">
      <div className="px-5 pt-8 pb-3 shrink-0">
        <p className="text-xs font-bold tracking-[0.35em] text-zinc-500 uppercase">Round Complete</p>
        <h2 className="text-2xl font-black text-white mt-1">{playerName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">

        {/* Score gauge */}
        <div className="animate-slide-up">
          <ScoreGauge score={averageScore} tierColor={tierColor} feedback={feedback} />
        </div>

        {/* Bucket breakdown */}
        <div
          className="rounded-xl border border-zinc-800 bg-surface overflow-hidden animate-slide-up"
          style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="px-4 py-2.5 border-b border-zinc-800 bg-surface-2">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">By Bucket</span>
          </div>
          {(['Wedges', 'Mid', 'Long'] as const).map(bucket => {
            const score = bucketAverages[bucket];
            const fb = scoreToFeedback(score);
            return (
              <div key={bucket} className="flex items-center px-4 py-3 border-b border-zinc-800/50 last:border-0">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-zinc-300">{BUCKET_LABEL[bucket]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${score}%`, background: getTierColor(fb) }}
                    />
                  </div>
                  <span className={`text-sm font-bold w-10 text-right ${getTierTextClass(fb)}`}>
                    {formatScore(score)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Best / Worst */}
        {bestDistance && worstDistance && bestDistance !== worstDistance && (
          <div
            className="grid grid-cols-2 gap-3 animate-slide-up"
            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
          >
            <HighlightCard
              label="Best Distance"
              yards={bestDistance.distance.yards}
              score={avg(bestDistance.shots.map(s => s.points))}
              isGood
            />
            <HighlightCard
              label="Needs Work"
              yards={worstDistance.distance.yards}
              score={avg(worstDistance.shots.map(s => s.points))}
              isGood={false}
            />
          </div>
        )}

        {/* All distances */}
        <div
          className="rounded-xl border border-zinc-800 bg-surface overflow-hidden animate-slide-up"
          style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="px-4 py-2.5 border-b border-zinc-800 bg-surface-2">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">All Distances</span>
          </div>
          {distanceGroups.map((group, i) => {
            const groupAvg = avg(group.shots.map(s => s.points));
            const fb = scoreToFeedback(groupAvg);
            return (
              <div key={i} className="flex items-center px-4 py-3 border-b border-zinc-800/50 last:border-0">
                <div className="w-16 shrink-0">
                  <span className="text-base font-black text-white">{group.distance.yards}</span>
                  <span className="text-zinc-600 text-xs ml-1">yd</span>
                </div>
                <div className="flex-1">
                  <div className="flex gap-1">
                    {group.shots.map((shot, j) => (
                      <div
                        key={j}
                        className="w-1.5 h-5 rounded-full"
                        style={{ background: getTierColor(shot.feedback) }}
                        title={`${shot.proximity}ft — ${formatScore(shot.points)}pts`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${getTierTextClass(fb)}`}>{formatScore(groupAvg)}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${getTierBgClass(fb)}`}>{fb}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard submit */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: '0.35s', opacity: 0, animationFillMode: 'forwards' }}
        >
          {submitted ? (
            <div className="rounded-xl border border-emerald-600/30 bg-emerald-500/10 p-4 text-center">
              <p className="text-emerald-400 font-bold text-sm">✓ Score submitted to leaderboard!</p>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 rounded-xl font-bold text-base tracking-wide text-black transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                boxShadow: '0 0 20px rgba(245,158,11,0.25)',
              }}
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT TO LEADERBOARD'}
            </button>
          )}
          {submitError && (
            <p className="text-red-400 text-xs text-center mt-2">{submitError}</p>
          )}
        </div>

        <button
          onClick={goHome}
          className="w-full py-4 rounded-xl font-bold text-base tracking-wide text-zinc-400 border border-zinc-800 bg-zinc-900/50 transition-all active:scale-95 hover:text-white hover:border-zinc-600"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}

function ScoreGauge({ score, tierColor, feedback }: { score: number; tierColor: string; feedback: string }) {
  const radius = 72;
  const circumference = Math.PI * radius; // semicircle
  const fill = circumference * (score / 100);
  const dashOffset = circumference - fill;

  return (
    <div className="rounded-xl border border-zinc-800 bg-surface p-5 text-center">
      <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-3">Overall Score</p>
      <div className="relative inline-block">
        <svg viewBox="0 0 180 100" width="220" height="120" className="overflow-visible">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={tierColor} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColor} />
            </linearGradient>
          </defs>
          {/* Track */}
          <path
            d="M 18 90 A 72 72 0 0 1 162 90"
            fill="none"
            stroke="#1f1f1f"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d="M 18 90 A 72 72 0 0 1 162 90"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1) 0.3s' }}
          />
          {/* Score label */}
          <text
            x="90"
            y="78"
            textAnchor="middle"
            fill="white"
            fontSize="28"
            fontWeight="900"
            fontFamily="Inter, system-ui, sans-serif"
          >
            {formatScore(score)}
          </text>
          <text x="90" y="96" textAnchor="middle" fill="#52525b" fontSize="9" fontWeight="600" letterSpacing="3">
            OUT OF 100
          </text>
        </svg>
      </div>
      <div className={`inline-block mt-1 px-4 py-1 rounded-full text-sm font-bold tracking-widest ${getTierBgClass(scoreToFeedback(score))}`}>
        {feedback}
      </div>
    </div>
  );
}

function HighlightCard({ label, yards, score, isGood }: { label: string; yards: number; score: number; isGood: boolean }) {
  const fb = scoreToFeedback(score);
  const color = isGood ? '#10b981' : '#f59e0b';
  return (
    <div
      className="rounded-xl border bg-surface p-4 text-center"
      style={{ borderColor: `${color}30` }}
    >
      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color }}>{label}</p>
      <div className="text-3xl font-black text-white mb-0.5">{yards}<span className="text-zinc-600 text-base ml-1">yd</span></div>
      <div className={`text-sm font-bold ${getTierTextClass(fb)}`}>{formatScore(score)} pts</div>
    </div>
  );
}
