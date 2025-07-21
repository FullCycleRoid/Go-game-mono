import React from 'react';
import Board from 'components/Board/Board';
import styles from './Game.module.css';
import { StoneType } from 'components/Stone/Stone';
import { Game } from '../../services/types';

interface PlayingGameScreenProps {
  loading: boolean;
  error: string | null;
  game: Game | null;
  isMyTurn: boolean;
  handleClickPoint: (e: React.MouseEvent<HTMLButtonElement>, gridX: number, gridY: number) => void;
  refreshGame: () => void;
}

/**
 * Компонент отображения игровой доски и статуса игры.
 */
const PlayingGameScreen: React.FC<PlayingGameScreenProps> = ({ loading, error, game, isMyTurn, handleClickPoint, refreshGame }) => {
  /**
   * Преобразует данные доски из состояния игры в массив StoneType.
   */
  const getBoardData = (): StoneType[][] => {
    if (!game?.state.board) {
      return Array(9).fill(null).map(() => Array(9).fill(StoneType.Empty));
    }
    return (game.state.board as (string | null)[][]).map((row) =>
      row.map((cell) => {
        if (cell === 'black') return StoneType.Black;
        if (cell === 'white') return StoneType.White;
        return StoneType.Empty;
      })
    );
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка игры...</div>;
  }
  if (error) {
    return (
      <div className={styles.error}>
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={refreshGame}>Повторить</button>
      </div>
    );
  }
  if (!game) {
    return <div className={styles.loading}>Игра не найдена</div>;
  }
  return (
    <>
      {game?.state.is_game_over && (
        <div className={styles.gameOver}>
          Game Over! Winner: {game.state.winner}
        </div>
      )}
      <Board
        boardSize={9}
        boardData={getBoardData()}
        isCurrentTurn={isMyTurn}
        isMyTurn={isMyTurn}
        onPointClick={handleClickPoint}
      />
    </>
  );
};

export default PlayingGameScreen; 