import React, { useState } from 'react';
import { useGame } from '../context/SocketContext';
import { Crown, Users, UserPlus, UserMinus, Play, Copy, Check, Sparkles, Shield, Sword, EyeOff, Award, Share2 } from 'lucide-react';

export function LobbyScreen() {
  const { room, addBot, removeBot, startGame } = useGame();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!room) return null;

  const isHost = room.hostId === room.myPlayer?.id;
  const playerCount = room.players.length;
  const isFull = playerCount === 4;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?room=${room.code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Build array of 4 slots
  const slots = [0, 1, 2, 3].map((idx) => {
    const player = room.players[idx];
    return {
      index: idx,
      player: player || null
    };
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
      
      {/* Lobby Header Card */}
      <div className="w-full royal-card rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden border border-amber-500/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Room Title & Code */}
          <div className="text-center md:text-left space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                Royal Lobby
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Round Limit: <strong>{room.maxRounds} Rounds</strong>
              </span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-amber-100 flex items-center justify-center md:justify-start gap-3">
              Room Code: <span className="text-amber-400 tracking-widest font-mono">{room.code}</span>
            </h2>

            <p className="text-xs text-slate-300/80">
              Share this code or invite link with 3 friends to begin the royal assembly.
            </p>
          </div>

          {/* Action Buttons: Copy Code & Link */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all transform active:scale-95"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all transform active:scale-95"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
            </button>
          </div>

        </div>

        {/* Player Count Bar */}
        <div className="mt-6 pt-6 border-t border-amber-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-200">
              Players Present: <span className={`text-base font-extrabold ${isFull ? 'text-emerald-400' : 'text-amber-400'}`}>{playerCount}/4</span>
            </span>
          </div>

          {isHost && !isFull && (
            <button
              onClick={addBot}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition-all transform active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ Add AI Royal Bot ({4 - playerCount} slots left)</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Royal Court Seats Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {slots.map(({ index, player }) => {
          if (player) {
            const isMe = player.id === room.myPlayer?.id;
            return (
              <div
                key={player.id}
                className={`relative p-5 rounded-3xl flex flex-col items-center justify-between text-center transition-all ${
                  isMe
                    ? 'bg-gradient-to-b from-amber-950/40 to-slate-900/90 border-2 border-amber-400 shadow-xl shadow-amber-500/15'
                    : 'bg-slate-900/80 border border-amber-500/20 shadow-lg'
                }`}
              >
                {/* Host / Bot Badges */}
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-amber-300/60 uppercase">
                    Seat #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    {player.isHost && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
                        <Crown className="w-3 h-3 fill-amber-300" /> Host
                      </span>
                    )}
                    {player.isBot && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">
                        AI Bot
                      </span>
                    )}
                  </div>
                </div>

                {/* Avatar & Throne */}
                <div className="relative my-3">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-950 border border-amber-500/30 flex items-center justify-center text-4xl shadow-inner">
                    {player.avatar || '👑'}
                  </div>
                  {isMe && (
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-extrabold text-[9px] uppercase shadow-md">
                      YOU
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-cinzel text-base font-bold text-amber-100 truncate w-full">
                  {player.name}
                </h3>

                {/* Status indicator */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Court Ready</span>
                </div>

                {/* Host Remove Bot Button */}
                {isHost && player.isBot && (
                  <button
                    onClick={() => removeBot(player.id)}
                    className="mt-3 flex items-center gap-1 text-[11px] text-rose-400/80 hover:text-rose-300 transition-colors"
                  >
                    <UserMinus className="w-3 h-3" />
                    <span>Dismiss AI</span>
                  </button>
                )}
              </div>
            );
          }

          // Empty Seat
          return (
            <div
              key={`empty-${index}`}
              className="p-5 rounded-3xl bg-slate-950/40 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-center min-h-[220px] transition-all hover:border-amber-500/30"
            >
              <span className="text-[10px] font-bold text-slate-600 uppercase mb-3">
                Seat #{index + 1}
              </span>
              <div className="w-16 h-16 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-2xl text-slate-600 mb-3">
                🪑
              </div>
              <p className="text-xs font-semibold text-slate-400">Waiting for player...</p>
              <p className="text-[10px] text-slate-600 mt-1">Share code: <strong>{room.code}</strong></p>
            </div>
          );
        })}
      </div>

      {/* Rules & Scoring Summary Preview */}
      <div className="w-full royal-card rounded-2xl p-5 mb-8 text-xs text-slate-300 space-y-3">
        <h4 className="font-cinzel text-sm font-bold text-amber-300 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Active Room Settings
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <span className="text-amber-400 font-bold block mb-0.5">👑 {room.rolesConfig?.raja?.name || 'Raja'}</span>
            <span>+{room.scoringConfig?.raja || 1000} Pts</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <span className="text-blue-400 font-bold block mb-0.5">⚔️ {room.rolesConfig?.vajir?.name || 'Vajir'}</span>
            <span>+{room.scoringConfig?.vajirCorrect || 600} / 0 Pts</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <span className="text-rose-400 font-bold block mb-0.5">🕵️ {room.rolesConfig?.chor?.name || 'Chor'}</span>
            <span>+{room.scoringConfig?.chorEscaped || 300} / 0 Pts</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-0.5">🛡️ {room.rolesConfig?.sipahi?.name || 'Sipahi'}</span>
            <span>+{room.scoringConfig?.sipahiEscaped || 400} / 0 Pts</span>
          </div>
        </div>
      </div>

      {/* Start Game Action */}
      <div className="w-full max-w-md text-center">
        {isHost ? (
          <div className="space-y-2">
            <button
              onClick={startGame}
              disabled={!isFull}
              className={`w-full py-4 rounded-2xl font-bold text-base tracking-wider uppercase shadow-2xl transition-all transform ${
                isFull
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 shadow-amber-500/30 active:scale-95 animate-pulse'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {isFull ? '👑 Begin Tournament (Start Game)' : `Waiting for 4 Players (${playerCount}/4)`}
            </button>
            {!isFull && (
              <p className="text-xs text-amber-300/60">
                Tip: Click <strong>"+ Add AI Royal Bot"</strong> above to fill seats immediately!
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 text-center space-y-1">
            <p className="text-sm font-bold text-amber-200">Waiting for Host to start the match...</p>
            <p className="text-xs text-slate-400">Sit tight while all 4 players prepare their seats.</p>
          </div>
        )}
      </div>

    </div>
  );
}
