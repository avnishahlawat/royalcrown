import React, { useState } from 'react';
import { useGame } from '../context/SocketContext';
import { Volume2, VolumeX, HelpCircle, LogOut, Copy, Check, Crown, Shield } from 'lucide-react';

export function Navbar({ onOpenRules }) {
  const { room, isAudioMuted, toggleAudio, leaveRoom, isConnected } = useGame();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!room?.code) return;
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="w-full border-b border-amber-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => !room && window.location.reload()}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 shadow-lg shadow-amber-500/20 border border-amber-300">
            <Crown className="w-6 h-6 text-slate-950 fill-slate-950" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                ROYAL CROWN
              </h1>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Raja Vajir Chor Sipahi
              </span>
            </div>
            <p className="text-[11px] text-amber-200/50 tracking-wider">Deception • Strategy • Deduction</p>
          </div>
        </div>

        {/* Room Info & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {room && (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-inner">
              <div className="text-right">
                <span className="text-[10px] text-amber-300/60 uppercase block font-semibold">Room Code</span>
                <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">{room.code}</span>
              </div>
              <button
                onClick={handleCopyCode}
                title="Copy Room Code"
                className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors border border-amber-500/30"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <button
            onClick={toggleAudio}
            title={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          </button>

          <button
            onClick={onOpenRules}
            title="How to Play"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-all text-xs font-semibold"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          {room && (
            <button
              onClick={leaveRoom}
              title="Leave Game"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all text-xs font-semibold"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
