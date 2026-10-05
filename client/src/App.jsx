import React, { useState, useEffect } from 'react';
import { useGame } from './context/SocketContext';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { RoleViewScreen } from './components/RoleViewScreen';
import { RajaRevealScreen } from './components/RajaRevealScreen';
import { VajirRevealScreen } from './components/VajirRevealScreen';
import { VajirGuessScreen } from './components/VajirGuessScreen';
import { RoundResultScreen } from './components/RoundResultScreen';
import { FinalStandingsScreen } from './components/FinalStandingsScreen';
import { CreateGameModal } from './components/CreateGameModal';
import { JoinGameModal } from './components/JoinGameModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ChatDrawer } from './components/ChatDrawer';
import { AlertCircle, Crown } from 'lucide-react';

export function App() {
  const { room, errorToast } = useGame();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [initialJoinCode, setInitialJoinCode] = useState('');

  // Check URL params for invite link (?room=CODE)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setInitialJoinCode(roomParam.toUpperCase());
      setIsJoinOpen(true);
    }
  }, []);

  const renderActiveScreen = () => {
    if (!room) {
      return (
        <HomeScreen
          onOpenCreate={() => setIsCreateOpen(true)}
          onOpenJoin={() => setIsJoinOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      );
    }

    switch (room.state) {
      case 'LOBBY':
        return <LobbyScreen />;
      case 'ROLE_VIEW':
        return <RoleViewScreen />;
      case 'RAJA_REVEAL':
        return <RajaRevealScreen />;
      case 'VAJIR_REVEAL':
        return <VajirRevealScreen />;
      case 'VAJIR_GUESS':
        return <VajirGuessScreen />;
      case 'ROUND_RESULT':
        return <RoundResultScreen />;
      case 'FINAL_STANDINGS':
        return <FinalStandingsScreen />;
      default:
        return <LobbyScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Toast Notification */}
      {errorToast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-4 duration-200">
          <div className="px-4 py-3 rounded-2xl bg-rose-950/90 border border-rose-500/60 shadow-2xl text-rose-200 text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorToast}</span>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar onOpenRules={() => setIsRulesOpen(true)} />

      {/* Active Screen View */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {renderActiveScreen()}
      </main>

      {/* Live Chat and Reaction Drawer */}
      <ChatDrawer />

      {/* Footer */}
      <footer className="py-4 text-center border-t border-amber-500/10 text-[11px] text-amber-200/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>👑 Royal Crown — Raja Vajir Chor Sipahi</span>
          <span>Crafted with Real-Time Multiplayer Precision</span>
        </div>
      </footer>

      {/* Modals */}
      <CreateGameModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <JoinGameModal
        isOpen={isJoinOpen}
        initialCode={initialJoinCode}
        onClose={() => setIsJoinOpen(false)}
      />

      <HowToPlayModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

    </div>
  );
}

export default App;
