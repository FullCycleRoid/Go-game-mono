import React from 'react';
import { StoneType } from 'components/Stone/Stone';

export type PointClickHandler = (
  e: React.MouseEvent<HTMLButtonElement>,
  gridX: number,
  gridY: number
) => void;

export interface PointProps {
  stoneType?: StoneType;
  boardSize: number;
  gridX: number;
  gridY: number;
  turn: boolean;
  isMyTurn: boolean;
  onClickPoint?: PointClickHandler;
} 