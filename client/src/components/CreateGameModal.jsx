import React, { useState } from 'react';
import { useGame } from '../context/SocketContext';
import { Crown, Settings2, Sliders, X, Sparkles, RotateCcw } from 'lucide-react';

const AVATARS = ['👑', '🦁', '🦅', '🐅', '🐘', '🐺', '🦊', '🐉', '🦄', '⚔️'];

export function CreateGameModal({ isOpen, onClose }) {
  const { createRoom, playerName, playerAvatar } = useGame();
  
  const [name, setName] = useState(playerName || '');
  const [avatar, setAvatar] = useState(playerAvatar || '👑');
  const [maxRounds, setMaxRounds] = useState(5);
  const [isCustomRoles, setIsCustomRoles] = useState(false);
  const [isCustomScoring, setIsCustomScoring] = useState(false);
  const [loading, setLoading] = useState(false);

  // Custom Roles State
  const [roles, setRoles] = useState({
    raja: { name: 'Raja' },
    vajir: { name: 'Vajir' },
    chor: { name: 'Chor' },
    sipahi: { name: 'Sipahi' }
  });

  // Custom Scoring State
  const [scoring, setScoring] = useState({
    raja: 1000,
    vajirCorrect: 600,
    vajirWrong: 0,
    chorCaught: 0,
    chorEscaped: 300,
    sipahiCaught: 0,
    sipahiEscaped: 400
  });

  if (!isOpen) return null;

  const handleResetDefaults = () => {
    setRoles({
      raja: { name: 'Raja' },
      vajir: { name: 'Vajir' },
      chor: { name: 'Chor' },
      sipahi: { name: 'Sipahi' }
    });
    setScoring({
      raja: 1000,
      vajirCorrect: 600,
      vajirWrong: 0,
      chorCaught: 0,
      chorEscaped: 300,
      sipahiCaught: 0,
      sipahiEscaped: 400
    });
    setIsCustomRoles(false);
    setIsCustomScoring(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const customSettings = {
      maxRounds: parseInt(maxRounds) || 5,
      isCustomRoles,
      roles: isCustomRoles ? roles : undefined,
      scoring: isCustomScoring ? scoring : undefined
    };

    const res = await createRoom(name, avatar, customSettings);
    setLoading(false);
    if (res?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-500/20 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-500/20 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-bold text-amber-200">Create Royal Court</h2>
              <p className="text-xs text-amber-300/60">Set rules, scoring, and host your room</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          
          {/* Player Name & Avatar */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
              Host Name & Royal Crest
            </label>
            <div className="flex gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
                  {avatar}
                </div>
              </div>
              <input
                type="text"
                required
                placeholder="Enter your name (e.g. Maharajah)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-amber-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors text-sm font-medium"
              />
            </div>

            {/* Avatar Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                    avatar === av
                      ? 'bg-amber-500/30 border-2 border-amber-400 scale-110 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/60 border border-slate-700 hover:bg-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Match Length / Rounds */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
              Tournament Length (Rounds)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 7, 10].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setMaxRounds(r)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    maxRounds === r
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {r} Rounds
                </button>
              ))}
            </div>
          </div>

          {/* Custom Roles Accordion */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="font-cinzel text-xs font-bold text-amber-200">Custom Role Names</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCustomRoles}
                  onChange={(e) => setIsCustomRoles(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {isCustomRoles && (
              <div className="grid grid-cols-2 gap-2.5 pt-2 animate-in fade-in">
                <div>
                  <label className="text-[11px] text-amber-300/80 font-semibold block mb-1">👑 Raja Slot</label>
                  <input
                    type="text"
                    value={roles.raja.name}
                    onChange={(e) => setRoles({ ...roles, raja: { name: e.target.value } })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-100"
                    placeholder="e.g. King / Emperor"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-blue-300/80 font-semibold block mb-1">⚔️ Vajir Slot</label>
                  <input
                    type="text"
                    value={roles.vajir.name}
                    onChange={(e) => setRoles({ ...roles, vajir: { name: e.target.value } })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-blue-100"
                    placeholder="e.g. Mantri / Detective"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-rose-300/80 font-semibold block mb-1">🕵️ Chor Slot</label>
                  <input
                    type="text"
                    value={roles.chor.name}
                    onChange={(e) => setRoles({ ...roles, chor: { name: e.target.value } })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-rose-100"
                    placeholder="e.g. Thief / Infiltrator"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-emerald-300/80 font-semibold block mb-1">🛡️ Sipahi Slot</label>
                  <input
                    type="text"
                    value={roles.sipahi.name}
                    onChange={(e) => setRoles({ ...roles, sipahi: { name: e.target.value } })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-100"
                    placeholder="e.g. Senapati / Soldier"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Custom Scoring Accordion */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-amber-400" />
                <span className="font-cinzel text-xs font-bold text-amber-200">Custom Scoring Rules</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCustomScoring}
                  onChange={(e) => setIsCustomScoring(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {isCustomScoring && (
              <div className="grid grid-cols-2 gap-2.5 pt-2 animate-in fade-in text-xs">
                <div>
                  <label className="text-[10px] text-amber-400 font-semibold block mb-1">Raja Points</label>
                  <input
                    type="number"
                    value={scoring.raja}
                    onChange={(e) => setScoring({ ...scoring, raja: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-blue-400 font-semibold block mb-1">Vajir Correct</label>
                  <input
                    type="number"
                    value={scoring.vajirCorrect}
                    onChange={(e) => setScoring({ ...scoring, vajirCorrect: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-blue-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-rose-400 font-semibold block mb-1">Chor Escapes</label>
                  <input
                    type="number"
                    value={scoring.chorEscaped}
                    onChange={(e) => setScoring({ ...scoring, chorEscaped: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-rose-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-emerald-400 font-semibold block mb-1">Sipahi Escapes</label>
                  <input
                    type="number"
                    value={scoring.sipahiEscaped}
                    onChange={(e) => setScoring({ ...scoring, sipahiEscaped: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reset Defaults button */}
          {(isCustomRoles || isCustomScoring) && (
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 text-xs text-amber-400/80 hover:text-amber-300 transition-colors mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Roles & Scoring to Defaults
            </button>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-xl shadow-amber-500/20 transition-all transform active:scale-98 disabled:opacity-50"
            >
              {loading ? 'Creating Court...' : '👑 Create Game Room'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
