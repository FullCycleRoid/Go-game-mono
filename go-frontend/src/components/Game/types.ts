export interface WelcomeScreenProps {
  onCreate: () => void;
  onJoin: () => void;
}

export interface CreateGameScreenProps {
  onGameCreated: (gameId: string) => void;
}

export interface JoinGameScreenProps {
  onGameJoined: (gameId: string) => void;
}

export interface PlayingGameScreenProps {
  // Здесь можно добавить все необходимые пропсы для игровой фазы
} 