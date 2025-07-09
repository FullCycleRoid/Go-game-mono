import { useEffect } from 'react';
import { GameProvider } from './components/GameContext';
import TelegramAuth from './components/TelegramAuth';
import GameRouter from './components/GameRouter';
import { config } from './config';
import './App.css';

// Глобальные типы для Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        setHeaderColor?: (color: string) => void;
        setBackgroundColor?: (color: string) => void;
        showAlert?: (message: string) => void;
        initData?: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            username?: string;
            first_name: string;
            last_name?: string;
          };
        };
      };
    };
  }
}

function App() {
  useEffect(() => {
    // Инициализация Telegram WebApp (только если запущено в Telegram)
    if (window.Telegram?.WebApp) {
      try {
        const webApp = window.Telegram.WebApp;
        webApp.ready();
        webApp.setHeaderColor?.('#4CAF50');
        webApp.setBackgroundColor?.('#f0f2f5');
        console.log('✅ Telegram WebApp инициализирован');
      } catch (error) {
        console.error('❌ Ошибка инициализации Telegram WebApp:', error);
      }
    } else if (config.isDevelopment) {
      console.log('🔧 Запуск в режиме разработки (вне Telegram)');
      console.log('📡 Подключение к бэкенду:', config.apiUrl);
    } else {
      console.log('⚠️ Запуск вне Telegram (не в dev режиме)');
    }
  }, []);

  return (
    <GameProvider>
      <div className="App">
        <TelegramAuth />
        <GameRouter />
      </div>
    </GameProvider>
  );
}

export default App; 