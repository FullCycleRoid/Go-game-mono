import TurnIndicator from './TurnIndicator';
import { StoneType } from 'components/Stone/Stone';

export default {
  component: TurnIndicator
};

const newPlayer = (playerName: string, playerColor: string) => ({ playerName, playerColor });

const testPlayers = [
  newPlayer('Player 1', 'black'), 
  newPlayer('Player 2', 'white')
];

export const Player1Turn = {
  args: {
    turn: false,
    players: testPlayers
  },
  name: 'Player 1 Turn'
};

export const Player2Turn = {
  args: {
    turn: true,
    players: testPlayers
  },
  name: 'Player 2 Turn'
};
