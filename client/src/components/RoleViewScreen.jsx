import React, { useState } from 'react';
import { useGame } from '../context/SocketContext';
import { Crown, Sparkles, Shield, Sword, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { playCardFlip } from '../utils/audio';

export function RoleViewScreen() {
  const { room, acknowledgeRole } = useGame();
  const [isFlipped, setIsFlipped] = useState(true); // default revealed to player

  if (!room || !room.myPlayer) return null;

  const myRoleKey = room.myPlayer.role;
  const roleInfo = room.rolesConfig?.[myRoleKey] || {
    name: myRoleKey?.toUpperCase(),
    icon: '📜',
    title: 'Courtier',
    description: 'Play your role with cunning.'
  };

  const roleMeta = {
    raja: {
      color: 'from-amber-500 via-yellow-500 to-amber-600',
      badge: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
      points: `+${room.scoringConfig?.raja || 1000} Pts (Guaranteed)`,
      instructions: 'You are the sovereign King! Next, reveal yourself with "I AM RAJA" and command your Vajir.'
    },
    vajir: {
      color: 'from-blue-500 via-indigo-500 to-blue-700',
      badge: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
      points: `+${room.scoringConfig?.vajirCorrect || 600} Pts if correct (0 if wrong)`,
      instructions: 'You are the royal advisor! Step up after the Raja reveals, then deduce the Chor and Sipahi!'
    },
    chor: {
      color: 'from-rose-500 via-red-600 to-rose-800',
      badge: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
      points: `+${room.scoringConfig?.chorEscaped || 300} Pts if Vajir fails`,
      instructions: 'You are the thief! Keep your identity strictly hidden and bluff so the Vajir suspects someone else!'
    },
    sipahi: {
      color: 'from-emerald-500 via-teal-600 to-emerald-800',
      badge: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
      points: `+${room.scoringConfig?.sipahiEscaped || 400} Pts if Vajir fails`,
      instructions: 'You are the loyal soldier! Remain calm and do not let the Vajir falsely identify you!'
    }
  }[myRoleKey] || {
    color: 'from-amber-500 to-yellow-600',
    badge: 'bg-amber-500/20 text-amber-300',
    points: 'Points determined by court rules',
    instructions: 'Follow the instructions as the round unfolds.'
  };

  const toggleFlip = () => {
    playCardFlip();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center">
      
      {/* Top Banner */}
      <div className="text-center space-y-2 mb-6">
        <span className="px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
          Round {room.roundNumber} • Secret Parchi Distribution
        </span>
        <h2 className="font-cinzel text-3xl font-extrabold text-amber-100">
          Your Secret Role
        </h2>
        <p className="text-xs text-slate-300/80">
          Keep this secret from the other players! Click the card to hide/reveal anytime.
        </p>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={toggleFlip}
        className="w-full max-w-sm h-[380px] perspective-1000 cursor-pointer my-4 group"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? '' : 'rotate-y-180'
          }`}
        >
          {/* Card Front (Secret Role Revealed) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 flex flex-col items-center justify-between text-center overflow-hidden">
            
            {/* Top gold seal */}
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400/80">ROYAL CROWN</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Secret Chit
              </span>
            </div>

            {/* Role Icon & Name */}
            <div className="flex flex-col items-center space-y-2 my-auto">
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${roleMeta.color} flex items-center justify-center text-5xl shadow-xl shadow-black/60 border-2 border-amber-300 transform group-hover:scale-105 transition-transform`}>
                {roleInfo.icon || '👑'}
              </div>
              <div>
                <h3 className="font-cinzel text-3xl font-extrabold text-amber-200">
                  {roleInfo.name}
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  {roleInfo.title || 'Royal Court Role'}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${roleMeta.badge}`}>
                {roleMeta.points}
              </div>
            </div>

            {/* Lore / Instructions */}
            <div className="w-full p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 leading-snug">
              {roleMeta.instructions}
            </div>

            {/* Hide hint */}
            <div className="flex items-center gap-1.5 text-[10px] text-amber-400/60 font-semibold mt-1">
              <EyeOff className="w-3 h-3" />
              <span>Tap card to hide privacy shield</span>
            </div>
          </div>

          {/* Card Back (Privacy Shield) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-6 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 border-2 border-slate-700 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center text-3xl text-amber-400">
              🔒
            </div>
            <div>
              <h3 className="font-cinzel text-xl font-bold text-slate-200">Identity Concealed</h3>
              <p className="text-xs text-slate-400 mt-1">Tap card to inspect your royal role.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ready / Acknowledge Button */}
      <div className="w-full max-w-sm mt-4">
        <button
          onClick={acknowledgeRole}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-xl shadow-amber-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
        >
          <span>I am Ready • Step to Court</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
