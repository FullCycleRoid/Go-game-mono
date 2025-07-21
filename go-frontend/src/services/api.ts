import axios from 'axios';
import { Player, Game, GameState, GamePlayer, MoveRequest, Invite } from './types';
import { API_BASE_URL } from './constants';
import { logger } from './logger';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Методы для работы с играми (создание, получение, ход, присоединение)
 */
export const gameApi = {
  /**
   * Создать игру
   */
  createGame: async (creatorId: string): Promise<Game> => {
    try {
      const response = await api.post('/api/games/', { creator_id: creatorId });
      return response.data;
    } catch (error) {
      logger.error('Ошибка создания игры', { error });
      throw error;
    }
  },
  /**
   * Получить игру по id
   */
  getGame: async (gameId: string): Promise<Game> => {
    try {
      const response = await api.get(`/api/games/${gameId}`);
      return response.data;
    } catch (error) {
      logger.error('Ошибка получения игры', { error });
      throw error;
    }
  },
  /**
   * Сделать ход
   */
  makeMove: async (gameId: string, move: MoveRequest): Promise<Game> => {
    try {
      const response = await api.post(`/api/games/${gameId}/move`, move);
      return response.data;
    } catch (error) {
      logger.error('Ошибка хода', { error });
      throw error;
    }
  },
  /**
   * Присоединиться к игре
   */
  joinGame: async (gameId: string, playerId: string): Promise<Game> => {
    try {
      const response = await api.post(`/api/games/${gameId}/join?player_id=${playerId}`);
      return response.data;
    } catch (error) {
      logger.error('Ошибка присоединения к игре', { error });
      throw error;
    }
  },
};

/**
 * Методы для работы с игроками
 */
export const playerApi = {
  /**
   * Создать игрока
   */
  createPlayer: async (player: Omit<Player, 'created_at'>): Promise<Player> => {
    try {
      const response = await api.post('/api/players/', player);
      return response.data;
    } catch (error) {
      logger.error('Ошибка создания игрока', { error });
      throw error;
    }
  },
  /**
   * Получить игрока по telegramId
   */
  getPlayer: async (telegramId: string): Promise<Player> => {
    try {
      const response = await api.get(`/api/players/${telegramId}`);
      return response.data;
    } catch (error) {
      logger.error('Ошибка получения игрока', { error });
      throw error;
    }
  },
};

/**
 * Методы для работы с приглашениями
 */
export const inviteApi = {
  /**
   * Создать приглашение
   */
  createInvite: async (gameId: string, playerId: string): Promise<Invite> => {
    try {
      const response = await api.post('/api/invites/', { game_id: gameId, player_id: playerId });
      return response.data;
    } catch (error) {
      logger.error('Ошибка создания приглашения', { error });
      throw error;
    }
  },
  /**
   * Получить приглашение по id
   */
  getInvite: async (inviteId: string): Promise<Invite> => {
    try {
      const response = await api.get(`/api/invites/${inviteId}`);
      return response.data;
    } catch (error) {
      logger.error('Ошибка получения приглашения', { error });
      throw error;
    }
  },
  /**
   * Принять приглашение
   */
  acceptInvite: async (inviteId: string, playerId: string): Promise<Game> => {
    try {
      const response = await api.post(`/api/invites/${inviteId}/accept?player_id=${playerId}`);
      return response.data;
    } catch (error) {
      logger.error('Ошибка принятия приглашения', { error });
      throw error;
    }
  },
  /**
   * Отклонить приглашение
   */
  declineInvite: async (inviteId: string): Promise<{ message: string }> => {
    try {
      const response = await api.post(`/api/invites/${inviteId}/decline`);
      return response.data;
    } catch (error) {
      logger.error('Ошибка отклонения приглашения', { error });
      throw error;
    }
  },
};

export default api;