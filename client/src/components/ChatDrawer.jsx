import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/SocketContext';
import { MessageSquare, Send, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

const REACTIONS = ['👑', '⚔️', '🕵️', '🛡️', '😂', '🤫', '🔥', '🏆', '👀'];

export function ChatDrawer() {
  const { room, sendChat, sendReaction, activeReaction } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const messages = room?.messages || [];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!room) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendChat(text);
    setText('');
  };

  return (
    <>
      {/* Floating Reaction Overlay Animation */}
      {activeReaction && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
          <div className="px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/40 shadow-2xl flex items-center gap-2 backdrop-blur-md">
            <span className="text-3xl">{activeReaction.emoji}</span>
            <span className="text-xs font-bold text-amber-300">{activeReaction.playerName}</span>
          </div>
        </div>
      )}

      {/* Chat Trigger and Container */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
        {/* Chat Window */}
        {isOpen && (
          <div className="w-80 sm:w-96 h-96 mb-3 rounded-2xl bg-slate-950/95 border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-900 border-b border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span className="font-cinzel text-xs font-bold text-amber-200">Royal Court Chat</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 italic text-[11px]">
                  Court is in session. Speak your mind!
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2 rounded-xl text-xs leading-relaxed ${
                      m.isSystem
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium'
                        : m.senderId === room.myPlayer?.id
                        ? 'bg-indigo-600/30 border border-indigo-500/30 text-indigo-100 ml-6'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 mr-6'
                    }`}
                  >
                    {!m.isSystem && (
                      <div className="flex items-center gap-1.5 mb-1 font-semibold text-[10px] text-amber-400/80">
                        <span>{m.avatar || '👤'}</span>
                        <span>{m.senderName}</span>
                      </div>
                    )}
                    <p className="break-words">{m.text}</p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reactions Bar */}
            <div className="px-3 py-1.5 bg-slate-900/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  className="p-1 hover:scale-125 transition-transform text-base"
                  title="Send Reaction"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-2.5 bg-slate-900 border-t border-amber-500/20 flex gap-2">
              <input
                type="text"
                placeholder="Whisper to court..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={150}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="submit"
                disabled={!text.trim()}
                className="p-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Toggle Button & Reaction Bar */}
        <div className="flex items-center gap-2">
          {/* Mini Reaction buttons when chat is collapsed */}
          {!isOpen && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 border border-amber-500/30 px-2 py-1 rounded-full shadow-lg backdrop-blur-md">
              {REACTIONS.slice(0, 5).map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  className="hover:scale-125 transition-transform text-sm p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-500 transition-all transform active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Court Chat</span>
            {messages.length > 0 && !isOpen && (
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
