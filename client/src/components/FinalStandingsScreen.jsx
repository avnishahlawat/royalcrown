import React from 'react';
import { useGame } from '../context/SocketContext';
import { Trophy, Crown, RotateCcw, Home, Sparkles, Award, Star, History } from 'lucide-react';
import { fireVictoryConfetti } from '../utils/confetti';

export function FinalStandingsScreen() {
  const { room, playAgain, leaveRoom } = useGame();

  if (!room) return null;

  const isHost = room.hostId === room.myPlayer?.id;
  const sortedPlayers = [...room.players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedPlayers[0];

  const rankIcons = ['🥇', '🥈', '🥉', '4️⃣'];
  const rankLabels = ['CHAMPION', 'RUNNER UP', 'THIRD PLACE', 'FOURTH PLACE'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      
      {/* Crown Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold uppercase tracking-widest animate-pulse">
          <Crown className="w-4 h-4 fill-amber-300" />
          Tournament Grand Finale
        </div>

        <h1 className="font-cinzel text-4xl sm:text-6xl font-extrabold bg-gradient-to-b from-amber-100 via-amber-300 to-yellow-600 bg-clip-text text-transparent drop-shadow-2xl">
          ROYAL CROWN
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          The parchment chits have settled. Behold the sovereign champion of the realm!
        </p>
      </div>

      {/* Grand Winner Spotlight Card */}
      {winner && (
        <div className="w-full max-w-xl p-8 mb-10 rounded-3xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/30 text-center relative overflow-hidden royal-glow">
          <div className="absolute top-2 right-4 text-4xl opacity-20">👑</div>
          
          <div className="relative inline-block mb-3">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/40 border-2 border-amber-200">
              {winner.avatar || '👑'}
            </div>
            <span className="absolute -top-3 -right-3 text-3xl">👑</span>
          </div>

          <span className="text-xs uppercase font-extrabold text-amber-400 tracking-widest block mb-1">
            Reigning Champion
          </span>

          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-amber-100 mb-2">
            {winner.name}
          </h2>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/30 border border-amber-400 text-amber-200 font-cinzel text-xl font-bold">
            <Trophy className="w-5 h-5 text-amber-300" />
            <span>{winner.totalScore} Points</span>
          </div>
        </div>
      )}

      {/* Complete Rankings Podium Table */}
      <div className="w-full max-w-2xl royal-card rounded-3xl p-6 sm:p-8 mb-8 border border-amber-500/30 space-y-4">
        <h3 className="font-cinzel text-xl font-bold text-amber-200 mb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Final Standings
        </h3>

        <div className="space-y-3">
          {sortedPlayers.map((p, idx) => {
            const isMe = p.id === room.myPlayer?.id;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
                  idx === 0
                    ? 'bg-amber-500/20 border-2 border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/60 border border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl">{rankIcons[idx]}</span>
                  <div className="text-2xl">{p.avatar || '👤'}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-cinzel text-base font-bold text-slate-100">
                        {p.name}
                      </h4>
                      {isMe && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-slate-950 font-extrabold uppercase">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-amber-300/70 font-semibold uppercase tracking-wider">
                      {rankLabels[idx]}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-cinzel text-2xl font-extrabold text-amber-400">
                    {p.totalScore}
                  </span>
                  <span className="text-[10px] text-slate-400 block uppercase">
                    Total Pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tournament Stats & Accolades */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-xs text-center">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20">
          <span className="text-2xl block mb-1">👑</span>
          <span className="font-bold text-amber-300 block mb-0.5">Rounds Played</span>
          <span className="text-slate-300 font-semibold">{room.roundNumber} Total Rounds</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/20">
          <span className="text-2xl block mb-1">⚔️</span>
          <span className="font-bold text-blue-300 block mb-0.5">Vajir Accuracy</span>
          <span className="text-slate-300 font-semibold">
            {room.history.filter(h => h.isCorrect).length} / {room.history.length} Correct
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/20">
          <span className="text-2xl block mb-1">🕵️</span>
          <span className="font-bold text-rose-300 block mb-0.5">Chor Heists</span>
          <span className="text-slate-300 font-semibold">
            {room.history.filter(h => !h.isCorrect).length} Successful Escapes
          </span>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="w-full max-w-md flex flex-col sm:flex-row gap-3">
        {isHost ? (
          <button
            onClick={playAgain}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-amber-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        ) : (
          <div className="flex-1 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
            Waiting for host to restart match...
          </div>
        )}

        <button
          onClick={leaveRoom}
          className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>

    </div>
  );
}
