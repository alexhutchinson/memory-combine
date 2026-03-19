import type { Bucket, DistanceData } from '../types';

export const TOUR_DATA: DistanceData[] = [
  // Wedges (55–90 yards)
  { yards: 55,  tourMedian: 12.4, scratchBenchmark: 14.9, bucket: 'Wedges' },
  { yards: 61,  tourMedian: 12.9, scratchBenchmark: 15.5, bucket: 'Wedges' },
  { yards: 70,  tourMedian: 13.2, scratchBenchmark: 15.8, bucket: 'Wedges' },
  { yards: 80,  tourMedian: 13.6, scratchBenchmark: 16.3, bucket: 'Wedges' },
  { yards: 90,  tourMedian: 14.6, scratchBenchmark: 17.5, bucket: 'Wedges' },

  // Mid Irons (98–155 yards)
  { yards: 98,  tourMedian: 15.8, scratchBenchmark: 19.0, bucket: 'Mid' },
  { yards: 105, tourMedian: 16.8, scratchBenchmark: 20.2, bucket: 'Mid' },
  { yards: 110, tourMedian: 17.3, scratchBenchmark: 20.8, bucket: 'Mid' },
  { yards: 115, tourMedian: 17.9, scratchBenchmark: 21.5, bucket: 'Mid' },
  { yards: 120, tourMedian: 18.5, scratchBenchmark: 22.2, bucket: 'Mid' },
  { yards: 126, tourMedian: 19.3, scratchBenchmark: 23.2, bucket: 'Mid' },
  { yards: 136, tourMedian: 20.2, scratchBenchmark: 24.2, bucket: 'Mid' },
  { yards: 141, tourMedian: 21.0, scratchBenchmark: 25.2, bucket: 'Mid' },
  { yards: 150, tourMedian: 22.8, scratchBenchmark: 27.4, bucket: 'Mid' },
  { yards: 155, tourMedian: 24.0, scratchBenchmark: 28.8, bucket: 'Mid' },

  // Long Irons (170–210 yards)
  { yards: 170, tourMedian: 27.8, scratchBenchmark: 33.4, bucket: 'Long' },
  { yards: 175, tourMedian: 29.6, scratchBenchmark: 35.5, bucket: 'Long' },
  { yards: 176, tourMedian: 29.6, scratchBenchmark: 35.5, bucket: 'Long' },
  { yards: 180, tourMedian: 30.8, scratchBenchmark: 37.0, bucket: 'Long' },
  { yards: 189, tourMedian: 32.6, scratchBenchmark: 39.1, bucket: 'Long' },
  { yards: 198, tourMedian: 34.2, scratchBenchmark: 41.0, bucket: 'Long' },
  { yards: 202, tourMedian: 36.3, scratchBenchmark: 43.6, bucket: 'Long' },
  { yards: 205, tourMedian: 37.6, scratchBenchmark: 45.1, bucket: 'Long' },
  { yards: 210, tourMedian: 39.8, scratchBenchmark: 47.8, bucket: 'Long' },
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
