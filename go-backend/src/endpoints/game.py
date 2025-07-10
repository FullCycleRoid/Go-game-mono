from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...src import crud, schemas
from ...src.database import get_db
from ...src.services import go_game_service
from ...src.schemas import GoGameState

router = APIRouter()


@router.post("/", response_model=schemas.GameResponse)
def create_game(game: schemas.GameCreate, db: Session = Depends(get_db)):
    player = crud.get_player(db, game.creator_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")

    db_game = crud.create_game(db, game.creator_id)
    return db_game


@router.get("/{game_id}", response_model=schemas.GameResponse)
def read_game(game_id: str, db: Session = Depends(get_db)):
    db_game = crud.get_game(db, game_id)
    if not db_game:
        raise HTTPException(status_code=404, detail="Game not found")
    return db_game


@router.post("/{game_id}/move", response_model=schemas.GameResponse)
def make_move_in_game(
    game_id: str, move: schemas.MoveRequest, db: Session = Depends(get_db)
):
    db_game = crud.get_game(db, game_id)
    if not db_game:
        raise HTTPException(status_code=404, detail="Game not found")

    # Проверка участия игрока
    player_in_game = any(p.player_id == move.player_id for p in db_game.players)
    if not player_in_game:
        raise HTTPException(status_code=403, detail="Player not in game")

    # Получаем цвет игрока
    player_color = None
    for player in db_game.players:
        if player.player_id == move.player_id:
            player_color = player.player_color
            break

    if not player_color:
        raise HTTPException(status_code=400, detail="Player color not found")

    # Проверяем, что это ход текущего игрока
    game_state = GoGameState(**db_game.state)
    if game_state.current_player != player_color:
        raise HTTPException(status_code=400, detail="Not player's turn")

    try:
        # Обновляем состояние игры
        updated_state = go_game_service.make_move(
            game_state, player_color, move.x, move.y
        )
        
        # Проверяем окончание игры
        updated_state = go_game_service.check_game_end(updated_state)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Сохраняем обновленное состояние
    updated_game = crud.update_game_state(db, game_id, updated_state)

    return updated_game


@router.post("/{game_id}/join", response_model=schemas.GameResponse)
def join_game(game_id: str, player_id: str, db: Session = Depends(get_db)):
    db_game = crud.get_game(db, game_id)
    if not db_game:
        raise HTTPException(status_code=404, detail="Game not found")

    # Проверяем, что игрок еще не в игре
    player_in_game = any(p.player_id == player_id for p in db_game.players)
    if player_in_game:
        raise HTTPException(status_code=400, detail="Player already in game")

    # Проверяем, что есть место для второго игрока
    if len(db_game.players) >= 2:
        raise HTTPException(status_code=400, detail="Game is full")

    # Добавляем игрока как белого
    crud.add_player_to_game(db, game_id, player_id, "white")
    
    # Обновляем статус игры
    db_game.status = "active"
    db.commit()
    db.refresh(db_game)

    return db_game 