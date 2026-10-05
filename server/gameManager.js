import { DEFAULT_ROLES, DEFAULT_SCORING, GAME_STATES, generateRoomCode, shuffleArray } from './gameLogic.js';

export class GameManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomCode -> Room
  }

  createRoom(hostSocketId, hostName, customSettings = {}) {
    let roomCode = generateRoomCode();
    while (this.rooms.has(roomCode)) {
      roomCode = generateRoomCode();
    }

    const rolesConfig = {
      raja: { ...DEFAULT_ROLES.raja, name: customSettings.roles?.raja?.name || DEFAULT_ROLES.raja.name },
      vajir: { ...DEFAULT_ROLES.vajir, name: customSettings.roles?.vajir?.name || DEFAULT_ROLES.vajir.name },
      chor: { ...DEFAULT_ROLES.chor, name: customSettings.roles?.chor?.name || DEFAULT_ROLES.chor.name },
      sipahi: { ...DEFAULT_ROLES.sipahi, name: customSettings.roles?.sipahi?.name || DEFAULT_ROLES.sipahi.name }
    };

    const scoringConfig = {
      ...DEFAULT_SCORING,
      ...(customSettings.scoring || {})
    };

    const room = {
      code: roomCode,
      hostId: hostSocketId,
      state: GAME_STATES.LOBBY,
      roundNumber: 0,
      maxRounds: customSettings.maxRounds || 5,
      rolesConfig,
      scoringConfig,
      isCustomRoles: !!customSettings.isCustomRoles,
      players: [
        {
          id: hostSocketId,
          name: hostName.trim() || 'Host King',
          avatar: '👑',
          isHost: true,
          isBot: false,
          isReady: true,
          totalScore: 0,
          role: null, // private role
          readyForNextRound: false,
          stats: {
            timesRaja: 0,
            timesVajir: 0,
            timesChor: 0,
            timesSipahi: 0,
            correctGuesses: 0,
            escapesAsChor: 0
          }
        }
      ],
      currentRound: null,
      history: [],
      messages: [],
      createdAt: Date.now()
    };

    this.rooms.set(roomCode, room);
    return room;
  }

  getRoom(roomCode) {
    if (!roomCode) return null;
    return this.rooms.get(roomCode.toUpperCase());
  }

  joinRoom(roomCode, socketId, playerName) {
    const room = this.getRoom(roomCode);
    if (!room) {
      return { success: false, error: 'Room not found. Please verify the 5-character code.' };
    }

    if (room.state !== GAME_STATES.LOBBY) {
      // Check if reconnecting existing player
      const existing = room.players.find(p => p.name.toLowerCase() === playerName.trim().toLowerCase());
      if (existing) {
        existing.id = socketId;
        return { success: true, room };
      }
      return { success: false, error: 'Game has already started in this room.' };
    }

    if (room.players.length >= 4) {
      return { success: false, error: 'Room is already full (4/4 players).' };
    }

    // Assign fun avatar
    const avatars = ['🦁', '🦅', '🐅', '🐘', '🐺', '🦊', '🐉', '🦄'];
    const usedAvatars = room.players.map(p => p.avatar);
    const availableAvatars = avatars.filter(a => !usedAvatars.includes(a));
    const avatar = availableAvatars[0] || '⚔️';

    const newPlayer = {
      id: socketId,
      name: playerName.trim() || `Player ${room.players.length + 1}`,
      avatar,
      isHost: false,
      isBot: false,
      isReady: true,
      totalScore: 0,
      role: null,
      readyForNextRound: false,
      stats: {
        timesRaja: 0,
        timesVajir: 0,
        timesChor: 0,
        timesSipahi: 0,
        correctGuesses: 0,
        escapesAsChor: 0
      }
    };

    room.players.push(newPlayer);
    this.addSystemMessage(room, `🛡️ ${newPlayer.name} has joined the royal court!`);
    return { success: true, room };
  }

  addBot(roomCode, hostSocketId) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.hostId !== hostSocketId) return { success: false, error: 'Only the host can add AI players.' };
    if (room.players.length >= 4) return { success: false, error: 'Room is already full.' };
    if (room.state !== GAME_STATES.LOBBY) return { success: false, error: 'Cannot add bot during active game.' };

    const botNames = ['Birbal (AI)', 'Tenali Rama (AI)', 'Chanakya (AI)', 'Vikramaditya (AI)', 'Aryabhata (AI)'];
    const botAvatars = ['🤖', '🧠', '📜', '🏛️', '🎭'];
    const usedNames = room.players.map(p => p.name);
    const availableName = botNames.find(n => !usedNames.includes(n)) || `Royal AI ${room.players.length + 1}`;
    const botAvatar = botAvatars[room.players.length % botAvatars.length];

    const botPlayer = {
      id: `bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: availableName,
      avatar: botAvatar,
      isHost: false,
      isBot: true,
      isReady: true,
      totalScore: 0,
      role: null,
      readyForNextRound: true,
      stats: {
        timesRaja: 0,
        timesVajir: 0,
        timesChor: 0,
        timesSipahi: 0,
        correctGuesses: 0,
        escapesAsChor: 0
      }
    };

    room.players.push(botPlayer);
    this.addSystemMessage(room, `📜 Royal Advisor ${botPlayer.name} has entered the room.`);
    return { success: true, room };
  }

  removeBot(roomCode, hostSocketId, botId) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.hostId !== hostSocketId) return { success: false, error: 'Only the host can remove AI players.' };
    if (room.state !== GAME_STATES.LOBBY) return { success: false, error: 'Cannot remove bot during active game.' };

    const idx = room.players.findIndex(p => p.id === botId && p.isBot);
    if (idx !== -1) {
      const removed = room.players.splice(idx, 1)[0];
      this.addSystemMessage(room, `📜 ${removed.name} left the room.`);
      return { success: true, room };
    }
    return { success: false, error: 'Bot not found.' };
  }

  updateSettings(roomCode, hostSocketId, settings) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.hostId !== hostSocketId) return { success: false, error: 'Only the host can adjust settings.' };
    if (room.state !== GAME_STATES.LOBBY) return { success: false, error: 'Cannot change settings mid-game.' };

    if (settings.roles) {
      room.rolesConfig = {
        raja: { ...room.rolesConfig.raja, ...settings.roles.raja },
        vajir: { ...room.rolesConfig.vajir, ...settings.roles.vajir },
        chor: { ...room.rolesConfig.chor, ...settings.roles.chor },
        sipahi: { ...room.rolesConfig.sipahi, ...settings.roles.sipahi }
      };
      room.isCustomRoles = true;
    }

    if (settings.scoring) {
      room.scoringConfig = {
        ...room.scoringConfig,
        ...settings.scoring
      };
    }

    if (settings.maxRounds) {
      room.maxRounds = Math.max(1, Math.min(20, parseInt(settings.maxRounds) || 5));
    }

    this.addSystemMessage(room, '⚙️ Host updated royal game settings.');
    return { success: true, room };
  }

  startGame(roomCode, hostSocketId) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found.' };
    if (room.hostId !== hostSocketId) return { success: false, error: 'Only host can start the game.' };
    if (room.players.length !== 4) return { success: false, error: 'Exactly 4 players required to start Royal Crown.' };

    // Reset total scores if starting fresh
    room.roundNumber = 0;
    room.history = [];
    room.players.forEach(p => {
      p.totalScore = 0;
      p.stats = {
        timesRaja: 0,
        timesVajir: 0,
        timesChor: 0,
        timesSipahi: 0,
        correctGuesses: 0,
        escapesAsChor: 0
      };
    });

    return this.startRound(roomCode);
  }

  startRound(roomCode) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };

    room.roundNumber += 1;
    room.state = GAME_STATES.ROLE_VIEW;

    // Reset ready states
    room.players.forEach(p => {
      p.readyForNextRound = false;
    });

    // Randomly assign 4 roles: Raja, Vajir, Chor, Sipahi
    const roleKeys = ['raja', 'vajir', 'chor', 'sipahi'];
    const shuffledRoles = shuffleArray(roleKeys);

    room.players.forEach((player, idx) => {
      player.role = shuffledRoles[idx];
      // Update stats
      if (player.role === 'raja') player.stats.timesRaja++;
      if (player.role === 'vajir') player.stats.timesVajir++;
      if (player.role === 'chor') player.stats.timesChor++;
      if (player.role === 'sipahi') player.stats.timesSipahi++;
    });

    const rajaPlayer = room.players.find(p => p.role === 'raja');
    const vajirPlayer = room.players.find(p => p.role === 'vajir');
    const chorPlayer = room.players.find(p => p.role === 'chor');
    const sipahiPlayer = room.players.find(p => p.role === 'sipahi');

    room.currentRound = {
      roundNumber: room.roundNumber,
      rajaRevealed: false,
      vajirRevealed: false,
      guess: null,
      isGuessCorrect: null,
      scoresAwarded: {},
      actualRoles: {
        raja: rajaPlayer.id,
        vajir: vajirPlayer.id,
        chor: chorPlayer.id,
        sipahi: sipahiPlayer.id
      },
      startedAt: Date.now()
    };

    this.addSystemMessage(room, `👑 Round ${room.roundNumber} has begun! Secret royal parchis have been distributed.`);
    this.broadcastRoom(room);

    // If bot has role actions, schedule AI simulation
    this.handleBotTurn(room);

    return { success: true, room };
  }

  advanceToRajaReveal(roomCode) {
    const room = this.getRoom(roomCode);
    if (!room) return;
    if (room.state === GAME_STATES.ROLE_VIEW) {
      room.state = GAME_STATES.RAJA_REVEAL;
      this.broadcastRoom(room);
      this.handleBotTurn(room);
    }
  }

  revealRaja(roomCode, socketId) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.state !== GAME_STATES.RAJA_REVEAL && room.state !== GAME_STATES.ROLE_VIEW) {
      return { success: false, error: 'Not the Raja reveal phase.' };
    }

    const player = room.players.find(p => p.id === socketId);
    if (!player || player.role !== 'raja') {
      return { success: false, error: 'Only the designated Raja can reveal themselves!' };
    }

    room.currentRound.rajaRevealed = true;
    room.state = GAME_STATES.VAJIR_REVEAL;

    this.addSystemMessage(room, `👑 ${player.name} proclaims: "I AM THE RAJA! Who is my Vajir?"`);
    this.broadcastRoom(room);

    this.handleBotTurn(room);
    return { success: true, room };
  }

  revealVajir(roomCode, socketId) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.state !== GAME_STATES.VAJIR_REVEAL) {
      return { success: false, error: 'Not the Vajir reveal phase.' };
    }

    const player = room.players.find(p => p.id === socketId);
    if (!player || player.role !== 'vajir') {
      return { success: false, error: 'Only the designated Vajir can reveal themselves!' };
    }

    room.currentRound.vajirRevealed = true;
    room.state = GAME_STATES.VAJIR_GUESS;

    const rajaPlayer = room.players.find(p => p.role === 'raja');
    this.addSystemMessage(room, `⚔️ ${player.name} steps forward: "Huzoor, I am your loyal Vajir!"`);
    this.addSystemMessage(room, `👑 Raja (${rajaPlayer?.name}): "Identify who is the Chor and who is the Sipahi!"`);
    this.broadcastRoom(room);

    this.handleBotTurn(room);
    return { success: true, room };
  }

  submitVajirGuess(roomCode, socketId, guess) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.state !== GAME_STATES.VAJIR_GUESS) {
      return { success: false, error: 'Not the Vajir guess phase.' };
    }

    const vajirPlayer = room.players.find(p => p.id === socketId);
    if (!vajirPlayer || vajirPlayer.role !== 'vajir') {
      return { success: false, error: 'Only the Vajir can submit the deduction.' };
    }

    const { chorPlayerId, sipahiPlayerId } = guess || {};
    if (!chorPlayerId || !sipahiPlayerId) {
      return { success: false, error: 'You must select both the Chor and the Sipahi.' };
    }

    if (chorPlayerId === sipahiPlayerId) {
      return { success: false, error: 'The same player cannot be both Chor and Sipahi.' };
    }

    // Check that guessed players are the other 2 players (not Raja and not Vajir)
    const rajaPlayer = room.players.find(p => p.role === 'raja');
    if (chorPlayerId === rajaPlayer.id || chorPlayerId === vajirPlayer.id ||
        sipahiPlayerId === rajaPlayer.id || sipahiPlayerId === vajirPlayer.id) {
      return { success: false, error: 'Invalid suspects selected.' };
    }

    const chorPlayer = room.players.find(p => p.id === chorPlayerId);
    const sipahiPlayer = room.players.find(p => p.id === sipahiPlayerId);
    if (!chorPlayer || !sipahiPlayer) {
      return { success: false, error: 'Invalid suspects.' };
    }

    // Determine correctness
    const actualChor = room.players.find(p => p.role === 'chor');
    const actualSipahi = room.players.find(p => p.role === 'sipahi');

    const isCorrect = (chorPlayerId === actualChor.id && sipahiPlayerId === actualSipahi.id);

    // Calculate Points
    const scores = {};
    const rajaPoints = room.scoringConfig.raja;
    const vajirPoints = isCorrect ? room.scoringConfig.vajirCorrect : room.scoringConfig.vajirWrong;
    const chorPoints = isCorrect ? room.scoringConfig.chorCaught : room.scoringConfig.chorEscaped;
    const sipahiPoints = isCorrect ? room.scoringConfig.sipahiCaught : room.scoringConfig.sipahiEscaped;

    scores[rajaPlayer.id] = rajaPoints;
    scores[vajirPlayer.id] = vajirPoints;
    scores[actualChor.id] = chorPoints;
    scores[actualSipahi.id] = sipahiPoints;

    // Apply cumulative scores & stats
    room.players.forEach(p => {
      p.totalScore += (scores[p.id] || 0);
    });

    if (isCorrect) {
      vajirPlayer.stats.correctGuesses++;
    } else {
      actualChor.stats.escapesAsChor++;
    }

    room.currentRound.guess = {
      chorPlayerId,
      chorPlayerName: chorPlayer.name,
      sipahiPlayerId,
      sipahiPlayerName: sipahiPlayer.name
    };
    room.currentRound.isGuessCorrect = isCorrect;
    room.currentRound.scoresAwarded = scores;

    // Save to history
    room.history.push({
      roundNumber: room.roundNumber,
      roles: {
        raja: { id: rajaPlayer.id, name: rajaPlayer.name },
        vajir: { id: vajirPlayer.id, name: vajirPlayer.name },
        chor: { id: actualChor.id, name: actualChor.name },
        sipahi: { id: actualSipahi.id, name: actualSipahi.name }
      },
      guess: room.currentRound.guess,
      isCorrect,
      scoresAwarded: { ...scores },
      cumulativeScores: room.players.reduce((acc, p) => ({ ...acc, [p.id]: p.totalScore }), {})
    });

    room.state = GAME_STATES.ROUND_RESULT;

    const resultMsg = isCorrect
      ? `🎉 BRILLIANT DEDUCTION! Vajir ${vajirPlayer.name} correctly identified ${actualChor.name} as Chor and ${actualSipahi.name} as Sipahi!`
      : `🕵️ FOOLED! Vajir ${vajirPlayer.name} guessed wrong! The sneaky Chor (${actualChor.name}) escapes with the bounty!`;
    
    this.addSystemMessage(room, resultMsg);
    this.broadcastRoom(room);

    return { success: true, room };
  }

  nextRoundOrEnd(roomCode, hostSocketId) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.hostId !== hostSocketId) return { success: false, error: 'Only the host can proceed.' };

    if (room.roundNumber >= room.maxRounds) {
      room.state = GAME_STATES.FINAL_STANDINGS;
      this.addSystemMessage(room, '🏆 The match has concluded! Behold the Royal Crown final standings!');
      this.broadcastRoom(room);
      return { success: true, room };
    }

    return this.startRound(roomCode);
  }

  endMatch(roomCode, hostSocketId) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.hostId !== hostSocketId) return { success: false, error: 'Only the host can end the match.' };

    room.state = GAME_STATES.FINAL_STANDINGS;
    this.addSystemMessage(room, '🏆 Match ended by Host. Viewing Final Standings!');
    this.broadcastRoom(room);
    return { success: true, room };
  }

  playAgain(roomCode, hostSocketId) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.hostId !== hostSocketId) return { success: false, error: 'Only host can restart game.' };

    room.state = GAME_STATES.LOBBY;
    room.roundNumber = 0;
    room.currentRound = null;
    room.history = [];
    room.players.forEach(p => {
      p.totalScore = 0;
      p.role = null;
      p.readyForNextRound = false;
      p.stats = {
        timesRaja: 0,
        timesVajir: 0,
        timesChor: 0,
        timesSipahi: 0,
        correctGuesses: 0,
        escapesAsChor: 0
      };
    });

    this.addSystemMessage(room, '🔄 Host restarted the session. Ready for a new royal tournament!');
    this.broadcastRoom(room);
    return { success: true, room };
  }

  sendMessage(roomCode, senderSocketId, text) {
    const room = this.getRoom(roomCode);
    if (!room) return;
    const player = room.players.find(p => p.id === senderSocketId);
    if (!player) return;

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: player.id,
      senderName: player.name,
      avatar: player.avatar,
      text: text.trim().substring(0, 200),
      isSystem: false,
      timestamp: Date.now()
    };

    room.messages.push(message);
    if (room.messages.length > 60) room.messages.shift();

    this.io.to(room.code).emit('chat_message', message);
  }

  sendReaction(roomCode, senderSocketId, emoji) {
    const room = this.getRoom(roomCode);
    if (!room) return;
    const player = room.players.find(p => p.id === senderSocketId);
    if (!player) return;

    this.io.to(room.code).emit('player_reaction', {
      playerId: player.id,
      playerName: player.name,
      emoji
    });
  }

  addSystemMessage(room, text) {
    const msg = {
      id: `sys_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: 'system',
      senderName: 'Royal Herald',
      avatar: '📜',
      text,
      isSystem: true,
      timestamp: Date.now()
    };
    room.messages.push(msg);
    if (room.messages.length > 60) room.messages.shift();
    this.io.to(room.code).emit('chat_message', msg);
  }

  handleDisconnect(socketId) {
    for (const [code, room] of this.rooms.entries()) {
      const pIndex = room.players.findIndex(p => p.id === socketId);
      if (pIndex !== -1) {
        const leavingPlayer = room.players[pIndex];
        if (room.state === GAME_STATES.LOBBY) {
          // If in lobby, remove player
          room.players.splice(pIndex, 1);
          if (room.players.length === 0) {
            this.rooms.delete(code);
            return;
          }
          // If host left, appoint new host
          if (leavingPlayer.isHost && room.players.length > 0) {
            const nextHuman = room.players.find(p => !p.isBot) || room.players[0];
            nextHuman.isHost = true;
            room.hostId = nextHuman.id;
            this.addSystemMessage(room, `👑 ${nextHuman.name} is now the Royal Host.`);
          }
          this.addSystemMessage(room, `🚪 ${leavingPlayer.name} has departed.`);
          this.broadcastRoom(room);
        } else {
          // In-game disconnect
          this.addSystemMessage(room, `⚠️ ${leavingPlayer.name} disconnected.`);
        }
      }
    }
  }

  // AI BOT Automation for smooth testing or solo/co-op play
  handleBotTurn(room) {
    if (!room || !room.currentRound) return;

    // 1. Role View Auto advance for bot or if all are bots
    if (room.state === GAME_STATES.ROLE_VIEW) {
      setTimeout(() => {
        if (room.state === GAME_STATES.ROLE_VIEW) {
          this.advanceToRajaReveal(room.code);
        }
      }, 3500);
      return;
    }

    // 2. Raja Reveal Bot
    if (room.state === GAME_STATES.RAJA_REVEAL) {
      const raja = room.players.find(p => p.role === 'raja');
      if (raja && raja.isBot) {
        setTimeout(() => {
          if (room.state === GAME_STATES.RAJA_REVEAL) {
            this.revealRaja(room.code, raja.id);
          }
        }, 1500 + Math.random() * 1000);
      }
      return;
    }

    // 3. Vajir Reveal Bot
    if (room.state === GAME_STATES.VAJIR_REVEAL) {
      const vajir = room.players.find(p => p.role === 'vajir');
      if (vajir && vajir.isBot) {
        setTimeout(() => {
          if (room.state === GAME_STATES.VAJIR_REVEAL) {
            this.revealVajir(room.code, vajir.id);
          }
        }, 1500 + Math.random() * 1000);
      }
      return;
    }

    // 4. Vajir Guess Bot
    if (room.state === GAME_STATES.VAJIR_GUESS) {
      const vajir = room.players.find(p => p.role === 'vajir');
      if (vajir && vajir.isBot) {
        setTimeout(() => {
          if (room.state === GAME_STATES.VAJIR_GUESS) {
            const suspects = room.players.filter(p => p.role !== 'raja' && p.role !== 'vajir');
            if (suspects.length === 2) {
              // 60% chance smart AI guesses correctly, 40% random bluff
              const isSmart = Math.random() < 0.6;
              let chorTarget, sipahiTarget;
              if (isSmart) {
                chorTarget = suspects.find(p => p.role === 'chor');
                sipahiTarget = suspects.find(p => p.role === 'sipahi');
              } else {
                chorTarget = suspects[1];
                sipahiTarget = suspects[0];
              }
              this.submitVajirGuess(room.code, vajir.id, {
                chorPlayerId: chorTarget.id,
                sipahiPlayerId: sipahiTarget.id
              });
            }
          }
        }, 2500 + Math.random() * 1500);
      }
    }
  }

  // Sanitized view sent to players with STRICT privacy guarantees
  getClientRoomState(room, targetSocketId) {
    if (!room) return null;

    const targetPlayer = room.players.find(p => p.id === targetSocketId);

    // Sanitize players info based on current state and target player
    const sanitizedPlayers = room.players.map(p => {
      let visibleRole = null;
      let isRoleRevealed = false;

      // In results or final standings, all roles are revealed
      if (room.state === GAME_STATES.ROUND_RESULT || room.state === GAME_STATES.FINAL_STANDINGS) {
        visibleRole = p.role;
        isRoleRevealed = true;
      } else {
        // If Raja has revealed, everyone knows Raja
        if (room.currentRound?.rajaRevealed && p.role === 'raja') {
          visibleRole = 'raja';
          isRoleRevealed = true;
        }
        // If Vajir has revealed, everyone knows Vajir
        else if (room.currentRound?.vajirRevealed && p.role === 'vajir') {
          visibleRole = 'vajir';
          isRoleRevealed = true;
        }
        // A player always sees their OWN private role if in an active game state
        else if (p.id === targetSocketId && room.state !== GAME_STATES.LOBBY) {
          visibleRole = p.role;
          isRoleRevealed = false; // Still secret to others
        }
      }

      return {
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isHost: p.isHost,
        isBot: p.isBot,
        isReady: p.isReady,
        totalScore: p.totalScore,
        visibleRole,
        isRoleRevealed,
        stats: p.stats
      };
    });

    return {
      code: room.code,
      hostId: room.hostId,
      state: room.state,
      roundNumber: room.roundNumber,
      maxRounds: room.maxRounds,
      rolesConfig: room.rolesConfig,
      scoringConfig: room.scoringConfig,
      isCustomRoles: room.isCustomRoles,
      players: sanitizedPlayers,
      myPlayer: targetPlayer ? {
        id: targetPlayer.id,
        name: targetPlayer.name,
        avatar: targetPlayer.avatar,
        isHost: targetPlayer.isHost,
        role: targetPlayer.role, // Secret role for this player
        totalScore: targetPlayer.totalScore
      } : null,
      currentRound: room.currentRound ? {
        roundNumber: room.currentRound.roundNumber,
        rajaRevealed: room.currentRound.rajaRevealed,
        vajirRevealed: room.currentRound.vajirRevealed,
        guess: room.currentRound.guess,
        isGuessCorrect: room.currentRound.isGuessCorrect,
        scoresAwarded: room.currentRound.scoresAwarded,
        actualRoles: (room.state === GAME_STATES.ROUND_RESULT || room.state === GAME_STATES.FINAL_STANDINGS)
          ? room.currentRound.actualRoles
          : null
      } : null,
      history: room.history,
      messages: room.messages
    };
  }

  broadcastRoom(room) {
    if (!room) return;
    // Send customized view to each connected player for privacy
    room.players.forEach(p => {
      if (!p.isBot) {
        const state = this.getClientRoomState(room, p.id);
        this.io.to(p.id).emit('room_update', state);
      }
    });
  }
}
