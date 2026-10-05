import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import {
  playButtonClick,
  playTrumpetFanfare,
  playSwordClash,
  playSuccessChime,
  playThiefSneak,
  playCardFlip,
  setMuted,
  getMuted
} from '../utils/audio';
import { fireVictoryConfetti, fireGoldShower } from '../utils/confetti';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('rc_player_name') || '');
  const [playerAvatar, setPlayerAvatar] = useState(() => localStorage.getItem('rc_player_avatar') || '👑');
  const [errorToast, setErrorToast] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(getMuted());
  const [activeReaction, setActiveReaction] = useState(null);

  const prevGameStateRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    // In dev mode with Vite proxy, or when VITE_SERVER_URL is provided (for Vercel/Netlify)
    const serverUrl = import.meta.env.VITE_SERVER_URL 
      || (window.location.port === '3000' ? `http://${window.location.hostname}:3001` : undefined);

    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('room_update', (updatedRoom) => {
      setRoom(updatedRoom);

      // Sound triggers on state changes
      if (prevGameStateRef.current !== updatedRoom?.state) {
        if (updatedRoom.state === 'ROLE_VIEW') {
          playCardFlip();
        } else if (updatedRoom.state === 'RAJA_REVEAL') {
          // suspense
        } else if (updatedRoom.state === 'VAJIR_REVEAL') {
          playTrumpetFanfare();
          fireGoldShower();
        } else if (updatedRoom.state === 'VAJIR_GUESS') {
          playSwordClash();
        } else if (updatedRoom.state === 'ROUND_RESULT') {
          if (updatedRoom.currentRound?.isGuessCorrect) {
            playSuccessChime();
            fireVictoryConfetti();
          } else {
            playThiefSneak();
          }
        } else if (updatedRoom.state === 'FINAL_STANDINGS') {
          playTrumpetFanfare();
          fireVictoryConfetti();
        }
        prevGameStateRef.current = updatedRoom?.state;
      }
    });

    newSocket.on('player_reaction', ({ playerId, playerName, emoji }) => {
      setActiveReaction({ playerId, playerName, emoji, id: Date.now() });
      setTimeout(() => {
        setActiveReaction(null);
      }, 3000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const triggerError = (msg) => {
    setErrorToast(msg);
    setTimeout(() => {
      setErrorToast(null);
    }, 4500);
  };

  const toggleAudio = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    setMuted(next);
  };

  const savePlayerInfo = (name, avatar) => {
    setPlayerName(name);
    if (avatar) setPlayerAvatar(avatar);
    localStorage.setItem('rc_player_name', name);
    if (avatar) localStorage.setItem('rc_player_avatar', avatar);
  };

  // Game Action emitters
  const createRoom = (name, avatar, settings) => {
    playButtonClick();
    if (!socket) return;
    savePlayerInfo(name, avatar);
    return new Promise((resolve) => {
      socket.emit('create_room', { playerName: name, settings }, (res) => {
        if (res.success) {
          setRoom(res.room);
          resolve(res);
        } else {
          triggerError(res.error || 'Failed to create room');
          resolve(res);
        }
      });
    });
  };

  const joinRoom = (roomCode, name, avatar) => {
    playButtonClick();
    if (!socket) return;
    savePlayerInfo(name, avatar);
    return new Promise((resolve) => {
      socket.emit('join_room', { roomCode, playerName: name }, (res) => {
        if (res.success) {
          setRoom(res.room);
          resolve(res);
        } else {
          triggerError(res.error || 'Failed to join room');
          resolve(res);
        }
      });
    });
  };

  const addBot = () => {
    playButtonClick();
    if (!socket || !room) return;
    socket.emit('add_bot', { roomCode: room.code }, (res) => {
      if (!res.success) triggerError(res.error);
    });
  };

  const removeBot = (botId) => {
    playButtonClick();
    if (!socket || !room) return;
    socket.emit('remove_bot', { roomCode: room.code, botId }, (res) => {
      if (!res.success) triggerError(res.error);
    });
  };

  const updateSettings = (settings) => {
    playButtonClick();
    if (!socket || !room) return;
    socket.emit('update_settings', { roomCode: room.code, settings }, (res) => {
      if (!res.success) triggerError(res.error);
    });
  };

  const startGame = () => {
    playButtonClick();
    if (!socket || !room) return;
    socket.emit('start_game', { roomCode: room.code }, (res) => {
      if (!res.success) triggerError(res.error);
    });
  };

  const acknowledgeRole = () => {
    playButtonClick();
    if (!socket || !room) return;
    socket.emit('acknowledge_role', { roomCode: room.code });
  };

  const revealRaja = () => {
    playTrumpetFanfare();
    fireGoldShower();
    if (!socket || !room) return;
    socket.emit('reveal_raja', { roomCode: room.code }, (res) => {
      if (!res.success) triggerError(res.error);
    });
  };

  const revealVajir = () => {
    playSwordClash();
    if (!socket || !room) return;
    socket.emit('reveal_vajir', { roomCode: room.code }, (res) => {
      if (!res.success) triggerError(res.error);
    });
  };

  const submitVajirGuess = (chorPlayerId, sipahiPlayerId) => {
    playButtonClick();
    if (!socket || !room) return;
    socket.emit('submit_vajir_guess', {
      roomCode: room.code,
      guess: { chorPlayerId, sipahiPlayerId }
    }, (res) => {
      if (!res.success) triggerError(res.error);
    });
  };

  const nextRound = () => {
    playButtonClick();
    if (!socket || !room) return;
    socket.emit('next_round', { roomCode: room.code }, (res) => {
      if (!res.success) triggerError(res.error);
    });
  };

  const endMatch = () => {
    playButtonClick();
    if (!socket || !room) return;
    socket.emit('end_match', { roomCode: room.code }, (res) => {
      if (!res.success) triggerError(res.error);
    });
  };

  const playAgain = () => {
    playButtonClick();
    if (!socket || !room) return;
    socket.emit('play_again', { roomCode: room.code }, (res) => {
      if (!res.success) triggerError(res.error);
    });
  };

  const leaveRoom = () => {
    playButtonClick();
    setRoom(null);
    window.location.reload();
  };

  const sendChat = (text) => {
    if (!socket || !room || !text.trim()) return;
    socket.emit('send_chat', { roomCode: room.code, text });
  };

  const sendReaction = (emoji) => {
    playButtonClick();
    if (!socket || !room) return;
    socket.emit('send_reaction', { roomCode: room.code, emoji });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        room,
        playerName,
        playerAvatar,
        isAudioMuted,
        errorToast,
        activeReaction,
        toggleAudio,
        savePlayerInfo,
        createRoom,
        joinRoom,
        addBot,
        removeBot,
        updateSettings,
        startGame,
        acknowledgeRole,
        revealRaja,
        revealVajir,
        submitVajirGuess,
        nextRound,
        endMatch,
        playAgain,
        leaveRoom,
        sendChat,
        sendReaction
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useGame() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useGame must be used within a SocketProvider');
  }
  return context;
}
