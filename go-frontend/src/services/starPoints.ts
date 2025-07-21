/**
 * Логика и данные для звёздных точек (star points) на доске Го.
 * Используется для визуального отображения ключевых точек на доске.
 */
import { StarPoints } from './types';

/**
 * Массив координат звёздных точек для разных размеров доски.
 */
export const boardStarPoints: readonly StarPoints[] = Object.freeze([
  {
    boardSize: 9,
    stars: [[3,3], [3,7], [5,5], [7,7], [7,3]]
  },
  {
    boardSize: 13,
    stars: [[4,4], [4,7], [4,10], [7,4], [7,7], [7,10], [10,4], [10,7], [10,10]]
  },
  {
    boardSize: 19,
    stars: [[4,4], [4,10], [4,16], [10,4], [10,10], [10,16], [16,4], [16,10], [16,16]]
  },
]);

/**
 * Проверяет, является ли точка на доске звёздной (имеет ли она dot).
 * @param boardSize Размер доски
 * @param gridX X-координата (от 0)
 * @param gridY Y-координата (от 0)
 * @returns true, если точка звёздная
 * @example
 * isStarPoint(9, 3, 3) // true
 */
export const isStarPoint = (boardSize: number, gridX: number, gridY: number): boolean => {
  const allStarPoints: StarPoints | undefined = boardStarPoints.find(
    point => point.boardSize === boardSize
  );
  if (allStarPoints === undefined){
    console.warn(`StarPoints data is not defined for board size ${boardSize}`);
    return false;
  }
  return allStarPoints.stars.some(point => {
    return point[0] === gridX + 1 && point[1] === gridY + 1;
  });
}