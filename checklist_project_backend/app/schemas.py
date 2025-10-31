from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=256)
    nickname: str = Field(min_length=1, max_length=50)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    nickname: str | None = None

class CheckinCreate(BaseModel):
    message: str = Field(min_length=1, max_length=500)
    mood: str = Field(pattern="^(happy|neutral|sad)$")

class CheckinMineOut(BaseModel):
    id: int
    message: str
    mood: str
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True

class CheckinPublicOut(BaseModel):
    id: int
    nickname: str
    message: str
    mood: str
    created_at: datetime