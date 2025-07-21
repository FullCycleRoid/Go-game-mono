/**
 * Хук useGame — управление состоянием и логикой игры Го.
 * Инкапсулирует загрузку, обновление, ходы, автообновление и вычисление текущего игрока.
 * Используйте для получения состояния игры и управления действиями пользователя.
 */
import { useState, useEffect, useCallback } from 'react';
import { gameApi } from '../services/api';
import { telegramService } from '../services/telegram';
import { Game, MoveRequest } from '../services/types';
import { PlayerInfo, UseGameReturn } from './types';

/**
 * Кастомный хук для управления состоянием игры Го.
 * @param gameId - идентификатор игры
 * @returns объект с состоянием игры, функциями для хода, обновления и информацией о текущем пользователе
 */
export const useGame = (gameId: string | null): UseGameReturn => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPlayer = game?.state.current_player || null;
  const currentUserId = telegramService.getUserId();
  
  /**
   * Проверяет, мой ли сейчас ход
   * @returns true, если ход текущего пользователя
   */
  const isMyTurn = useCallback(() => {
    if (!game || !currentUserId) return false;
    const myPlayer = game.players.find(p => p.player_id === currentUserId);
    if (!myPlayer) return false;
    return game.state.current_player === myPlayer.player_color;
  }, [game, currentUserId]);

  /**
   * Загрузить состояние игры с сервера
   */
  const loadGame = useCallback(async () => {
    if (!gameId) return;
    setLoading(true);
    setError(null);
    try {
      const gameData = await gameApi.getGame(gameId);
      setGame(gameData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки игры');
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  /**
   * Принудительно обновить состояние игры
   */
  const refreshGame = useCallback(async () => {
    await loadGame();
  }, [loadGame]);

  /**
   * Сделать ход
   * @param x X-координата
   * @param y Y-координата
   */
  const makeMove = useCallback(async (x: number, y: number) => {
    if (!gameId || !currentUserId) return;
    try {
      await gameApi.makeMove(gameId, {
        player_id: currentUserId,
        x,
        y
      });
      await loadGame();
    } catch (err) {
      // Обработка ошибок сервера
    }
  }, [gameId, currentUserId, loadGame]);

  // Автоматическое обновление состояния игры
  useEffect(() => {
    if (!gameId) return;
    const interval = setInterval(loadGame, 3000);
    return () => clearInterval(interval);
  }, [gameId, loadGame]);

  // Информация о текущем пользователе-игроке
  const playerInfo = game?.players
    ? game.players.map(p => ({
        playerId: p.player_id,
        playerColor: p.player_color,
        playerName: p.player.first_name
      })).find(p => p.playerId === currentUserId) || null
    : null;

  return {
    game,
    loading,
    error,
    currentPlayer,
    isMyTurn: isMyTurn(),
    playerInfo,
    makeMove,
    refreshGame,
  };
}; 