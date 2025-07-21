import React from 'react';
import styles from './TurnIndicator.module.css';
import { IPlayer, TurnIndicatorProps } from './types';

/**
 * Displays which player's turn it is.
 */
const TurnIndicator = ({turn, players}: TurnIndicatorProps) => {
  return (
    <h2 className={styles.turnIndicator} data-testid="TurnIndicator">
      <span className={styles.label}>Turn:</span>
      <span> { !turn ? '\u26ab' : '\u26aa' }</span>
      <strong>{ !turn ? players[0].playerName : players[1].playerName }</strong>
    </h2>
  )
};

export default TurnIndicator;
