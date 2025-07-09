import React, { useState } from 'react';
import { useGameContext } from './GameContext';

const GoLobby: React.FC = () => {
  const { createGame, telegramUser } = useGameContext();
  const [isCreating, setIsCreating] = useState(false);

  const handleStartGame = async () => {
    if (!telegramUser) {
      alert('Необходимо войти через Telegram');
      return;
    }

    setIsCreating(true);
    try {
      await createGame(telegramUser.telegram_id);
    } catch (error) {
      console.error('Ошибка создания игры:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handlePlayWithFriend = () => {
    alert('Функция игры с другом будет добавлена позже');
  };

  return (
    <div className="go-lobby-container">
      <div className="go-lobby-card">
        <h1>Добро пожаловать в игру ГО!</h1>

        <div className="rules-card">
          <h2>Правила игры:</h2>
          <ul className="rules-list">
            <li className="rule-item">
              <span className="rule-number">1</span>
              <span>Ходят по очереди, начиная с черных</span>
            </li>
            <li className="rule-item">
              <span className="rule-number">2</span>
              <span>Захватывайте камни противника, окружая их</span>
            </li>
            <li className="rule-item">
              <span className="rule-number">3</span>
              <span>Запрещены самоубийственные ходы</span>
            </li>
            <li className="rule-item">
              <span className="rule-number">4</span>
              <span>Запрещено повторять позицию (правило ко)</span>
            </li>
          </ul>
        </div>

        <div className="lobby-buttons">
          <button
            onClick={handleStartGame}
            className="start-button"
            disabled={isCreating}
          >
            {isCreating ? 'Создание игры...' : 'Начать игру'}
          </button>

          <button
            onClick={handlePlayWithFriend}
            className="friend-button"
          >
            Играть с другом
          </button>
        </div>

        <div className="lobby-footer">
          <div className="footer-icons">
            <button className="icon-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
            <button className="icon-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </button>
            <button className="icon-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .go-lobby-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 500px;
          min-height: 100vh;
          padding: 16px;
        }

        .go-lobby-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 24px;
          width: 100%;
          text-align: center;
        }

        .go-lobby-card h1 {
          color: #78350f;
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 24px;
        }

        .rules-card {
          background-color: #fef3c7;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          text-align: left;
        }

        .rules-card h2 {
          color: #78350f;
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .rules-list {
          list-style: none;
        }

        .rule-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .rule-number {
          background-color: #d97706;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.875rem;
          font-weight: bold;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .lobby-buttons {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .start-button, .friend-button {
          padding: 16px 24px;
          font-weight: bold;
          border-radius: 50px;
          font-size: 1.125rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .start-button {
          background-color: #d97706;
          color: white;
        }

        .start-button:hover:not(:disabled) {
          background-color: #b45309;
          transform: scale(1.03);
        }

        .start-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .friend-button {
          background-color: transparent;
          border: 2px solid #d97706;
          color: #d97706;
        }

        .friend-button:hover {
          background-color: #fffbeb;
        }

        .lobby-footer {
          display: flex;
          justify-content: center;
        }

        .footer-icons {
          display: flex;
          gap: 16px;
        }

        .icon-button {
          background-color: #e5e7eb;
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .icon-button:hover {
          background-color: #d1d5db;
        }

        .icon-button svg {
          width: 24px;
          height: 24px;
          stroke: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default GoLobby; 