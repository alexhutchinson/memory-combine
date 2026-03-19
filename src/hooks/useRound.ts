import { useState, useCallback, useMemo } from 'react';
import type { GameScreen, ShotPhase, DistanceData, DistanceGroup, ShotResult, Bucket } from '../types';
import { selectRoundDistances } from '../data/tourData';
import { calculatePoints, scoreToFeedback, avg } from '../utils';

interface RoundState {
  screen: GameScreen;
  playerName: string;
  selectedDistances: DistanceData[];
  currentDistanceIndex: number;
  currentShotIndex: number;
  shotPhase: ShotPhase;
  distanceGroups: DistanceGroup[];
}

const INITIAL_STATE: RoundState = {
  screen: 'home',
  playerName: '',
  selectedDistances: [],
  currentDistanceIndex: 0,
  currentShotIndex: 0,
  shotPhase: 'entry',
  distanceGroups: [],
};

export function useRound() {
  const [state, setState] = useState<RoundState>(INITIAL_STATE);

  // ─── Navigation ─────────────────────────────────────────────
  const goHome = useCallback(() => setState(INITIAL_STATE), []);

  const goToPlayerEntry = useCallback(() => {
    setState(s => ({ ...s, screen: 'playerEntry' }));
  }, []);

  const goToLeaderboard = useCallback(() => {
    setState(s => ({ ...s, screen: 'leaderboard' }));
  }, []);

  // ─── Round Actions ───────────────────────────────────────────
  const startRound = useCallback((playerName: string) => {
    const distances = selectRoundDistances();
    setState({
      screen: 'playing',
      playerName: playerName.trim(),
      selectedDistances: distances,
      currentDistanceIndex: 0,
      currentShotIndex: 0,
      shotPhase: 'entry',
      distanceGroups: distances.map(d => ({ distance: d, shots: [] })),
    });
  }, []);

  const submitShot = useCallback((proximity: number) => {
    setState(prev => {
      const dist = prev.selectedDistances[prev.currentDistanceIndex];
      const points = calculatePoints(proximity, dist.scratchBenchmark);
      const result: ShotResult = {
        distanceYards: dist.yards,
        proximity,
        points,
        feedback: scoreToFeedback(points),
        tourMedian: dist.tourMedian,
        scratchBenchmark: dist.scratchBenchmark,
      };

      const newGroups = prev.distanceGroups.map((g, i) =>
        i === prev.currentDistanceIndex
          ? { ...g, shots: [...g.shots, result] }
          : g
      );

      // Skip per-shot result card — go straight to next shot or distance summary
      if (prev.currentShotIndex < 2) {
        return { ...prev, distanceGroups: newGroups, currentShotIndex: prev.currentShotIndex + 1, shotPhase: 'entry' };
      }
      return { ...prev, distanceGroups: newGroups, shotPhase: 'distanceSummary' };
    });
  }, []);

  /** Called after viewing a distance summary — advances to next distance or round summary */
  const nextDistance = useCallback(() => {
    setState(prev => {
      if (prev.currentDistanceIndex < 5) {
        return {
          ...prev,
          currentDistanceIndex: prev.currentDistanceIndex + 1,
          currentShotIndex: 0,
          shotPhase: 'entry',
        };
      }
      return { ...prev, screen: 'summary' };
    });
  }, []);

  // ─── Derived values ──────────────────────────────────────────
  const computed = useMemo(() => {
    const allShots = state.distanceGroups.flatMap(g => g.shots);
    const totalShots = allShots.length;
    const averageScore = avg(allShots.map(s => s.points));

    const bucketAverages: Record<Bucket, number> = { Wedges: 0, Mid: 0, Long: 0 };
    for (const bucket of ['Wedges', 'Mid', 'Long'] as Bucket[]) {
      const shots = state.distanceGroups
        .filter(g => g.distance.bucket === bucket)
        .flatMap(g => g.shots);
      if (shots.length > 0) bucketAverages[bucket] = avg(shots.map(s => s.points));
    }

    const completedGroups = state.distanceGroups.filter(g => g.shots.length === 3);
    const sorted = [...completedGroups].sort(
      (a, b) =>
        avg(b.shots.map(s => s.points)) - avg(a.shots.map(s => s.points))
    );
    const bestDistance = sorted[0] ?? null;
    const worstDistance = sorted[sorted.length - 1] ?? null;

    const currentDistance = state.selectedDistances[state.currentDistanceIndex] ?? null;
    const currentGroup = state.distanceGroups[state.currentDistanceIndex] ?? null;

    return { averageScore, bucketAverages, bestDistance, worstDistance, currentDistance, currentGroup, totalShots };
  }, [state.distanceGroups, state.selectedDistances, state.currentDistanceIndex]);

  return {
    ...state,
    ...computed,
    goHome,
    goToPlayerEntry,
    goToLeaderboard,
    startRound,
    submitShot,
    nextDistance,
  };
}

export type RoundHook = ReturnType<typeof useRound>;
