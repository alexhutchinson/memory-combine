import type { Bucket, DistanceData } from '../types';

export const TOUR_DATA: DistanceData[] = [
  // Wedges (55–90 yards)
  { yards: 55,  tourMedian: 19.0, scratchBenchmark: 22.8, bucket: 'Wedges' },
  { yards: 61,  tourMedian: 19.0, scratchBenchmark: 22.8, bucket: 'Wedges' },
  { yards: 70,  tourMedian: 20.0, scratchBenchmark: 24.0, bucket: 'Wedges' },
  { yards: 80,  tourMedian: 20.0, scratchBenchmark: 24.0, bucket: 'Wedges' },
  { yards: 90,  tourMedian: 22.0, scratchBenchmark: 26.4, bucket: 'Wedges' },

  // Mid Irons (98–155 yards)
  { yards: 98,  tourMedian: 23.0, scratchBenchmark: 27.6, bucket: 'Mid' },
  { yards: 105, tourMedian: 25.0, scratchBenchmark: 30.0, bucket: 'Mid' },
  { yards: 110, tourMedian: 25.0, scratchBenchmark: 30.0, bucket: 'Mid' },
  { yards: 115, tourMedian: 26.0, scratchBenchmark: 31.2, bucket: 'Mid' },
  { yards: 120, tourMedian: 28.0, scratchBenchmark: 33.6, bucket: 'Mid' },
  { yards: 126, tourMedian: 28.0, scratchBenchmark: 33.6, bucket: 'Mid' },
  { yards: 136, tourMedian: 29.0, scratchBenchmark: 34.8, bucket: 'Mid' },
  { yards: 141, tourMedian: 30.0, scratchBenchmark: 36.0, bucket: 'Mid' },
  { yards: 150, tourMedian: 31.5, scratchBenchmark: 37.8, bucket: 'Mid' },
  { yards: 155, tourMedian: 32.5, scratchBenchmark: 39.0, bucket: 'Mid' },

  // Long Irons (170–210 yards)
  { yards: 170, tourMedian: 34.5, scratchBenchmark: 41.4, bucket: 'Long' },
  { yards: 175, tourMedian: 35.5, scratchBenchmark: 42.6, bucket: 'Long' },
  { yards: 176, tourMedian: 35.5, scratchBenchmark: 42.6, bucket: 'Long' },
  { yards: 180, tourMedian: 36.5, scratchBenchmark: 43.8, bucket: 'Long' },
  { yards: 189, tourMedian: 38.0, scratchBenchmark: 45.6, bucket: 'Long' },
  { yards: 198, tourMedian: 39.5, scratchBenchmark: 47.4, bucket: 'Long' },
  { yards: 202, tourMedian: 40.5, scratchBenchmark: 48.6, bucket: 'Long' },
  { yards: 205, tourMedian: 41.0, scratchBenchmark: 49.2, bucket: 'Long' },
  { yards: 210, tourMedian: 42.0, scratchBenchmark: 50.4, bucket: 'Long' },
];

export function getByBucket(bucket: Bucket): DistanceData[] {
  return TOUR_DATA.filter(d => d.bucket === bucket);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Randomly pick 2 from each bucket, then shuffle the 6 together. */
export function selectRoundDistances(): DistanceData[] {
  const buckets: Bucket[] = ['Wedges', 'Mid', 'Long'];
  const selected: DistanceData[] = [];
  for (const bucket of buckets) {
    const pool = shuffle(getByBucket(bucket));
    selected.push(pool[0], pool[1]);
  }
  return shuffle(selected);
}
