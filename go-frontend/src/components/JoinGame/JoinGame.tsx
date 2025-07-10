import React, { useState } from 'react';
import styles from './JoinGame.module.css';
import { gameApi, playerApi } from '../../services/api';
import { telegramService } from '../../services/telegram';

interface JoinGameProps {
  onGameJoined: (gameId: string) => void;
}

const JoinGame: React.FC<JoinGameProps> = ({ onGameJoined }) => {
  const [gameId, setGameId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinGame = async () => {
    if (!gameId.trim()) {
      setError('Введите ID игры');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = telegramService.getUserId();
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }

      // Получаем или создаем игрока
      let player;
      try {
        player = await playerApi.getPlayer(userId);
      } catch {
        const user = telegramService.getUser();
        if (!user) {
          throw new Error('Не удалось получить данные пользователя');
        }

        player = await playerApi.createPlayer({
          telegram_id: userId,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
        });
      }

      // Присоединяемся к игре
      const game = await gameApi.joinGame(gameId.trim(), userId);
      onGameJoined(game.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка присоединения к игре');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.joinGame}>
      <h2>Присоединиться к игре</h2>
      <p>Введите ID игры, к которой хотите присоединиться</p>
      
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="ID игры"
          className={styles.input}
          disabled={loading}
        />
      </div>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      
      <button 
        className={styles.joinButton}
        onClick={handleJoinGame}
        disabled={loading || !gameId.trim()}
      >
        {loading ? 'Присоединение...' : 'Присоединиться'}
      </button>
    </div>
  );
};

export default JoinGame; 