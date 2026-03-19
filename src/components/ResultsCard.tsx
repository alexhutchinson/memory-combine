import type { ShotResult } from '../types';
import { getTierTextClass, getTierBgClass, getTierColor, formatScore } from '../utils';

interface Props {
  result: ShotResult;
  runningAvg: number;
  shotNumber: number;
  totalShotsPlayed: number;
  onNext: () => void;
  isLastShot: boolean;
}

export function ResultsCard({ result, runningAvg, onNext, isLastShot }: Props) {
  const tierColor = getTierColor(result.feedback);
  const isElite = result.feedback === 'Elite';

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6 overflow-y-auto">
      {/* Score reveal — the hero moment */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Outer ring glow */}
        <div
          className="relative flex items-center justify-center w-40 h-40 rounded-full mb-5 animate-score-reveal"
          style={{
            background: `radial-gradient(circle, ${tierColor}22 0%, transparent 70%)`,
            border: `2px solid ${tierColor}40`,
            boxShadow: `0 0 40px ${tierColor}30, inset 0 0 30px ${tierColor}15`,
          }}
        >
          {isElite && (
            <div
              className="absolute inset-0 rounded-full animate-pulse-gold"
              style={{ border: `2px solid ${tierColor}` }}
            />
          )}
          <div className="text-center">
            <div
              className="font-black leading-none animate-number-pop"
              style={{ fontSize: '3.25rem', color: tierColor, lineHeight: 1 }}
            >
              {formatScore(result.points)}
            </div>
            <div className="text-xs text-zinc-500 font-semibold tracking-widest uppercase mt-1">pts</div>
          </div>
        </div>

        {/* Feedback label */}
        <div
          className={`px-5 py-1.5 rounded-full text-sm font-bold tracking-[0.2em] uppercase animate-fade-in ${getTierBgClass(result.feedback)}`}
          style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
        >
          {result.feedback}
        </div>

        {/* Comparison table */}
        <div
          className="w-full max-w-xs mt-7 rounded-xl border border-zinc-800 bg-surface overflow-hidden animate-slide-up"
          style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <CompRow label="Your shot" value={`${result.proximity}ft`} highlight />
          <CompRow label="Scratch benchmark" value={`${result.scratchBenchmark}ft`} />
          <CompRow label="Tour median" value={`${result.tourMedian}ft`} isLast />
        </div>

        {/* Running average */}
        <div
          className="mt-5 text-center animate-fade-in"
          style={{ animationDelay: '0.45s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <span className="text-xs text-zinc-600 tracking-widest uppercase">Running avg · </span>
          <span className={`text-sm font-bold ${getTierTextClass(result.feedback)}`}>
            {formatScore(runningAvg)}
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onNext}
        className="w-full py-4 rounded-xl font-bold text-base tracking-wide text-white bg-zinc-800 hover:bg-zinc-700 transition-all active:scale-95 animate-fade-in"
        style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}
      >
        {isLastShot ? 'VIEW DISTANCE SUMMARY →' : `NEXT SHOT →`}
      </button>
    </div>
  );
}

function CompRow({
  label,
  value,
  highlight = false,
  isLast = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 ${!isLast ? 'border-b border-zinc-800' : ''} ${highlight ? 'bg-zinc-800/50' : ''}`}>
      <span className="text-xs text-zinc-500 font-medium">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-white' : 'text-zinc-400'}`}>{value}</span>
    </div>
  );
}
