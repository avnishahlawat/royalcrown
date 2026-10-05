import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GameManager } from './gameManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const gameManager = new GameManager(io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: gameManager.rooms.size, timestamp: Date.now() });
});

// Socket connection
io.on('connection', (socket) => {
  console.log(`[Socket Connected] ID: ${socket.id}`);

  // Create Room
  socket.on('create_room', ({ playerName, settings }, callback) => {
    try {
      const room = gameManager.createRoom(socket.id, playerName, settings);
      socket.join(room.code);
      const clientState = gameManager.getClientRoomState(room, socket.id);
      if (callback) callback({ success: true, room: clientState });
      gameManager.broadcastRoom(room);
    } catch (err) {
      console.error('Error creating room:', err);
      if (callback) callback({ success: false, error: err.message });
    }
  });

  // Join Room
  socket.on('join_room', ({ roomCode, playerName }, callback) => {
    try {
      const result = gameManager.joinRoom(roomCode, socket.id, playerName);
      if (!result.success) {
        if (callback) callback({ success: false, error: result.error });
        return;
      }
      socket.join(result.room.code);
      const clientState = gameManager.getClientRoomState(result.room, socket.id);
      if (callback) callback({ success: true, room: clientState });
      gameManager.broadcastRoom(result.room);
    } catch (err) {
      console.error('Error joining room:', err);
      if (callback) callback({ success: false, error: err.message });
    }
  });

  // Add AI Bot
  socket.on('add_bot', ({ roomCode }, callback) => {
    const result = gameManager.addBot(roomCode, socket.id);
    if (result.success) {
      gameManager.broadcastRoom(result.room);
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, error: result.error });
    }
  });

  // Remove AI Bot
  socket.on('remove_bot', ({ roomCode, botId }, callback) => {
    const result = gameManager.removeBot(roomCode, socket.id, botId);
    if (result.success) {
      gameManager.broadcastRoom(result.room);
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, error: result.error });
    }
  });

  // Update Settings
  socket.on('update_settings', ({ roomCode, settings }, callback) => {
    const result = gameManager.updateSettings(roomCode, socket.id, settings);
    if (result.success) {
      gameManager.broadcastRoom(result.room);
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, error: result.error });
    }
  });

  // Start Game
  socket.on('start_game', ({ roomCode }, callback) => {
    const result = gameManager.startGame(roomCode, socket.id);
    if (result.success) {
      gameManager.broadcastRoom(result.room);
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, error: result.error });
    }
  });

  // Ready / Advance from Role View
  socket.on('acknowledge_role', ({ roomCode }) => {
    gameManager.advanceToRajaReveal(roomCode);
  });

  // Raja Reveal
  socket.on('reveal_raja', ({ roomCode }, callback) => {
    const result = gameManager.revealRaja(roomCode, socket.id);
    if (result.success) {
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, error: result.error });
    }
  });

  // Vajir Reveal
  socket.on('reveal_vajir', ({ roomCode }, callback) => {
    const result = gameManager.revealVajir(roomCode, socket.id);
    if (result.success) {
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, error: result.error });
    }
  });

  // Vajir Guess
  socket.on('submit_vajir_guess', ({ roomCode, guess }, callback) => {
    const result = gameManager.submitVajirGuess(roomCode, socket.id, guess);
    if (result.success) {
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, error: result.error });
    }
  });

  // Next Round
  socket.on('next_round', ({ roomCode }, callback) => {
    const result = gameManager.nextRoundOrEnd(roomCode, socket.id);
    if (result.success) {
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, error: result.error });
    }
  });

  // End Match
  socket.on('end_match', ({ roomCode }, callback) => {
    const result = gameManager.endMatch(roomCode, socket.id);
    if (result.success) {
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, error: result.error });
    }
  });

  // Play Again
  socket.on('play_again', ({ roomCode }, callback) => {
    const result = gameManager.playAgain(roomCode, socket.id);
    if (result.success) {
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, error: result.error });
    }
  });

  // Chat message
  socket.on('send_chat', ({ roomCode, text }) => {
    gameManager.sendMessage(roomCode, socket.id, text);
  });

  // Emoji reaction
  socket.on('send_reaction', ({ roomCode, emoji }) => {
    gameManager.sendReaction(roomCode, socket.id, emoji);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[Socket Disconnected] ID: ${socket.id}`);
    gameManager.handleDisconnect(socket.id);
  });
});

// Serve client in production if built
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`👑 Royal Crown Server running on http://localhost:${PORT}`);
});
