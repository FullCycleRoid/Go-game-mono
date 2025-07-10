import React, { useState, MouseEvent, useEffect } from 'react';
import styles from './Game.module.css';
import Board from 'components/Board/Board';
import TurnIndicator from 'components/TurnIndicator/TurnIndicator';
import { StoneType } from 'components/Stone/Stone';
import { PointClickHandler } from 'components/Point/Point';
import { useGame } from '../../hooks/useGame';
import { telegramService } from '../../services/telegram';
import CreateGame from '../CreateGame/CreateGame';
import JoinGame from '../JoinGame/JoinGame';

/**
 * Phases / stages of gameplay.
 */
export enum GamePhase {
  Welcome,
  CreateGame,
  JoinGame,
  PlayingGame,
  GameOver
}

/**
 * Main Game (App).
 */
function Game() {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.Welcome);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  
  // Инициализация Telegram WebApp
  useEffect(() => {
    if (telegramService.isTelegramWebApp()) {
      telegramService.init();
    }
  }, []);

  // Хук для управления игрой
  const {
    game,
    loading,
    error,
    currentPlayer,
    isMyTurn,
    makeMove,
    refreshGame
  } = useGame(currentGameId);

  // Обработка создания игры
  const handleGameCreated = (gameId: string) => {
    setCurrentGameId(gameId);
    setGamePhase(GamePhase.PlayingGame);
  };

  // Обработка присоединения к игре
  const handleGameJoined = (gameId: string) => {
    setCurrentGameId(gameId);
    setGamePhase(GamePhase.PlayingGame);
  };

  // Обработка клика по точке на доске
  const handleClickPoint: PointClickHandler = async (
    e: MouseEvent<HTMLButtonElement>,
    gridX: number,
    gridY: number
  ): Promise<void> => {
    e.preventDefault();

    if (!currentGameId || !isMyTurn || e.currentTarget.disabled) {
      return;
    }

    try {
      await makeMove(gridX, gridY);
    } catch (err) {
      console.error('Ошибка выполнения хода:', err);
      if (telegramService.isTelegramWebApp()) {
        telegramService.showAlert(err instanceof Error ? err.message : 'Ошибка выполнения хода');
      }
    }
  };

  // Преобразование данных игры в формат доски
  const getBoardData = (): StoneType[][] => {
    if (!game?.state.board) {
      return Array(9).fill(null).map(() => Array(9).fill(StoneType.Empty));
    }

    return game.state.board.map(row => 
      row.map(cell => {
        if (cell === 'black') return StoneType.Black;
        if (cell === 'white') return StoneType.White;
        return StoneType.Empty;
      })
    );
  };

  // Получение информации об игроках
  const getPlayers = () => {
    if (!game?.players) return [];
    return game.players.map(player => ({
      playerName: player.player.first_name,
      capturedStones: player.player_color === 'black' ? game.state.captured_black : game.state.captured_white
    }));
  };

  // Определение текущего хода
  const getCurrentTurn = (): boolean => {
    if (!game?.state.current_player) return false;
    return game.state.current_player === 'white';
  };

  // Рендер содержимого в зависимости от фазы игры
  const renderGamePhase = (phase: GamePhase): React.ReactElement | null => {
    switch (phase) {
      case GamePhase.PlayingGame:
        if (loading) {
          return <div className={styles.loading}>Загрузка игры...</div>;
        }

        if (error) {
          return (
            <div className={styles.error}>
              <h2>Ошибка</h2>
              <p>{error}</p>
              <button onClick={() => refreshGame()}>Повторить</button>
            </div>
          );
        }

        if (!game) {
          return <div className={styles.loading}>Игра не найдена</div>;
        }

        return (
          <>
            <div className={styles.gameInfo}>
              <h2>Игра ГО</h2>
              <p>Статус: {game.status}</p>
              {game.state.is_game_over && (
                <p>Победитель: {game.state.winner || 'Ничья'}</p>
              )}
            </div>
            
            <TurnIndicator 
              turn={getCurrentTurn()} 
              players={getPlayers()} 
            />
            
            <Board 
              boardSize={9} 
              boardData={getBoardData()} 
              handleClickPoint={handleClickPoint} 
              turn={getCurrentTurn()} 
            />
            
            {isMyTurn && (
              <div className={styles.turnIndicator}>
                Ваш ход!
              </div>
            )}
          </>
        );

      case GamePhase.CreateGame:
        return <CreateGame onGameCreated={handleGameCreated} />;

      case GamePhase.JoinGame:
        return <JoinGame onGameJoined={handleGameJoined} />;

      case GamePhase.Welcome:
      default:
        return (
          <>
            <header className={styles.gameIntro}>
              <h1 className={styles.title}>
                <small>Игра</small> ГО
              </h1>
              <p className={styles.subtitle}>
                Многопользовательская онлайн игра ГО
              </p>
            </header>

            <article className={styles.content}>
              <div className={styles.menu}>
                <button 
                  type="button" 
                  className={styles.menuButton} 
                  onClick={() => setGamePhase(GamePhase.CreateGame)}
                >
                  Создать игру
                </button>
                
                <button 
                  type="button" 
                  className={styles.menuButton} 
                  onClick={() => setGamePhase(GamePhase.JoinGame)}
                >
                  Присоединиться к игре
                </button>
              </div>
            </article>
          </>
        );
    }
  };

  return (
    <main className={styles.game} data-testid="Game">
      {renderGamePhase(gamePhase)}
    </main>
  );
}

export default Game;
