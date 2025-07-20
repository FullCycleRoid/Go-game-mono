from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src import crud, schemas
from src.database import get_db

router = APIRouter()


@router.post("/", response_model=schemas.InviteResponse)
def create_invite(invite: schemas.InviteCreate, db: Session = Depends(get_db)):
    db_invite = crud.create_invite(db, invite.game_id, invite.player_id)
    return db_invite


@router.get("/{invite_id}", response_model=schemas.InviteResponse)
def read_invite(invite_id: str, db: Session = Depends(get_db)):
    db_invite = crud.get_invite(db, invite_id)
    if not db_invite:
        raise HTTPException(status_code=404, detail="Invite not found")
    return db_invite


@router.post("/{invite_id}/accept", response_model=schemas.GameResponse)
def accept_invite(invite_id: str, player_id: str, db: Session = Depends(get_db)):
    db_invite = crud.get_invite(db, invite_id)
    if not db_invite:
        raise HTTPException(status_code=404, detail="Invite not found")
    
    if db_invite.status != "pending":
        raise HTTPException(status_code=400, detail="Invite already processed")
    
    # Обновляем статус приглашения
    crud.update_invite_status(db, invite_id, "accepted")
    
    # Добавляем игрока в игру
    db_game = crud.get_game(db, db_invite.game_id)
    if not db_game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    # Добавляем игрока как белого
    crud.add_player_to_game(db, db_invite.game_id, player_id, "white")
    
    # Обновляем статус игры
    db_game.status = "active"
    db.commit()
    db.refresh(db_game)
    
    return db_game


@router.post("/{invite_id}/decline")
def decline_invite(invite_id: str, db: Session = Depends(get_db)):
    db_invite = crud.get_invite(db, invite_id)
    if not db_invite:
        raise HTTPException(status_code=404, detail="Invite not found")
    
    crud.update_invite_status(db, invite_id, "declined")
    return {"message": "Invite declined"} 