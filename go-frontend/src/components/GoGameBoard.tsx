import React, { useState, useEffect } from 'react';
import { useGameContext } from './GameContext';
import { MoveRequest } from '../types/gameTypes';

const BOARD_SIZE = 9;
const CELL_SIZE = 40;
const STONE_SIZE = 36;

const DIRECTIONS = [
  [0, 1],   // right
  [1, 0],   // down
  [0, -1],  // left
  [-1, 0]   // up
];

function createBoard(size: number): (string | null)[][] {
  return Array(size).fill(null).map(() => Array(size).fill(null));
}

function getGroupAndLiberties(board: (string | null)[][], i: number, j: number) {
  const color = board[i][j];
  if (color === null) {
    return { group: [], liberties: 0 };
  }

  const visited = new Set<string>();
  const queue: [number, number][] = [[i, j]];
  const group: [number, number][] = [];
  const liberties = new Set<string>();

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const key = `${x},${y}`;

    if (visited.has(key)) continue;
    visited.add(key);
    group.push([x, y]);

    for (const [dx, dy] of DIRECTIONS) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < board.length && ny >= 0 && ny < board.length) {
        if (board[nx][ny] === null) {
          liberties.add(`${nx},${ny}`);
        } else if (board[nx][ny] === color) {
          queue.push([nx, ny]);
        }
      }
    }
  }

  return { group, liberties: liberties.size };
}

const GoGameBoard: React.FC = () => {
  const { currentGame, makeMove, telegramUser, setCurrentGame } = useGameContext();
  const [localBoard, setLocalBoard] = useState<(string | null)[][]>(() => createBoard(BOARD_SIZE));
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black');
  const [captured, setCaptured] = useState({ black: 0, white: 0 });
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);
  const [koProtection, setKoProtection] = useState<(string | null)[][] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Синхронизация с серверным состоянием
  useEffect(() => {
    if (currentGame) {
      setLocalBoard(currentGame.state.board);
      setCurrentPlayer(currentGame.state.current_player as 'black' | 'white');
      setCaptured({
        black: currentGame.state.captured_black,
        white: currentGame.state.captured_white
      });
      setLastMove(currentGame.state.last_move);
      setKoProtection(currentGame.state.ko_protection);
    }
  }, [currentGame]);

  const handleClick = async (i: number, j: number) => {
    if (!telegramUser || !currentGame || isLoading) return;

    if (localBoard[i][j] !== null) {
      return;
    }

    // Проверяем, что это ход текущего игрока
    const playerColor = currentGame.state.current_player;
    if (playerColor !== currentPlayer) {
      alert('Сейчас не ваш ход!');
      return;
    }

    setIsLoading(true);

    try {
      const moveRequest: MoveRequest = {
        player_id: telegramUser.telegram_id,
        x: i,
        y: j
      };

      await makeMove(moveRequest);
    } catch (error) {
      console.error('Ошибка хода:', error);
      alert((error as Error).message || 'Ошибка при выполнении хода');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCell = (i: number, j: number) => {
    const stone = localBoard[i][j];
    const isLastMove = lastMove && lastMove[0] === i && lastMove[1] === j;

    return (
      <div
        key={`${i}-${j}`}
        className={`board-cell ${isLastMove ? 'last-move' : ''}`}
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          position: 'relative',
          border: '1px solid #8B4513',
          backgroundColor: '#DEB887',
          cursor: isLoading ? 'default' : 'pointer'
        }}
        onClick={() => handleClick(i, j)}
      >
        {stone && (
          <div
            className={`stone ${stone}`}
            style={{
              width: STONE_SIZE,
              height: STONE_SIZE,
              borderRadius: '50%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: stone === 'black' ? '#000' : '#fff',
              border: stone === 'white' ? '1px solid #333' : 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          />
        )}
        <div
          className="grid-intersection"
          style={{
            position: 'absolute',
            width: 3,
            height: 3,
            backgroundColor: '#000',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        />
      </div>
    );
  };

  return (
    <div className="go-game-container">
      <h1>Игра ГО</h1>

      <div className="game-header">
        <div className="player-info">
          <div className={`player-icon ${currentPlayer === 'black' ? 'active' : ''}`}></div>
          <span className="player-score">Черные: {captured.black}</span>
        </div>

        <div className="game-controls">
          <button
            onClick={() => setCurrentGame(null)}
            className="control-button menu-button"
          >
            Меню
          </button>
        </div>

        <div className="player-info">
          <div className={`player-icon ${currentPlayer === 'white' ? 'active' : ''}`}></div>
          <span className="player-score">Белые: {captured.white}</span>
        </div>
      </div>

      <div className="board-container">
        <div className="board-background">
          <div className="board-grid">
            {localBoard.map((row, i) => (
              row.map((stone, j) => renderCell(i, j))
            ))}
          </div>
        </div>
      </div>

      <div className="current-player-info">
        <div className={`player-indicator ${currentPlayer}`}></div>
        <span className="player-turn-text">
          {currentPlayer === 'black' ? 'Ход чёрных' : 'Ход белых'}
        </span>
      </div>

      <style jsx>{`
        .go-game-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 500px;
          padding: 16px;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .player-info {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.7);
          padding: 8px 16px;
          border-radius: 50px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .player-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 8px;
          border: 2px solid transparent;
        }

        .player-icon.active {
          border-color: #f59e0b;
        }

        .player-icon.black {
          background-color: black;
        }

        .player-icon.white {
          background-color: white;
          border: 2px solid #333;
        }

        .board-container {
          position: relative;
          width: 100%;
          max-width: calc(40px * 9 + 32px);
        }

        .board-background {
          background-color: #fef3c7;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .board-grid {
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          border: 2px solid #8B4513;
          background-color: #DEB887;
        }

        .last-move {
          background-color: rgba(251, 191, 36, 0.5);
        }

        .current-player-info {
          display: flex;
          align-items: center;
          margin-top: 16px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50px;
        }

        .player-indicator {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 8px;
        }

        .player-indicator.black {
          background-color: black;
        }

        .player-indicator.white {
          background-color: white;
          border: 1px solid #333;
        }
      `}</style>
    </div>
  );
};

export default GoGameBoard; 