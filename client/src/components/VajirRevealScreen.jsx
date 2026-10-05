import React from 'react';
import { useGame } from '../context/SocketContext';
import { Crown, Sword, Sparkles, Loader2, Shield } from 'lucide-react';

export function VajirRevealScreen() {
  const { room, revealVajir } = useGame();

  if (!room) return null;

  const isVajir = room.myPlayer?.role === 'vajir';
  const rajaPlayer = room.players.find(p => p.visibleRole === 'raja' || p.role === 'raja');
  const rajaRoleName = room.rolesConfig?.raja?.name || 'Raja';
  const vajirRoleName = room.rolesConfig?.vajir?.name || 'Vajir';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      
      {/* Header Phase indicator */}
      <div className="text-center space-y-2 mb-6">
        <span className="px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
          Round {room.roundNumber} • Summoning the Minister
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-amber-100">
          "Who is my {vajirRoleName}?"
        </h2>
      </div>

      {/* Royal Proclamation Banner */}
      <div className="w-full max-w-xl p-5 mb-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-2 border-amber-400 shadow-xl flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-3xl shadow-md flex-shrink-0">
          👑
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-amber-300 text-sm">{rajaRoleName} {rajaPlayer?.name || 'Raja'}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[10px] font-bold">Revealed</span>
          </div>
          <p className="text-xs text-amber-100 italic mt-0.5 font-medium">
            "By royal decree, I command my loyal {vajirRoleName} to reveal their identity and inspect the suspects!"
          </p>
        </div>
      </div>

      {/* Center Action Box */}
      <div className="w-full max-w-lg mb-8">
        {isVajir ? (
          /* Current player is Vajir */
          <div className="royal-card rounded-3xl p-8 text-center space-y-6 shadow-2xl border-2 border-blue-400 bg-gradient-to-b from-blue-950/50 to-slate-900">
            
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-800 flex items-center justify-center text-5xl shadow-xl shadow-blue-500/30 border-2 border-blue-300 animate-bounce">
              ⚔️
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-blue-400 tracking-widest block">
                Royal Summons
              </span>
              <h3 className="font-cinzel text-3xl font-extrabold text-blue-100">
                You are the {vajirRoleName}!
              </h3>
              <p className="text-xs text-slate-300">
                Step forward to answer your Sovereign and prepare to deduce the hidden Chor and Sipahi.
              </p>
            </div>

            <button
              onClick={revealVajir}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-400 hover:to-indigo-400 text-white font-extrabold text-base tracking-widest uppercase shadow-2xl shadow-blue-500/40 transition-all transform active:scale-95 flex items-center justify-center gap-3"
            >
              <Sword className="w-6 h-6" />
              <span>I AM {vajirRoleName.toUpperCase()} (STEP FORWARD)</span>
            </button>
          </div>
        ) : (
          /* Other players waiting */
          <div className="royal-card rounded-3xl p-8 text-center space-y-6 border border-amber-500/30">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-950/80 border border-slate-700 flex items-center justify-center text-3xl text-blue-400">
              <Sword className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-cinzel text-2xl font-bold text-blue-200">
                Waiting for {vajirRoleName}...
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                The {vajirRoleName} is preparing to present their credentials before the King.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/60 border border-slate-800 text-xs text-blue-300/80">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Awaiting Advisor's response</span>
            </div>
          </div>
        )}
      </div>

      {/* 4 Players Court Snapshot */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        {room.players.map((p) => {
          const isKnownRaja = p.visibleRole === 'raja';
          return (
            <div
              key={p.id}
              className={`p-3.5 rounded-2xl text-center border transition-all ${
                isKnownRaja
                  ? 'bg-amber-950/40 border-amber-400 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/40 border-slate-800'
              }`}
            >
              <div className="text-2xl mb-1">{p.avatar || '👤'}</div>
              <h4 className="font-cinzel text-xs font-bold text-slate-200 truncate">{p.name}</h4>
              <span className={`text-[10px] mt-0.5 block font-semibold ${
                isKnownRaja ? 'text-amber-400' : 'text-slate-500'
              }`}>
                {isKnownRaja ? `👑 ${rajaRoleName}` : 'Identity Hidden'}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
