import styles from './Board.module.css';
import Point from 'components/Point/Point';
import BoardRow from 'components/BoardRow/BoardRow';
import { BoardProps } from './types';

/**
 * Компонент доски ГО с поддержкой доступности.
 * @param props BoardProps
 */
const Board = ({boardSize = 9, boardData, isCurrentTurn = false, isMyTurn, onPointClick}: BoardProps) => {
  // Rows containing all Points.
  let boardRows: JSX.Element[] = [];

  for (let y = 0; y < boardSize; y++) {
    // Create Points within each row.
    let points: JSX.Element[] = [];
    for (let x = 0; x < boardSize; x++) {
      points.push(
        <Point 
          stoneType={boardData[x][y]} 
          boardSize={boardSize} 
          gridX={x}
          gridY={y}
          key={y}
          isMyTurn={isMyTurn}
          onClickPoint={onPointClick} 
          turn={isCurrentTurn}
        />
      );
    };
    // Create row.
    boardRows.push(
      <BoardRow boardSize={boardSize} rowIndex={y} key={y}>{points}</BoardRow>
    );
  }

  return (
    <main className={styles.boardScroller}>
      <ol
        className={styles[`size-${boardSize}x${boardSize}`]} 
        data-testid="Board"
        role="grid"
        aria-colcount={boardSize}
        aria-label={`Игровая доска: ${boardSize} на ${boardSize}`}
      >
        {boardRows}
      </ol>
    </main>
  );
};

export default Board;
