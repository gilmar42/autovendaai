from fastapi import APIRouter, Depends
from app.middleware.tenant import get_current_tenant
from app.core.database import get_database
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class AISettingsUpdate(BaseModel):
    behavior: str
    persuasion: int

@router.get("/")
async def get_settings(
    tenant_id: str = Depends(get_current_tenant),
    db=Depends(get_database)
):
    doc = await db.ai_settings.find_one({"company_id": tenant_id})
    if not doc:
        return {
            "behavior": "Consultor Proativo (Foco em Conversão)",
            "persuasion": 50,
        }
    
    doc["id"] = str(doc.pop("_id"))
    return doc

@router.post("/")
async def update_settings(
    settings_in: AISettingsUpdate,
    tenant_id: str = Depends(get_current_tenant),
    db=Depends(get_database)
):
    update_data = {
        "behavior": settings_in.behavior,
        "persuasion": settings_in.persuasion,
        "company_id": tenant_id,
        "updated_at": datetime.now().isoformat()
    }

    await db.ai_settings.update_one(
        {"company_id": tenant_id},
        {"$set": update_data},
        upsert=True
    )

    doc = await db.ai_settings.find_one({"company_id": tenant_id})
    doc["id"] = str(doc.pop("_id"))
    return doc
