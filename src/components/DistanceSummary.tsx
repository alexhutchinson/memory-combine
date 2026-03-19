import type { DistanceGroup } from '../types';
import { avg, formatScore, scoreToFeedback, getTierTextClass, getTierBgClass, getTierColor } from '../utils';

interface Props {
  group: DistanceGroup;
  distanceNumber: number;
  isLastDistance: boolean;
  onNext: () => void;
}

const BUCKET_LABEL: Record<string, string> = {
  Wedges: 'WEDGE',
  Mid: 'MID IRON',
  Long: 'LONG IRON',
};

export function DistanceSummary({ group, distanceNumber, isLastDistance, onNext }: Props) {
  const { distance, shots } = group;
  const avgPoints = avg(shots.map(s => s.points));
  const avgProximity = avg(shots.map(s => s.proximity));
  const feedback = scoreToFeedback(avgPoints);
  const tierColor = getTierColor(feedback);

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="text-xs font-bold tracking-[0.35em] text-zinc-500 uppercase mb-2">
            Distance {distanceNumber} of 6 — Complete
          </div>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-black text-white">{distance.yards}</span>
            <span className="text-zinc-500 font-bold tracking-widest">YDS</span>
          </div>
          <div
            className="inline-block text-[10px] font-bold tracking-[0.3em] px-2.5 py-1 rounded-full mt-2"
            style={{ color: '#10b981', background: '#10b98115', border: '1px solid #10b98130' }}
          >
            {BUCKET_LABEL[distance.bucket]}
          </div>
        </div>

        {/* Average score circle */}
        <div className="flex justify-center mb-6 animate-score-reveal">
          <div
            className="relative flex flex-col items-center justify-center w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, ${tierColor}20 0%, transparent 70%)`,
              border: `2px solid ${tierColor}50`,
            }}
          >
            <div className="text-3xl font-black" style={{ color: tierColor }}>
              {formatScore(avgPoints)}
            </div>
            <div className="text-[10px] text-zinc-500 tracking-widest">AVG PTS</div>
          </div>
        </div>

        {/* Shot-by-shot breakdown */}
        <div
          className="rounded-xl border border-zinc-800 bg-surface mb-4 overflow-hidden animate-slide-up"
          style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="px-4 py-2.5 border-b border-zinc-800 bg-surface-2">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Shot Breakdown</span>
          </div>
          {shots.map((shot, i) => (
            <div key={i} className={`flex items-center px-4 py-3 ${i < shots.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center mr-3 shrink-0">
                <span className="text-xs font-bold text-zinc-400">{i + 1}</span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-white">{shot.proximity}ft</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${getTierTextClass(shot.feedback)}`}>
                  {formatScore(shot.points)}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getTierBgClass(shot.feedback)}`}>
                  {shot.feedback}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Benchmarks comparison */}
        <div
          className="rounded-xl border border-zinc-800 bg-surface overflow-hidden animate-slide-up"
          style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="px-4 py-2.5 border-b border-zinc-800 bg-surface-2">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Benchmark Comparison</span>
          </div>
          <BenchRow label="Your avg proximity" value={`${avgProximity.toFixed(1)}ft`} highlight />
          <BenchRow label="Scratch benchmark" value={`${distance.scratchBenchmark}ft`} />
          <BenchRow label="Tour median" value={`${distance.tourMedian}ft`} isLast />
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-5 w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#000',
          boxShadow: '0 0 20px rgba(245,158,11,0.25)',
        }}
      >
        {isLastDistance ? 'VIEW ROUND SUMMARY →' : 'NEXT DISTANCE →'}
      </button>
    </div>
  );
}

function BenchRow({ label, value, highlight = false, isLast = false }: { label: string; value: string; highlight?: boolean; isLast?: boolean }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 ${!isLast ? 'border-b border-zinc-800' : ''} ${highlight ? 'bg-zinc-800/40' : ''}`}>
      <span className="text-xs text-zinc-500">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-white' : 'text-zinc-400'}`}>{value}</span>
    </div>
  );
}
