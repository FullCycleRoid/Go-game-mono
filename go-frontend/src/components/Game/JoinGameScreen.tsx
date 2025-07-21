import React from 'react';
import { JoinGameScreenProps } from './types';
import JoinGame from '../JoinGame/JoinGame';

const JoinGameScreen: React.FC<JoinGameScreenProps> = ({ onGameJoined }) => (
  <JoinGame onGameJoined={onGameJoined} />
);

export default JoinGameScreen; 