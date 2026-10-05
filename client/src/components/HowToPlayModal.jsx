import React from 'react';
import { X, Crown, Shield, Sword, EyeOff, Award, Sparkles } from 'lucide-react';

export function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-500/20 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-bold text-amber-200">How to Play Royal Crown</h2>
              <p className="text-xs text-amber-300/60">Classic Raja • Vajir • Chor • Sipahi Rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 border border-amber-500/30">
            <h3 className="font-cinzel text-amber-300 font-bold mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              The Sovereign Objective
            </h3>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              Exactly 4 players receive secret roles: <strong>Raja</strong>, <strong>Vajir</strong>, <strong>Chor</strong>, and <strong>Sipahi</strong>. 
              The Raja reveals first, the Vajir steps up, and the Vajir must deduce which of the other two players is the Chor and who is the Sipahi!
            </p>
          </div>

          {/* 4 Roles Breakdown */}
          <div>
            <h3 className="font-cinzel text-base font-bold text-amber-200 mb-3">The 4 Royal Roles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Raja */}
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-2xl">👑</span>
                  <div>
                    <h4 className="font-cinzel font-bold text-amber-300">Raja (The King)</h4>
                    <span className="text-[11px] text-amber-400/70 font-semibold">1000 Points Guaranteed</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  Reveals first with "I AM RAJA" and commands their Vajir to find the thief.
                </p>
              </div>

              {/* Vajir */}
              <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/30">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-2xl">⚔️</span>
                  <div>
                    <h4 className="font-cinzel font-bold text-blue-300">Vajir (The Advisor)</h4>
                    <span className="text-[11px] text-blue-400/70 font-semibold">+600 if Correct / 0 if Wrong</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  Answers the Raja's call, then deduces which suspect is Chor and which is Sipahi.
                </p>
              </div>

              {/* Chor */}
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-2xl">🕵️</span>
                  <div>
                    <h4 className="font-cinzel font-bold text-rose-300">Chor (The Thief)</h4>
                    <span className="text-[11px] text-rose-400/70 font-semibold">+300 if Vajir Fails / 0 if Caught</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  Must remain mysterious, bluff, and deceive the Vajir into guessing incorrectly!
                </p>
              </div>

              {/* Sipahi */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <h4 className="font-cinzel font-bold text-emerald-300">Sipahi (The Soldier)</h4>
                    <span className="text-[11px] text-emerald-400/70 font-semibold">+400 if Vajir Fails / 0 if Caught</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  The royal guard caught in the web of suspicion. Earns honor points if Vajir is deceived.
                </p>
              </div>

            </div>
          </div>

          {/* Step-by-Step Flow */}
          <div>
            <h3 className="font-cinzel text-base font-bold text-amber-200 mb-3">Round Progression</h3>
            <ol className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">1</span>
                <span><strong>Secret Assignment:</strong> 4 chits/cards are dealt randomly. You privately inspect your role.</span>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">2</span>
                <span><strong>Raja Proclamation:</strong> Raja clicks "I AM RAJA" and demands "Who is my Vajir?".</span>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">3</span>
                <span><strong>Vajir Reveal:</strong> The Vajir steps forward to accept the mission.</span>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">4</span>
                <span><strong>The Guess:</strong> Vajir assigns the remaining two players to Chor and Sipahi.</span>
              </li>
              <li className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">5</span>
                <span><strong>Royal Reveal & Points:</strong> The true identities are uncovered, points are tallied, and the scoreboard updates!</span>
              </li>
            </ol>
          </div>

          {/* Scoring Matrix */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20">
            <h3 className="font-cinzel text-amber-200 font-bold mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Standard Scoring Matrix
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <span className="font-bold text-emerald-400 block mb-1">If Vajir Guesses Correctly:</span>
                <p>👑 Raja: <strong>+1000</strong></p>
                <p>⚔️ Vajir: <strong>+600</strong></p>
                <p>🕵️ Chor: <strong>0</strong></p>
                <p>🛡️ Sipahi: <strong>0</strong></p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
                <span className="font-bold text-rose-400 block mb-1">If Vajir Guesses Incorrectly:</span>
                <p>👑 Raja: <strong>+1000</strong></p>
                <p>⚔️ Vajir: <strong>0</strong></p>
                <p>🕵️ Chor: <strong>+300</strong></p>
                <p>🛡️ Sipahi: <strong>+400</strong></p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 italic text-center">
              *Host can configure custom point amounts and custom role names before starting!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-amber-500/20 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
          >
            Got It, Let's Play!
          </button>
        </div>

      </div>
    </div>
  );
}
