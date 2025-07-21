import { Game } from '../services/types';

export interface PlayerInfo {
  playerId: string;
  playerColor: string;
  playerName: string;
}

export interface UseGameReturn {
  game: Game | null;
  loading: boolean;
  error: string | null;
  currentPlayer: string | null;
  isMyTurn: boolean;
  playerInfo: PlayerInfo | null;
  makeMove: (x: number, y: number) => Promise<void>;
  refreshGame: () => Promise<void>;
} 