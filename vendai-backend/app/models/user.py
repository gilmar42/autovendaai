from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict


class ProfessionalInfo(BaseModel):
    specialty: Optional[str] = None
    experience: Optional[int] = None
    bio: Optional[str] = None


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "user"


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    professionalInfo: Optional[ProfessionalInfo] = None
    created_at: str


class Token(BaseModel):
    token: str
    user: UserResponse
