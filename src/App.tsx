import { useRound } from './hooks/useRound';
import { HomePage } from './components/HomePage';
import { PlayerEntry } from './components/PlayerEntry';
import { RoundPlay } from './components/RoundPlay';
import { RoundSummary } from './components/RoundSummary';
import { Leaderboard } from './components/Leaderboard';

export default function App() {
  const round = useRound();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {round.screen === 'home' && (
        <HomePage onStart={round.goToPlayerEntry} onLeaderboard={round.goToLeaderboard} />
      )}
      {round.screen === 'playerEntry' && (
        <PlayerEntry onSubmit={round.startRound} onBack={round.goHome} />
      )}
      {round.screen === 'playing' && (
        <RoundPlay round={round} />
      )}
      {round.screen === 'summary' && (
        <RoundSummary round={round} />
      )}
      {round.screen === 'leaderboard' && (
        <Leaderboard onBack={round.goHome} />
      )}
    </div>
  );
}
