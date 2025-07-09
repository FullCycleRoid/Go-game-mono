import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as api from '../api/gameApi';
import { GameState, Player, MoveRequest } from '../types/gameTypes';

interface GameContextType {
  currentGame: GameState | null;
  invites: any[];
  activeGames: any[];
  createGame: (creatorId: string) => Promise<void>;
  invitePlayer: (gameId: string, playerId: string) => Promise<void>;
  acceptInvite: (inviteId: string, playerId: string) => Promise<void>;
  makeMove: (moveRequest: MoveRequest) => Promise<void>;
  loadGame: (gameId: string) => Promise<void>;
  setCurrentGame: (game: GameState | null) => void;
  telegramUser: Player | null;
  setTelegramUser: (user: Player | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentGame, setCurrentGame] = useState<GameState | null>(null);
  const [invites] = useState<any[]>([]);
  const [activeGames] = useState<any[]>([]);
  const [telegramUser, setTelegramUser] = useState<Player | null>(null);

  const createGame = async (creatorId: string) => {
    try {
      console.log('🔧 Создание игры ГО через контекст:', creatorId);
      const newGame = await api.createGame(creatorId);
      setCurrentGame(newGame);
    } catch (error) {
      console.error("❌ Ошибка создания игры:", error);
      alert('Ошибка при создании игры');
    }
  };

  const invitePlayer = async (gameId: string, playerId: string) => {
    try {
      console.log('🔧 Приглашение игрока:', { gameId, playerId });
      await api.createInvite(gameId, playerId);
    } catch (error) {
      console.error("❌ Ошибка приглашения игрока:", error);
      alert('Ошибка при приглашении игрока');
    }
  };

  const acceptInvite = async (inviteId: string, playerId: string) => {
    try {
      console.log('🔧 Принятие приглашения:', { inviteId, playerId });
      const game = await api.acceptInvite(inviteId, playerId);
      setCurrentGame(game);
    } catch (error) {
      console.error("❌ Ошибка принятия приглашения:", error);
      alert('Ошибка при принятии приглашения');
    }
  };

  const makeMove = async (moveRequest: MoveRequest) => {
    if (!currentGame) {
      throw new Error('Игра не загружена');
    }

    try {
      console.log('🔧 Ход через контекст:', { gameId: currentGame.id, moveRequest });
      const updatedGame = await api.makeMove(currentGame.id, moveRequest);
      setCurrentGame(updatedGame);
    } catch (error) {
      console.error("❌ Ошибка хода:", error);
      throw error;
    }
  };

  const loadGame = async (gameId: string) => {
    try {
      console.log('🔧 Загрузка игры:', gameId);
      const game = await api.getGame(gameId);
      setCurrentGame(game);
    } catch (error) {
      console.error("❌ Ошибка загрузки игры:", error);
      alert('Ошибка при загрузке игры');
    }
  };

  return (
    <GameContext.Provider value={{
      currentGame,
      invites,
      activeGames,
      createGame,
      invitePlayer,
      acceptInvite,
      makeMove,
      loadGame,
      setCurrentGame,
      telegramUser,
      setTelegramUser
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}; 