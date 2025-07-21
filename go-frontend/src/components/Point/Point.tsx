import React from 'react';
import styles from './Point.module.css';
import Stone, { StoneType } from 'components/Stone/Stone';
import { isStarPoint } from 'services/starPoints';
import { PointProps, PointClickHandler } from './types';

/**
 * Get class names for the Point's parent HTML element.
 */
export const getPointClassNames = (boardSize: number, gridX: number, gridY: number): string => {
  let classNames: string[] = [styles.default];

  // Points at the edge of the board.
  if (gridY === 0){
    classNames.push(styles.top);
  } else if (gridY === boardSize - 1){
    classNames.push(styles.bottom);
  }

  if (gridX === 0){
    classNames.push(styles.left);
  } else if (gridX === boardSize - 1){
    classNames.push(styles.right);
  }

  // Star points (dots appearing on certain grid line intersections).
  if (isStarPoint(boardSize, gridX, gridY)){
    classNames.push(styles.star);
  }

  return classNames.join(' ');
};

/**
 * Компонент точки пересечения на доске ГО.
 * @param props PointProps
 */
const Point = ({stoneType = StoneType.Empty, boardSize, gridX, gridY, turn, isMyTurn, onClickPoint}: PointProps) => (
  <li className={getPointClassNames(boardSize, gridX, gridY)}>
    <button
      type="button"
      className={!turn ? styles.btnBlackTurn : styles.btnWhiteTurn}
      disabled={!isMyTurn || stoneType !== StoneType.Empty}
      aria-label={`Точка (${gridX + 1}, ${gridY + 1})${isStarPoint(boardSize, gridX, gridY) ? ', звёздная' : ''}${stoneType !== StoneType.Empty ? ', занята' : ''}`}
      onClick={onClickPoint ? (e) => onClickPoint(e, gridX, gridY) : undefined}
    >
      {stoneType !== StoneType.Empty && <Stone stoneType={stoneType} />}
    </button>
  </li>
);

export default Point;
export type { PointClickHandler } from './types';
