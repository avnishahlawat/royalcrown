import React, { useState } from 'react';
import { useGame } from '../context/SocketContext';
import { Trophy, Crown, Award, ArrowRight, History, CheckCircle, XCircle, Sparkles, Flag } from 'lucide-react';

export function RoundResultScreen() {
  const { room, nextRound, endMatch } = useGame();
  const [showHistory, setShowHistory] = useState(false);

  if (!room || !room.currentRound) return null;

  const isHost = room.hostId === room.myPlayer?.id;
  const isCorrect = room.currentRound.isGuessCorrect;
  const scoresAwarded = room.currentRound.scoresAwarded || {};

  const rajaRoleName = room.rolesConfig?.raja?.name || 'Raja';
  const vajirRoleName = room.rolesConfig?.vajir?.name || 'Vajir';
  const chorRoleName = room.rolesConfig?.chor?.name || 'Chor';
  const sipahiRoleName = room.rolesConfig?.sipahi?.name || 'Sipahi';

  // Sort players by cumulative total score for scoreboard
  const sortedPlayers = [...room.players].sort((a, b) => b.totalScore - a.totalScore);
  const rankIcons = ['🥇', '🥈', '🥉', '4️⃣'];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
      
      {/* Result Status Banner */}
      <div className="text-center space-y-3 mb-8 w-full max-w-2xl">
        <span className="px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
          Round {room.roundNumber} / {room.maxRounds} Complete
        </span>

        <div className={`p-6 rounded-3xl border-2 shadow-2xl transition-all ${
          isCorrect
            ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border-emerald-400 shadow-emerald-500/20'
            : 'bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/60 border-rose-400 shadow-rose-500/20'
        }`}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">{isCorrect ? '🎉' : '🕵️'}</span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl font-extrabold ${
              isCorrect ? 'text-emerald-300' : 'text-rose-300'
            }`}>
              {isCorrect ? 'Deduction Successful!' : 'The Chor Escaped!'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            {isCorrect
              ? `The ${vajirRoleName} saw through the deception and earned royal glory!`
              : `The sneaky ${chorRoleName} bamboozled the court and took the bounty!`}
          </p>
        </div>
      </div>

      {/* 4 Roles Revealed Grid */}
      <div className="w-full mb-10">
        <h3 className="font-cinzel text-lg font-bold text-amber-200 mb-4 text-center">
          📜 Revealed Identities & Round Points
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {room.players.map((player) => {
            const roleKey = player.visibleRole || player.role;
            const ptsEarned = scoresAwarded[player.id] ?? 0;

            const roleDetails = {
              raja: { name: rajaRoleName, icon: '👑', border: 'border-amber-400', bg: 'from-amber-950/40 to-slate-900' },
              vajir: { name: vajirRoleName, icon: '⚔️', border: 'border-blue-400', bg: 'from-blue-950/40 to-slate-900' },
              chor: { name: chorRoleName, icon: '🕵️', border: 'border-rose-400', bg: 'from-rose-950/40 to-slate-900' },
              sipahi: { name: sipahiRoleName, icon: '🛡️', border: 'border-emerald-400', bg: 'from-emerald-950/40 to-slate-900' }
            }[roleKey] || { name: 'Courtier', icon: '📜', border: 'border-slate-700', bg: 'from-slate-900 to-slate-950' };

            return (
              <div
                key={player.id}
                className={`p-5 rounded-3xl bg-gradient-to-b ${roleDetails.bg} border-2 ${roleDetails.border} shadow-xl flex flex-col items-center text-center relative overflow-hidden`}
              >
                {/* Round score pill */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 border border-amber-500/30 font-bold text-xs text-amber-300">
                  +{ptsEarned} pts
                </div>

                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl mb-3 shadow-inner">
                  {player.avatar || '👤'}
                </div>

                <h4 className="font-cinzel text-base font-bold text-slate-100 truncate w-full mb-1">
                  {player.name}
                </h4>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 border border-slate-800 text-xs font-bold text-amber-300 mt-2">
                  <span>{roleDetails.icon}</span>
                  <span>{roleDetails.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cumulative Tournament Scoreboard */}
      <div className="w-full max-w-2xl royal-card rounded-3xl p-6 sm:p-8 mb-8 border border-amber-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-cinzel text-xl font-bold text-amber-200">
              Tournament Standings
            </h3>
          </div>
          <span className="text-xs text-amber-300/70 font-semibold">
            Cumulative Leaderboard
          </span>
        </div>

        {/* Player Ranks List */}
        <div className="space-y-2.5">
          {sortedPlayers.map((p, idx) => {
            const isMe = p.id === room.myPlayer?.id;
            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                  idx === 0
                    ? 'bg-amber-500/15 border-2 border-amber-400 shadow-md shadow-amber-500/10'
                    : isMe
                    ? 'bg-indigo-950/30 border border-indigo-500/40'
                    : 'bg-slate-950/50 border border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{rankIcons[idx] || `${idx + 1}.`}</span>
                  <div className="text-2xl">{p.avatar || '👤'}</div>
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>{p.name}</span>
                      {isMe && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-slate-950 font-extrabold uppercase">
                          YOU
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Raja: {p.stats.timesRaja}x • Deductions: {p.stats.correctGuesses}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-cinzel text-xl font-extrabold text-amber-400">
                    {p.totalScore}
                  </span>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                    Points
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Round History Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-xs font-semibold text-amber-400/80 hover:text-amber-300 transition-colors mx-auto"
          >
            <History className="w-3.5 h-3.5" />
            <span>{showHistory ? 'Hide Round History' : 'View Round-by-Round History'}</span>
          </button>

          {showHistory && (
            <div className="mt-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs max-h-48 overflow-y-auto animate-in fade-in">
              {room.history.map((h, i) => (
                <div key={i} className="p-2 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-amber-300">Round {h.roundNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    h.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {h.isCorrect ? 'Vajir Won' : 'Chor Won'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Host Controls / Next Round Actions */}
      <div className="w-full max-w-md text-center">
        {isHost ? (
          <div className="space-y-3">
            <button
              onClick={nextRound}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-base tracking-wider uppercase shadow-xl shadow-amber-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{room.roundNumber >= room.maxRounds ? '🏆 View Final Standings' : `👑 Deal Next Round (${room.roundNumber + 1}/${room.maxRounds})`}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {room.roundNumber < room.maxRounds && (
              <button
                onClick={endMatch}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 mx-auto"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>End Tournament Early</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 text-center space-y-1">
            <p className="text-sm font-bold text-amber-200">Waiting for Host to begin next round...</p>
            <p className="text-xs text-slate-400">Roles will be reshuffled across all players!</p>
          </div>
        )}
      </div>

    </div>
  );
}
