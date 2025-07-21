import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Player {
  telegram_id: string;
  username?: string;
  first_name: string;
  last_name?: string;
  created_at: string;
}

export interface GameState {
  board: (string | null)[][];
  current_player: string;
  captured_black: number;
  captured_white: number;
  last_move?: [number, number];
  ko_protection?: (string | null)[][];
  is_game_over: boolean;
  winner?: string;
}

export interface Game {
  id: string;
  state: GameState;
  status: string;
  winner_id?: string;
  created_at: string;
  updated_at: string;
  players: GamePlayer[];
}

export interface GamePlayer {
  game_id: string;
  player_id: string;
  is_creator: boolean;
  player_color: string;
  player: Player;
}

export interface MoveRequest {
  player_id: string;
  x: number;
  y: number;
}

export interface Invite {
  id: string;
  game_id: string;
  player_id: string;
  status: string;
  created_at: string;
  game: Game;
  player: Player;
}

// API methods
export const gameApi = {
  // Создать игру
  createGame: async (creatorId: string): Promise<Game> => {
    const response = await api.post('/api/games/', { creator_id: creatorId });
    return response.data;
  },

  // Получить игру
  getGame: async (gameId: string): Promise<Game> => {
    const response = await api.get(`/api/games/${gameId}`);
    return response.data;
  },

  // Сделать ход
  makeMove: async (gameId: string, move: MoveRequest): Promise<Game> => {
    const response = await api.post(`/api/games/${gameId}/move`, move);
    return response.data;
  },

  // Присоединиться к игре
  joinGame: async (gameId: string, playerId: string): Promise<Game> => {
    const response = await api.post(`/api/games/${gameId}/join?player_id=${playerId}`);
    return response.data;
  },
};

export const playerApi = {
  // Создать игрока
  createPlayer: async (player: Omit<Player, 'created_at'>): Promise<Player> => {
    const response = await api.post('/api/players/', player);
    return response.data;
  },

  // Получить игрока
  getPlayer: async (telegramId: string): Promise<Player> => {
    const response = await api.get(`/api/players/${telegramId}`);
    return response.data;
  },
};

export const inviteApi = {
  // Создать приглашение
  createInvite: async (gameId: string, playerId: string): Promise<Invite> => {
    const response = await api.post('/api/invites/', { game_id: gameId, player_id: playerId });
    return response.data;
  },

  // Получить приглашение
  getInvite: async (inviteId: string): Promise<Invite> => {
    const response = await api.get(`/api/invites/${inviteId}`);
    return response.data;
  },

  // Принять приглашение
  acceptInvite: async (inviteId: string, playerId: string): Promise<Game> => {
    const response = await api.post(`/api/invites/${inviteId}/accept?player_id=${playerId}`);
    return response.data;
  },

  // Отклонить приглашение
  declineInvite: async (inviteId: string): Promise<{ message: string }> => {
    const response = await api.post(`/api/invites/${inviteId}/decline`);
    return response.data;
  },
};

export default api;