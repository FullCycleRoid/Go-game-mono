import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TurnIndicator from './TurnIndicator';
import { StoneType } from 'components/Stone/Stone';

const newPlayer = (playerName: string, playerColor: string) => ({ playerName, playerColor });

describe('<TurnIndicator />', () => {
  test('it should mount', () => {

    const testPlayers = [
      newPlayer('Player 1', 'black'), 
      newPlayer('Player 2', 'white')
    ];

    render(<TurnIndicator turn={false} players={testPlayers} />);
    
    const turnIndicator = screen.getByTestId('TurnIndicator');

    expect(turnIndicator).toBeInTheDocument();
  });
});