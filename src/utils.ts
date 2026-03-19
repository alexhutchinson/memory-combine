import type { FeedbackLabel } from './types';

export function getTierColor(feedback: FeedbackLabel): string {
  switch (feedback) {
    case 'Elite':      return '#f59e0b';
    case 'Strong':     return '#10b981';
    case 'Solid':      return '#3b82f6';
    case 'Developing': return '#6b7280';
  }
}

export function getTierTextClass(feedback: FeedbackLabel): string {
  switch (feedback) {
    case 'Elite':      return 'text-amber-400';
    case 'Strong':     return 'text-emerald-400';
    case 'Solid':      return 'text-blue-400';
    case 'Developing': return 'text-zinc-400';
  }
}

export function getTierBgClass(feedback: FeedbackLabel): string {
  switch (feedback) {
    case 'Elite':      return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
    case 'Strong':     return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    case 'Solid':      return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
    case 'Developing': return 'bg-zinc-700/20 text-zinc-400 border border-zinc-600/30';
  }
}

export function getTierGlowClass(feedback: FeedbackLabel): string {
  switch (feedback) {
    case 'Elite':      return 'glow-elite';
    case 'Strong':     return 'glow-strong';
    case 'Solid':      return 'glow-solid';
    case 'Developing': return '';
  }
}

export function scoreToFeedback(points: number): FeedbackLabel {
  if (points >= 90) return 'Elite';
  if (points >= 75) return 'Strong';
  if (points >= 60) return 'Solid';
  return 'Developing';
}

export function calculatePoints(proximity: number, scratchBenchmark: number): number {
  return Math.min((scratchBenchmark / proximity) * 50, 100);
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
