import React from 'react';
import { CreateGameScreenProps } from './types';
import CreateGame from '../CreateGame/CreateGame';

const CreateGameScreen: React.FC<CreateGameScreenProps> = ({ onGameCreated }) => (
  <CreateGame onGameCreated={onGameCreated} />
);

export default CreateGameScreen; 