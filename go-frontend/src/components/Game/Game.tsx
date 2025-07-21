import React, { useState, MouseEvent, useEffect } from 'react';
import styles from './Game.module.css';
import { GamePhase } from '../../constants';
import { useGame } from '../../hooks/useGame';
import { telegramService } from '../../services/telegram';
import WelcomeScreen from './WelcomeScreen';
import CreateGameScreen from './CreateGameScreen';
import JoinGameScreen from './JoinGameScreen';
import PlayingGameScreen from './PlayingGameScreen';

function Game() {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.Welcome);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  useEffect(() => {
    if (telegramService.isTelegramWebApp()) {
      telegramService.init();
    }
  }, []);

  const {
    game,
    loading,
    error,
    isMyTurn,
    makeMove,
    refreshGame
  } = useGame(currentGameId);

  const handleGameCreated = (gameId: string) => {
    setCurrentGameId(gameId);
    setGamePhase(GamePhase.PlayingGame);
  };

  const handleGameJoined = (gameId: string) => {
    setCurrentGameId(gameId);
    setGamePhase(GamePhase.PlayingGame);
  };

  const handleClickPoint = async (
    e: MouseEvent<HTMLButtonElement>,
    gridX: number,
    gridY: number
  ) => {
    e.preventDefault();
    if (isMyTurn) {
      await makeMove(gridX, gridY);
    }
  };

  return (
    <main className={styles.game} data-testid="Game">
      {gamePhase === GamePhase.Welcome && (
        <WelcomeScreen
          onCreate={() => setGamePhase(GamePhase.CreateGame)}
          onJoin={() => setGamePhase(GamePhase.JoinGame)}
        />
      )}
      {gamePhase === GamePhase.CreateGame && (
        <CreateGameScreen onGameCreated={handleGameCreated} />
      )}
      {gamePhase === GamePhase.JoinGame && (
        <JoinGameScreen onGameJoined={handleGameJoined} />
      )}
      {gamePhase === GamePhase.PlayingGame && (
        <PlayingGameScreen
          loading={loading}
          error={error}
          game={game}
          isMyTurn={isMyTurn}
          handleClickPoint={handleClickPoint}
          refreshGame={refreshGame}
        />
      )}
    </main>
  );
}

export default Game;
