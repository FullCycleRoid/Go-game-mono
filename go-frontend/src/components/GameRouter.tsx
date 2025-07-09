import React from 'react';
import { useGameContext } from './GameContext';
import GoLobby from './GoLobby';
import GoGameBoard from './GoGameBoard';

const GameRouter: React.FC = () => {
  const { currentGame } = useGameContext();

  // Если есть активная игра, показываем игровую доску
  if (currentGame) {
    return <GoGameBoard />;
  }

  // Иначе показываем лобби
  return <GoLobby />;
};

export default GameRouter; 