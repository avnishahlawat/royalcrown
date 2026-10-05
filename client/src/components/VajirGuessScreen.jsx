import React, { useState } from 'react';
import { useGame } from '../context/SocketContext';
import { Sword, Crown, Shield, EyeOff, Check, ArrowRight, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import { playButtonClick } from '../utils/audio';

export function VajirGuessScreen() {
  const { room, submitVajirGuess } = useGame();

  const [selectedChorId, setSelectedChorId] = useState('');
  const [selectedSipahiId, setSelectedSipahiId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!room) return null;

  const isVajir = room.myPlayer?.role === 'vajir';
  const rajaPlayer = room.players.find(p => p.visibleRole === 'raja');
  const vajirPlayer = room.players.find(p => p.visibleRole === 'vajir');
  
  // The two suspects are the players who are neither Raja nor Vajir
  const suspects = room.players.filter(p => p.id !== rajaPlayer?.id && p.id !== vajirPlayer?.id);

  const rajaRoleName = room.rolesConfig?.raja?.name || 'Raja';
  const vajirRoleName = room.rolesConfig?.vajir?.name || 'Vajir';
  const chorRoleName = room.rolesConfig?.chor?.name || 'Chor';
  const sipahiRoleName = room.rolesConfig?.sipahi?.name || 'Sipahi';

  const selectedChorPlayer = suspects.find(p => p.id === selectedChorId);
  const selectedSipahiPlayer = suspects.find(p => p.id === selectedSipahiId);

  const isValidGuess = selectedChorId && selectedSipahiId && selectedChorId !== selectedSipahiId;

  const handleSelectChor = (id) => {
    playButtonClick();
    setSelectedChorId(id);
    // Auto-assign the other suspect to Sipahi for snappy UX
    const other = suspects.find(s => s.id !== id);
    if (other) {
      setSelectedSipahiId(other.id);
    }
  };

  const handleSelectSipahi = (id) => {
    playButtonClick();
    setSelectedSipahiId(id);
    // Auto-assign the other suspect to Chor
    const other = suspects.find(s => s.id !== id);
    if (other) {
      setSelectedChorId(other.id);
    }
  };

  const handleSwap = () => {
    playButtonClick();
    const temp = selectedChorId;
    setSelectedChorId(selectedSipahiId);
    setSelectedSipahiId(temp);
  };

  const handleSubmitFinal = () => {
    if (!isValidGuess) return;
    submitVajirGuess(selectedChorId, selectedSipahiId);
    setShowConfirmModal(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      
      {/* Header Phase indicator */}
      <div className="text-center space-y-2 mb-6">
        <span className="px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
          Round {room.roundNumber} • Deduction Phase
        </span>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-amber-100">
          "Who is {chorRoleName} & Who is {sipahiRoleName}?"
        </h2>
      </div>

      {/* Royal Proclamation Banner */}
      <div className="w-full max-w-2xl p-5 mb-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl flex items-center gap-4">
        <div className="flex -space-x-3 flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl shadow-md">
            👑
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400 flex items-center justify-center text-2xl shadow-md">
            ⚔️
          </div>
        </div>
        <div className="text-xs text-slate-300 leading-relaxed">
          <p className="font-semibold text-amber-300">
            👑 {rajaRoleName} ({rajaPlayer?.name}) & ⚔️ {vajirRoleName} ({vajirPlayer?.name}) are known!
          </p>
          <p className="text-slate-400 mt-0.5">
            The {vajirRoleName} must now inspect the 2 suspects and declare who is the sneaky {chorRoleName} and who is the loyal {sipahiRoleName}.
          </p>
        </div>
      </div>

      {/* Vajir Interactive Decision Board */}
      {isVajir ? (
        <div className="w-full max-w-2xl space-y-6">
          
          {/* Instructions banner */}
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 text-center text-xs text-blue-200">
            <span className="font-bold text-blue-300 block mb-1">⚔️ Your Royal Duty as {vajirRoleName}:</span>
            Assign one suspect as <strong>🕵️ {chorRoleName}</strong> and the other as <strong>🛡️ {sipahiRoleName}</strong>.
          </div>

          {/* Suspects Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suspects.map((suspect) => {
              const isAssignedChor = selectedChorId === suspect.id;
              const isAssignedSipahi = selectedSipahiId === suspect.id;

              return (
                <div
                  key={suspect.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col items-center text-center ${
                    isAssignedChor
                      ? 'bg-rose-950/40 border-2 border-rose-500 shadow-xl shadow-rose-500/10'
                      : isAssignedSipahi
                      ? 'bg-emerald-950/40 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10'
                      : 'bg-slate-900/80 border-slate-700'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl mb-3 shadow-inner">
                    {suspect.avatar || '👤'}
                  </div>

                  <h3 className="font-cinzel text-lg font-bold text-slate-100 truncate w-full mb-1">
                    {suspect.name}
                  </h3>
                  
                  <span className="text-[11px] text-slate-400 mb-4 block">
                    Royal Suspect
                  </span>

                  {/* Assignment Status Badge */}
                  <div className="w-full mb-4">
                    {isAssignedChor && (
                      <span className="w-full py-1.5 px-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold block">
                        🕵️ Assigned as {chorRoleName}
                      </span>
                    )}
                    {isAssignedSipahi && (
                      <span className="w-full py-1.5 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold block">
                        🛡️ Assigned as {sipahiRoleName}
                      </span>
                    )}
                    {!isAssignedChor && !isAssignedSipahi && (
                      <span className="w-full py-1.5 px-3 rounded-xl bg-slate-800/80 text-slate-400 text-xs font-medium block">
                        Not Assigned
                      </span>
                    )}
                  </div>

                  {/* Quick Assignment Toggle Buttons */}
                  <div className="w-full grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectChor(suspect.id)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        isAssignedChor
                          ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                          : 'bg-slate-950/80 text-rose-300 border-rose-500/30 hover:bg-rose-950/40'
                      }`}
                    >
                      🕵️ Mark {chorRoleName}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectSipahi(suspect.id)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        isAssignedSipahi
                          ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                          : 'bg-slate-950/80 text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/40'
                      }`}
                    >
                      🛡️ Mark {sipahiRoleName}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Swap and Submit Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!isValidGuess}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold disabled:opacity-40 transition-colors"
            >
              🔄 Swap Suspect Roles
            </button>

            <button
              type="button"
              disabled={!isValidGuess}
              onClick={() => setShowConfirmModal(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Confirm Deduction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Other players waiting for Vajir to guess */
        <div className="w-full max-w-lg royal-card rounded-3xl p-8 text-center space-y-6 border border-amber-500/30">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-950/80 border border-slate-700 flex items-center justify-center text-3xl text-amber-400">
            <Sword className="w-10 h-10 animate-bounce text-blue-400" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-cinzel text-2xl font-bold text-amber-200">
              {vajirPlayer?.name} is Deliberating...
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              The {vajirRoleName} is interrogating the suspects and determining who is the cunning {chorRoleName} and who is the {sipahiRoleName}.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/60 border border-slate-800 text-xs text-amber-300/80">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Court awaits the verdict</span>
          </div>

          {/* Suspects in the spotlight */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {suspects.map((s) => (
              <div key={s.id} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-2xl mb-1">{s.avatar || '👤'}</div>
                <div className="font-cinzel text-xs font-bold text-slate-200 truncate">{s.name}</div>
                <span className="text-[10px] text-amber-400/70 font-semibold">Under Suspicion</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl p-6 text-center space-y-6">
            
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-3xl">
              ⚖️
            </div>

            <div className="space-y-2">
              <h3 className="font-cinzel text-2xl font-bold text-amber-100">
                Confirm Your Royal Decree
              </h3>
              <p className="text-xs text-slate-300">
                You have designated the following suspects:
              </p>
            </div>

            {/* Selections box */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-left text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-rose-950/30 border border-rose-500/30">
                <span className="font-bold text-rose-300">🕵️ {chorRoleName}:</span>
                <span className="font-bold text-white text-sm">{selectedChorPlayer?.name}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <span className="font-bold text-emerald-300">🛡️ {sipahiRoleName}:</span>
                <span className="font-bold text-white text-sm">{selectedSipahiPlayer?.name}</span>
              </div>
            </div>

            <p className="text-xs text-amber-300/80 italic">
              Are you confident in your deduction? Once submitted, all parchment roles will be revealed!
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleSubmitFinal}
                className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all transform active:scale-95"
              >
                Yes, Reveal Roles!
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
