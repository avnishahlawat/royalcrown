import React from 'react';
import { useGame } from '../context/SocketContext';
import { Crown, Sparkles, Eye, ShieldAlert, Loader2 } from 'lucide-react';

export function RajaRevealScreen() {
  const { room, revealRaja } = useGame();

  if (!room) return null;

  const isRaja = room.myPlayer?.role === 'raja';
  const rajaRoleName = room.rolesConfig?.raja?.name || 'Raja';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      
      {/* Header Phase indicator */}
      <div className="text-center space-y-2 mb-8">
        <span className="px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
          Round {room.roundNumber} • Proclamation Phase
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-amber-100">
          The King Steps Forward
        </h2>
        <p className="text-xs sm:text-sm text-slate-300/80 max-w-md mx-auto">
          The sovereign ruler must first announce their majesty to the royal court before commanding their minister.
        </p>
      </div>

      {/* Center Action Box */}
      <div className="w-full max-w-lg mb-8">
        {isRaja ? (
          /* Current player is Raja */
          <div className="royal-card-gold rounded-3xl p-8 text-center space-y-6 shadow-2xl border-2 border-amber-400 royal-glow">
            
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/30 border-2 border-amber-200 animate-bounce">
              👑
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-amber-400 tracking-widest block">
                Your Majesty
              </span>
              <h3 className="font-cinzel text-3xl font-extrabold text-amber-100">
                You are the {rajaRoleName}!
              </h3>
              <p className="text-xs text-slate-300">
                Click below to reveal your identity to all 4 players and summon your Vajir!
              </p>
            </div>

            <button
              onClick={revealRaja}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-extrabold text-base tracking-widest uppercase shadow-2xl shadow-amber-500/40 transition-all transform active:scale-95 flex items-center justify-center gap-3"
            >
              <Crown className="w-6 h-6 fill-slate-950" />
              <span>I AM {rajaRoleName.toUpperCase()}!</span>
            </button>
          </div>
        ) : (
          /* Other players are waiting */
          <div className="royal-card rounded-3xl p-8 text-center space-y-6 border border-amber-500/30">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-950/80 border border-slate-700 flex items-center justify-center text-3xl text-amber-400/80">
              <Crown className="w-10 h-10 animate-pulse text-amber-400" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-cinzel text-2xl font-bold text-amber-200">
                Waiting for {rajaRoleName}...
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                The throne awaits its sovereign. The player holding the royal chit is preparing their grand proclamation.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/60 border border-slate-800 text-xs text-amber-300/80">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Court is in silent anticipation</span>
            </div>
          </div>
        )}
      </div>

      {/* 4 Players Court Snapshot */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        {room.players.map((p) => {
          const isMe = p.id === room.myPlayer?.id;
          return (
            <div
              key={p.id}
              className={`p-3.5 rounded-2xl text-center border transition-all ${
                isMe
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-950/40 border-slate-800'
              }`}
            >
              <div className="text-2xl mb-1">{p.avatar || '👤'}</div>
              <h4 className="font-cinzel text-xs font-bold text-slate-200 truncate">{p.name}</h4>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Identity Hidden</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
