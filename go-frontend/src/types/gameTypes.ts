export type Stone = 'black' | 'white' | null;
export type Board = Stone[][];
export type PlayerColor = 'black' | 'white';

// Состояние игры на сервере
export interface GoGameStateBackend {
  board: Board;
  current_player: string;
  captured_black: number;
  captured_white: number;
  last_move: [number, number] | null;
  ko_protection: Board | null;
  is_game_over: boolean;
  winner: string | null;
}

// Полное состояние игры с сервера (FastAPI)
export interface GameState {
  id: string;
  state: GoGameStateBackend;
  status: string;
  winner_id: string | null;
  created_at: string;
  updated_at: string;
}

// Игрок (FastAPI)
export interface Player {
  telegram_id: string;
  username?: string;
  first_name: string;
  last_name?: string;
  created_at: string;
}

// Запрос на создание игрока (FastAPI)
export interface PlayerCreate {
  telegram_id: string;
  username?: string;
  first_name: string;
  last_name?: string;
}

// Запрос на создание игры (FastAPI)
export interface GameCreate {
  creator_id: string;
}

// Запрос на ход (FastAPI)
export interface MoveRequest {
  player_id: string;
  x: number;
  y: number;
}

// Приглашение (FastAPI)
export interface Invite {
  id: string;
  game_id: string;
  player_id: string;
  created_at: string;
}

// Запрос на создание приглашения (FastAPI)
export interface InviteCreate {
  game_id: string;
  player_id: string;
} 