// Royal Crown Game Logic & Data Types

export const DEFAULT_ROLES = {
  raja: {
    id: 'raja',
    name: 'Raja',
    icon: '👑',
    title: 'The Sovereign King',
    description: 'The ruler of the kingdom. Always commands and earns royal points.',
    color: 'from-amber-500 to-yellow-600',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  vajir: {
    id: 'vajir',
    name: 'Vajir',
    icon: '⚔️',
    title: 'The Royal Advisor',
    description: 'The sharp-witted minister tasked with deducing who is the Chor and who is the Sipahi.',
    color: 'from-blue-500 to-indigo-600',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  },
  chor: {
    id: 'chor',
    name: 'Chor',
    icon: '🕵️',
    title: 'The Elusive Thief',
    description: 'The master of shadows. Escapes with bounty points if the Vajir fails to identify them.',
    color: 'from-rose-500 to-red-700',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  sipahi: {
    id: 'sipahi',
    name: 'Sipahi',
    icon: '🛡️',
    title: 'The Loyal Guard',
    description: 'The royal sentry. Wins honor points if the Vajir fails to correctly identify the suspects.',
    color: 'from-emerald-500 to-teal-700',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  }
};

export const DEFAULT_SCORING = {
  raja: 1000,
  vajirCorrect: 600,
  vajirWrong: 0,
  chorCaught: 0,
  chorEscaped: 300,
  sipahiCaught: 0,
  sipahiEscaped: 400
};

export const GAME_STATES = {
  LOBBY: 'LOBBY',
  ROLE_VIEW: 'ROLE_VIEW',
  RAJA_REVEAL: 'RAJA_REVEAL',
  VAJIR_REVEAL: 'VAJIR_REVEAL',
  VAJIR_GUESS: 'VAJIR_GUESS',
  ROUND_RESULT: 'ROUND_RESULT',
  FINAL_STANDINGS: 'FINAL_STANDINGS'
};

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // exclude ambiguous like 0/O, 1/I
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
