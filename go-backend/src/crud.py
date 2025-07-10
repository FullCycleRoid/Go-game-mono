import uuid
from sqlalchemy.orm import Session
from ..src import models, schemas
from ..src.services.go_game_service import initialize_game_state


def get_player(db: Session, telegram_id: str):
    return db.query(models.Player).filter(models.Player.telegram_id == telegram_id).first()


def create_player(db: Session, player: schemas.PlayerCreate):
    db_player = models.Player(**player.dict())
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player


def get_game(db: Session, game_id: str):
    return db.query(models.Game).filter(models.Game.id == game_id).first()


def create_game(db: Session, creator_id: str):
    game_id = str(uuid.uuid4())
    
    # Создаем игровое состояние
    game_state = initialize_game_state()
    
    # Создаем игру
    db_game = models.Game(
        id=game_id,
        state=game_state.dict(),
        status="waiting"
    )
    db.add(db_game)
    
    # Добавляем создателя как черного игрока
    db_game_player = models.GamePlayer(
        game_id=game_id,
        player_id=creator_id,
        is_creator=True,
        player_color="black"
    )
    db.add(db_game_player)
    
    db.commit()
    db.refresh(db_game)
    return db_game


def update_game_state(db: Session, game_id: str, game_state: schemas.GoGameState):
    db_game = get_game(db, game_id)
    if db_game:
        db_game.state = game_state.dict()
        db.commit()
        db.refresh(db_game)
    return db_game


def add_player_to_game(db: Session, game_id: str, player_id: str, player_color: str):
    db_game_player = models.GamePlayer(
        game_id=game_id,
        player_id=player_id,
        is_creator=False,
        player_color=player_color
    )
    db.add(db_game_player)
    db.commit()
    db.refresh(db_game_player)
    return db_game_player


def get_invite(db: Session, invite_id: str):
    return db.query(models.Invite).filter(models.Invite.id == invite_id).first()


def create_invite(db: Session, game_id: str, player_id: str):
    invite_id = str(uuid.uuid4())
    db_invite = models.Invite(
        id=invite_id,
        game_id=game_id,
        player_id=player_id,
        status="pending"
    )
    db.add(db_invite)
    db.commit()
    db.refresh(db_invite)
    return db_invite


def update_invite_status(db: Session, invite_id: str, status: str):
    db_invite = get_invite(db, invite_id)
    if db_invite:
        db_invite.status = status
        db.commit()
        db.refresh(db_invite)
    return db_invite 