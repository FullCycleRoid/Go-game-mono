export interface IPlayer {
  playerName: string;
  playerColor: string;
}

export interface TurnIndicatorProps {
  turn: boolean;
  players: IPlayer[];
} 