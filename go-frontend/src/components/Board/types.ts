import { StoneType } from 'components/Stone/Stone';
import { PointClickHandler } from 'components/Point/Point';

export interface BoardProps {
  boardSize: number;
  boardData: StoneType[][];
  isCurrentTurn: boolean;
  isMyTurn: boolean;
  onPointClick?: PointClickHandler;
} 