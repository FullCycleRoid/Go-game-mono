import React, { useEffect, useState } from 'react';
import { useGameContext } from './GameContext';
import { Player } from '../types/gameTypes';
import * as api from '../api/gameApi';

const TelegramAuth: React.FC = () => {
  const { telegramUser, setTelegramUser } = useGameContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initTelegramAuth = async () => {
      // Проверяем, запущено ли приложение в Telegram
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
        
        setIsLoading(true);
        try {
          // Создаем или получаем игрока
          const playerData = {
            telegram_id: tgUser.id.toString(),
            username: tgUser.username,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name
          };

          const player = await api.createPlayer(playerData);
          setTelegramUser(player);
          console.log('✅ Пользователь авторизован:', player);
        } catch (error) {
          console.error('❌ Ошибка авторизации:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('🔧 Запуск вне Telegram - режим разработки');
        // Для разработки создаем тестового пользователя
        const testPlayer: Player = {
          telegram_id: '123456789',
          username: 'test_user',
          first_name: 'Тестовый',
          last_name: 'Пользователь',
          created_at: new Date().toISOString()
        };
        setTelegramUser(testPlayer);
      }
    };

    initTelegramAuth();
  }, [setTelegramUser]);

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Авторизация...</p>
      </div>
    );
  }

  if (!telegramUser) {
    return (
      <div className="auth-error">
        <p>Ошибка авторизации. Пожалуйста, запустите приложение через Telegram.</p>
      </div>
    );
  }

  return (
    <div className="auth-success">
      <div className="user-info">
        <div className="user-avatar">
          {telegramUser.first_name.charAt(0)}
        </div>
        <div className="user-details">
          <span className="user-name">
            {telegramUser.first_name} {telegramUser.last_name}
          </span>
          {telegramUser.username && (
            <span className="user-username">@{telegramUser.username}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelegramAuth; 