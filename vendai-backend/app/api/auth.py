from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import UserCreate, UserLogin, UserResponse, Token, ProfessionalInfo
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.database import get_database
from datetime import datetime
from bson import ObjectId

router = APIRouter()


def build_user_response(user_doc: dict) -> dict:
    return {
        "id": str(user_doc["_id"]),
        "name": user_doc["name"],
        "email": user_doc["email"],
        "role": user_doc.get("role", "user"),
        "professionalInfo": user_doc.get("professionalInfo"),
        "created_at": user_doc.get("createdAt", "")
    }


@router.post("/register", response_model=Token)
async def register(user_in: UserCreate, db=Depends(get_database)):
    email_lower = user_in.email.lower()
    existing_user = await db.users.find_one({"email": email_lower})
    if existing_user:
        raise HTTPException(status_code=409, detail="Usuário já cadastrado")

    user_data = {
        "name": user_in.name,
        "email": email_lower,
        "password": get_password_hash(user_in.password),
        "role": user_in.role,
        "createdAt": datetime.now().isoformat()
    }

    result = await db.users.insert_one(user_data)
    user_data["_id"] = result.inserted_id

    token_payload = {
        "id": str(user_data["_id"]),
        "email": user_data["email"],
        "role": user_data["role"]
    }

    token = create_access_token(data=token_payload)

    return {
        "token": token,
        "user": build_user_response(user_data)
    }


@router.post("/login", response_model=Token)
async def login(user_in: UserLogin, db=Depends(get_database)):
    email_lower = user_in.email.lower()
    user_doc = await db.users.find_one({"email": email_lower})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    if not verify_password(user_in.password, user_doc["password"]):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token_payload = {
        "id": str(user_doc["_id"]),
        "email": user_doc["email"],
        "role": user_doc.get("role", "user")
    }

    token = create_access_token(data=token_payload)

    return {
        "token": token,
        "user": build_user_response(user_doc)
    }
