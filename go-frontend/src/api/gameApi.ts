import axios from 'axios';
import { GameState, Player, MoveRequest, GameCreate, PlayerCreate, InviteCreate } from '../types/gameTypes';
import { config } from '../config';

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
});

// Игроки
export const createPlayer = async (player: PlayerCreate): Promise<Player> => {
  const response = await api.post('/players/', player);
  return response.data;
};

export const getPlayer = async (telegramId: string): Promise<Player> => {
  const response = await api.get(`/players/${telegramId}`);
  return response.data;
};

// Игры
export const createGame = async (creatorId: string): Promise<GameState> => {
  const gameData: GameCreate = { creator_id: creatorId };
  const response = await api.post('/games/', gameData);
  return response.data;
};

export const getGame = async (gameId: string): Promise<GameState> => {
  const response = await api.get(`/games/${gameId}`);
  return response.data;
};

export const makeMove = async (gameId: string, moveRequest: MoveRequest): Promise<GameState> => {
  const response = await api.post(`/games/${gameId}/move`, moveRequest);
  return response.data;
};

export const joinGame = async (gameId: string, playerId: string): Promise<GameState> => {
  const response = await api.post(`/games/${gameId}/join?player_id=${playerId}`);
  return response.data;
};

// Приглашения
export const createInvite = async (gameId: string, playerId: string): Promise<any> => {
  const inviteData: InviteCreate = { game_id: gameId, player_id: playerId };
  const response = await api.post('/invites/', inviteData);
  return response.data;
};

export const acceptInvite = async (inviteId: string, playerId: string): Promise<GameState> => {
  const response = await api.post(`/invites/${inviteId}/accept?player_id=${playerId}`);
  return response.data;
};

export const declineInvite = async (inviteId: string): Promise<any> => {
  const response = await api.post(`/invites/${inviteId}/decline`);
  return response.data;
}; 