import os
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
from .models import Base, User, Checkin
from .schemas import (
    RegisterIn, LoginIn, TokenOut,
    CheckinCreate, CheckinMineOut, CheckinPublicOut,
)
from .auth import hash_password, verify_password, create_access_token
from .deps import engine, get_db, get_current_user_id
from dotenv import load_dotenv
load_dotenv()
app = FastAPI(title="Check-In Board API")

# CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB init (simple)
Base.metadata.create_all(bind=engine)

# ------------ Auth ------------
@app.post("/api/auth/register", status_code=201)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    exists = db.scalar(select(User).where(User.email == data.email))
    if exists:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=data.email, password_hash=hash_password(data.password), nickname=data.nickname)
    db.add(user)
    db.commit()
    return {"message": "registered"}


@app.post("/api/auth/login", response_model=TokenOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == data.email))
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token(str(user.id))
    return {"access_token": token, "nickname": user.nickname}

# -------- Public feed ---------
@app.get("/api/checkins", response_model=list[CheckinPublicOut])
def list_public_checkins(db: Session = Depends(get_db)):
    rows = db.execute(
        select(Checkin.id, Checkin.message, Checkin.mood, Checkin.created_at, User.nickname)
        .join(User, User.id == Checkin.user_id)
        .order_by(Checkin.id.desc()).limit(50)
    ).all()
    return [
        {"id": r.id, "nickname": r.nickname, "message": r.message, "mood": r.mood, "created_at": r.created_at}
        for r in rows
    ]

# --------- Me (CRUD) ----------
@app.get("/api/me/checkins", response_model=list[CheckinMineOut])
def list_my_checkins(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    rows = db.scalars(select(Checkin).where(Checkin.user_id == user_id).order_by(Checkin.id.desc())).all()
    return rows

@app.post("/api/me/checkins", response_model=CheckinMineOut, status_code=201)
def create_my_checkin(payload: CheckinCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    c = Checkin(user_id=user_id, message=payload.message, mood=payload.mood)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@app.put("/api/me/checkins/{checkin_id}", response_model=CheckinMineOut)
def update_my_checkin(checkin_id: int, payload: CheckinCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    c = db.get(Checkin, checkin_id)
    if not c or c.user_id != user_id:
        raise HTTPException(status_code=404, detail="Not found")
    c.message = payload.message
    c.mood = payload.mood
    c.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(c)
    return c

@app.delete("/api/me/checkins/{checkin_id}")
def delete_my_checkin(checkin_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    c = db.get(Checkin, checkin_id)
    if not c or c.user_id != user_id:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(c)
    db.commit()
    return {"ok": True}

# Health
@app.get("/health")
def healthz():
    return {"ok": True}