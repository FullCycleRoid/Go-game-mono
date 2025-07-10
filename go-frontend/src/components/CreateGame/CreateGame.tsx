import React, { useState } from 'react';
import styles from './CreateGame.module.css';
import { gameApi, playerApi } from '../../services/api';
import { telegramService } from '../../services/telegram';

interface CreateGameProps {
  onGameCreated: (gameId: string) => void;
}

const CreateGame: React.FC<CreateGameProps> = ({ onGameCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGame = async () => {
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

      // Создаем игру
      const game = await gameApi.createGame(userId);
      onGameCreated(game.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания игры');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createGame}>
      <h2>Создать новую игру</h2>
      <p>Создайте новую игру и пригласите друга для игры в ГО</p>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      
      <button 
        className={styles.createButton}
        onClick={handleCreateGame}
        disabled={loading}
      >
        {loading ? 'Создание...' : 'Создать игру'}
      </button>
    </div>
  );
};

export default CreateGame; 