import React from 'react';
import { Crown, Sparkles, Users, KeyRound, HelpCircle, Shield, Sword, EyeOff, Trophy, Bot } from 'lucide-react';
import { useGame } from '../context/SocketContext';

export function HomeScreen({ onOpenCreate, onOpenJoin, onOpenRules }) {
  const { createRoom, addBot, playerName, playerAvatar } = useGame();

  const handleQuickPractice = async () => {
    const defaultName = playerName.trim() || 'Crown Challenger';
    const res = await createRoom(defaultName, playerAvatar || '👑', { maxRounds: 3 });
    if (res?.success) {
      // Add 3 AI bots automatically for instant singleplayer / testing
      setTimeout(() => addBot(), 300);
      setTimeout(() => addBot(), 600);
      setTimeout(() => addBot(), 900);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      
      {/* Royal Crown Crest & Hero */}
      <div className="text-center space-y-4 mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest shadow-inner mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          The Classic Indian Royal Bluffing Game
        </div>

        <div className="relative inline-block">
          <h1 className="font-cinzel text-5xl sm:text-7xl font-extrabold tracking-wider bg-gradient-to-b from-amber-100 via-amber-300 to-yellow-600 bg-clip-text text-transparent drop-shadow-2xl">
            ROYAL CROWN
          </h1>
          <div className="absolute -top-6 -right-6 text-3xl animate-bounce">
            👑
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal">
          Immerse in the timeless battle of wits: <strong>Raja</strong> commands, <strong>Vajir</strong> deduces, <strong>Chor</strong> bluffs, and <strong>Sipahi</strong> holds the line. Real-time 4-player mystery!
        </p>
      </div>

      {/* Primary Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
        
        {/* Create Room Card */}
        <div
          onClick={onOpenCreate}
          className="group relative p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-amber-950/30 border border-amber-500/30 hover:border-amber-400/80 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 overflow-hidden"
        >
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Crown className="w-8 h-8 fill-slate-950" />
            </div>
            <div>
              <h3 className="font-cinzel text-2xl font-bold text-amber-200 group-hover:text-amber-300 transition-colors">
                Create Room
              </h3>
              <p className="text-xs text-amber-300/60 font-semibold uppercase tracking-wider">Host as King</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            Host a new royal room, customize roles (e.g. Mantri, Senapati), adjust point tables, and invite 3 friends via room code.
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:text-amber-300">
            <span>Configure & Start Court</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* Join Room Card */}
        <div
          onClick={onOpenJoin}
          className="group relative p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/30 border border-blue-500/30 hover:border-blue-400/80 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 overflow-hidden"
        >
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <KeyRound className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-cinzel text-2xl font-bold text-blue-200 group-hover:text-blue-300 transition-colors">
                Join Room
              </h3>
              <p className="text-xs text-blue-300/60 font-semibold uppercase tracking-wider">Enter with Code</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            Have a 5-digit room code from your host? Enter the room instantly and claim your secret chit for the round.
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 group-hover:text-blue-300">
            <span>Enter Code & Join</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

      </div>

      {/* Secondary Actions: Quick Solo AI Practice & How to Play */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-xl">
        <button
          onClick={handleQuickPractice}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-200 border border-amber-500/30 hover:border-amber-400 transition-all text-xs font-bold shadow-lg shadow-black/40 transform active:scale-95"
        >
          <Bot className="w-4 h-4 text-amber-400" />
          <span>Solo Practice vs AI Bots</span>
        </button>

        <button
          onClick={onOpenRules}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all text-xs font-semibold shadow-lg shadow-black/40 transform active:scale-95"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Rules & Scoring Guide</span>
        </button>
      </div>

      {/* Four Roles Feature Bar */}
      <div className="mt-16 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center space-y-1">
          <span className="text-3xl block">👑</span>
          <h4 className="font-cinzel text-sm font-bold text-amber-300">Raja</h4>
          <p className="text-[11px] text-amber-400/80 font-medium">+1000 Pts</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-blue-500/20 text-center space-y-1">
          <span className="text-3xl block">⚔️</span>
          <h4 className="font-cinzel text-sm font-bold text-blue-300">Vajir</h4>
          <p className="text-[11px] text-blue-400/80 font-medium">+600 / 0 Pts</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-500/20 text-center space-y-1">
          <span className="text-3xl block">🕵️</span>
          <h4 className="font-cinzel text-sm font-bold text-rose-300">Chor</h4>
          <p className="text-[11px] text-rose-400/80 font-medium">+300 / 0 Pts</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20 text-center space-y-1">
          <span className="text-3xl block">🛡️</span>
          <h4 className="font-cinzel text-sm font-bold text-emerald-300">Sipahi</h4>
          <p className="text-[11px] text-emerald-400/80 font-medium">+400 / 0 Pts</p>
        </div>
      </div>

    </div>
  );
}
