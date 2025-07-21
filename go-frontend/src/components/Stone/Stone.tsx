import React from 'react';
import styles from './Stone.module.css';
import { StoneType, StoneProps } from './types';

/**
 * The playing pieces in the game. Stones are either black or white. The component does not render anything with the Empty StoneType.
 */
const Stone = ({stoneType = StoneType.Empty}: StoneProps) => {
  if (stoneType === StoneType.Empty){
    return null;
  }
  return (
    <figure className={stoneType === StoneType.Black ? styles.default : styles.white} data-testid="Stone"></figure>
  );
};

export default Stone;
export { StoneType };
