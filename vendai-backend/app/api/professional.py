from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from app.core.database import get_database
from app.api.deps import get_current_user
from bson import ObjectId
from app.api.auth import build_user_response

router = APIRouter()


class ProfessionalRegister(BaseModel):
    userId: str
    specialty: str = Field(..., min_length=1)
    experience: int = Field(..., ge=0)
    bio: Optional[str] = ""


@router.post("/register")
async def register_professional(
    data: ProfessionalRegister,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    if str(current_user["_id"]) != data.userId and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403, detail="Sem permissão para alterar este usuário")

    user_doc = await db.users.find_one({"_id": ObjectId(data.userId)})
    if not user_doc:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    professional_info = {
        "specialty": data.specialty,
        "experience": data.experience,
        "bio": data.bio
    }

    await db.users.update_one(
        {"_id": ObjectId(data.userId)},
        {"$set": {"professionalInfo": professional_info}}
    )

    # Refresh doc
    user_doc = await db.users.find_one({"_id": ObjectId(data.userId)})

    return {
        "message": "Perfil profissional registrado com sucesso",
        "user": build_user_response(user_doc)
    }
