import { useState, useEffect, useCallback } from 'react';
import { gameApi, Game, MoveRequest, GameState } from '../services/api';
import { telegramService } from '../services/telegram';

export interface UseGameReturn {
  game: Game | null;
  loading: boolean;
  error: string | null;
  currentPlayer: string | null;
  isMyTurn: boolean;
  makeMove: (x: number, y: number) => Promise<void>;
  refreshGame: () => Promise<void>;
}

export const useGame = (gameId: string | null): UseGameReturn => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPlayer = game?.state.current_player || null;
  const currentUserId = telegramService.getUserId();
  
  // Определяем, мой ли сейчас ход
  const isMyTurn = useCallback(() => {
    if (!game || !currentUserId) return false;
    
    const myPlayer = game.players.find(p => p.player_id === currentUserId);
    if (!myPlayer) return false;
    
    return game.state.current_player === myPlayer.player_color;
  }, [game, currentUserId]);

  // Загрузить игру
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

  // Обновить игру
  const refreshGame = useCallback(async () => {
    await loadGame();
  }, [loadGame]);

  // Сделать ход
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

    // Автоматическое обновление состояния
    useEffect(() => {
      if (!gameId) return;

      const interval = setInterval(loadGame, 3000);
      return () => clearInterval(interval);
    }, [gameId, loadGame]);

    return {
      game,
      loading,
      error,
      currentPlayer,
      isMyTurn: isMyTurn(),
      makeMove,
      refreshGame,
    };
}; 