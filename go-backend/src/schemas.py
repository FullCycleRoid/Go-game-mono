from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, field_validator


class PlayerBase(BaseModel):
    telegram_id: str
    username: Optional[str] = None
    first_name: str
    last_name: Optional[str] = None


class PlayerCreate(PlayerBase):
    pass


class Player(PlayerBase):
    created_at: datetime

    class Config:
        from_attributes = True


class GoGameState(BaseModel):
    board: List[List[Optional[str]]] = []  # 9x9 board, null/black/white
    current_player: str = "black"  # 'black' or 'white'
    captured_black: int = 0
    captured_white: int = 0
    last_move: Optional[List[int]] = None  # [x, y]
    ko_protection: Optional[List[List[Optional[str]]]] = None
    is_game_over: bool = False
    winner: Optional[str] = None


class GameBase(BaseModel):
    id: str
    state: GoGameState
    status: str
    winner_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class GameCreate(BaseModel):
    creator_id: str


class GamePlayerBase(BaseModel):
    game_id: str
    player_id: str
    is_creator: bool
    player_color: str


class GamePlayerResponse(GamePlayerBase):
    player: Player

    class Config:
        from_attributes = True


class GameResponse(GameBase):
    players: List[GamePlayerResponse] = []

    class Config:
        from_attributes = True


class MoveRequest(BaseModel):
    player_id: str
    x: int
    y: int

    @field_validator("x", "y")
    def coordinates_must_be_valid(cls, v):
        if v < 0 or v > 8:
            raise ValueError("Coordinates must be between 0 and 8")
        return v


class InviteBase(BaseModel):
    game_id: str
    player_id: str


class InviteCreate(InviteBase):
    pass


class InviteResponse(InviteBase):
    id: str
    status: str
    created_at: datetime
    game: GameResponse
    player: Player

    class Config:
        from_attributes = True


class GameUpdateMessage(BaseModel):
    type: str
    game: GameResponse 