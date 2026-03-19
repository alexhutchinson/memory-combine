import type { DistanceGroup, LeaderboardEntry } from '../types';
import { formatDate } from '../utils';

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!SCRIPT_URL) throw new Error('VITE_APPS_SCRIPT_URL is not set.');
  const res = await fetch(`${SCRIPT_URL}?action=leaderboard`);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json() as { entries: LeaderboardEntry[] };
  return data.entries;
}

export async function submitScore(
  name: string,
  score: number,
  distanceGroups: DistanceGroup[]
): Promise<void> {
  if (!SCRIPT_URL) throw new Error('VITE_APPS_SCRIPT_URL is not set.');

  const shots = distanceGroups.flatMap(g =>
    g.shots.map((shot, i) => ({
      yards: g.distance.yards,
      bucket: g.distance.bucket,
      shotNum: i + 1,
      proximity: shot.proximity,
      points: Number(shot.points.toFixed(1)),
      feedback: shot.feedback,
    }))
  );

  // Use text/plain to avoid a CORS preflight — Apps Script reads e.postData.contents regardless
  await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'submitRound',
      name,
      score: Number(score.toFixed(2)),
      date: formatDate(new Date()),
      shots,
    }),
  });
}
