import React, { useState } from 'react';
import { useGame } from '../context/SocketContext';
import { KeyRound, X, Sparkles, Shield } from 'lucide-react';

const AVATARS = ['🦁', '🦅', '🐅', '🐘', '🐺', '🦊', '🐉', '🦄', '⚔️', '👑'];

export function JoinGameModal({ isOpen, onClose, initialCode = '' }) {
  const { joinRoom, playerName, playerAvatar } = useGame();
  
  const [name, setName] = useState(playerName || '');
  const [avatar, setAvatar] = useState(playerAvatar || '🦁');
  const [roomCode, setRoomCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !roomCode.trim()) return;
    setLoading(true);

    const res = await joinRoom(roomCode.trim().toUpperCase(), name, avatar);
    setLoading(false);
    if (res?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md flex flex-col bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-500/20 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-500/20 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-bold text-amber-200">Enter Royal Court</h2>
              <p className="text-xs text-amber-300/60">Join an existing 4-player game</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleJoin} className="p-6 space-y-5 text-sm">
          
          {/* Room Code */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
              5-Character Room Code
            </label>
            <input
              type="text"
              required
              maxLength={5}
              placeholder="e.g. X7K9P"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-amber-500/30 text-amber-300 font-mono text-center text-xl font-bold tracking-widest placeholder-slate-600 focus:outline-none focus:border-amber-400 uppercase transition-colors"
            />
          </div>

          {/* Player Name & Avatar */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
              Your Player Name & Crest
            </label>
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
                {avatar}
              </div>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-amber-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 text-sm font-medium"
              />
            </div>

            {/* Avatar Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all ${
                    avatar === av
                      ? 'bg-amber-500/30 border-2 border-amber-400 scale-110 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/60 border border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !name.trim() || roomCode.length < 3}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-xl shadow-amber-500/20 transition-all transform active:scale-98 disabled:opacity-50"
            >
              {loading ? 'Entering Court...' : '⚔️ Join Royal Game'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
