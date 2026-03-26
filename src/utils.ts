import type { FeedbackLabel } from './types';

export function getTierColor(feedback: FeedbackLabel): string {
  switch (feedback) {
    case 'Tour':       return '#f59e0b';
    case 'Elite':      return '#10b981';
    case 'Scratch':    return '#3b82f6';
    case 'Solid':      return '#8b5cf6';
    case 'Developing': return '#6b7280';
  }
}

export function getTierTextClass(feedback: FeedbackLabel): string {
  switch (feedback) {
    case 'Tour':       return 'text-amber-400';
    case 'Elite':      return 'text-emerald-400';
    case 'Scratch':    return 'text-blue-400';
    case 'Solid':      return 'text-violet-400';
    case 'Developing': return 'text-zinc-400';
  }
}

export function getTierBgClass(feedback: FeedbackLabel): string {
  switch (feedback) {
    case 'Tour':       return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
    case 'Elite':      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    case 'Scratch':    return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
    case 'Solid':      return 'bg-violet-500/15 text-violet-400 border border-violet-500/30';
    case 'Developing': return 'bg-zinc-700/20 text-zinc-400 border border-zinc-600/30';
  }
}

export function getTierGlowClass(feedback: FeedbackLabel): string {
  switch (feedback) {
    case 'Tour':       return 'glow-elite';
    case 'Elite':      return 'glow-strong';
    case 'Scratch':    return 'glow-solid';
    case 'Solid':      return '';
    case 'Developing': return '';
  }
}

export function scoreToFeedback(points: number): FeedbackLabel {
  if (points >= 80) return 'Tour';
  if (points >= 60) return 'Elite';
  if (points >= 40) return 'Scratch';
  if (points >= 20) return 'Solid';
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
