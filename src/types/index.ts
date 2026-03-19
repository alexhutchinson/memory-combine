export type FeedbackLabel = 'Elite' | 'Strong' | 'Solid' | 'Developing';
export type Bucket = 'Wedges' | 'Mid' | 'Long';
export type GameScreen = 'home' | 'playerEntry' | 'playing' | 'summary' | 'leaderboard';
export type ShotPhase = 'entry' | 'result' | 'distanceSummary';

export interface DistanceData {
  yards: number;
  tourMedian: number;
  scratchBenchmark: number;
  bucket: Bucket;
}

export interface ShotResult {
  distanceYards: number;
  proximity: number;
  points: number;
  feedback: FeedbackLabel;
  tourMedian: number;
  scratchBenchmark: number;
}

export interface DistanceGroup {
  distance: DistanceData;
  shots: ShotResult[];
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
  roundDetail?: string;
}
