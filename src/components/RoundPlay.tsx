import type { RoundHook } from '../hooks/useRound';
import { ShotEntry } from './ShotEntry';
import { DistanceSummary } from './DistanceSummary';

interface Props {
  round: RoundHook;
}

export function RoundPlay({ round }: Props) {
  const {
    currentDistance,
    currentGroup,
    currentDistanceIndex,
    currentShotIndex,
    shotPhase,
    totalShots,
    submitShot,
    nextDistance,
  } = round;

  if (!currentDistance || !currentGroup) return null;

  const distanceNum = currentDistanceIndex + 1;
  const shotNum = currentShotIndex + 1;
  const totalShotsThisRound = 18;
  const shotsCompleted = currentDistanceIndex * 3 + (shotPhase === 'entry' ? currentShotIndex : shotPhase === 'result' ? currentShotIndex + 1 : 3);
  const progressPct = (shotsCompleted / totalShotsThisRound) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col max-w-md mx-auto">
      {/* Top bar */}
      <div className="px-5 pt-8 pb-3 shrink-0">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #10b981, #059669)',
              }}
            />
          </div>
          <span className="text-[10px] font-bold text-zinc-600 tracking-widest whitespace-nowrap">
            {shotsCompleted}/{totalShotsThisRound}
          </span>
        </div>

        {/* Distance / shot label */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Distance dots */}
            <div className="flex gap-1">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === currentDistanceIndex ? '14px' : '6px',
                    height: '6px',
                    background:
                      i < currentDistanceIndex
                        ? '#10b981'
                        : i === currentDistanceIndex
                        ? '#ffffff'
                        : '#2a2a2a',
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500">
              Distance {distanceNum} of 6
            </span>
          </div>

          {shotPhase === 'entry' && (
            <span className="text-xs font-bold text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full">
              Shot {shotNum}/3
            </span>
          )}
          {shotPhase === 'distanceSummary' && (
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              Summary
            </span>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {shotPhase === 'entry' && (
          <ShotEntry
            key={`${currentDistanceIndex}-${currentShotIndex}`}
            distance={currentDistance}
            shotNumber={shotNum}
            distanceNumber={distanceNum}
            onSubmit={submitShot}
          />
        )}

        {shotPhase === 'distanceSummary' && (
          <DistanceSummary
            key={`summary-${currentDistanceIndex}`}
            group={currentGroup}
            distanceNumber={distanceNum}
            isLastDistance={currentDistanceIndex === 5}
            onNext={nextDistance}
          />
        )}
      </div>
    </div>
  );
}
