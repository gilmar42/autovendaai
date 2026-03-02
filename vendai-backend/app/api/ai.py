from fastapi import APIRouter, Depends, Body
from app.ai.pipeline.main import ai_pipeline
from app.middleware.tenant import get_current_tenant
from typing import List

router = APIRouter()

@router.post("/chat")
async def chat(
    message: str = Body(..., embed=True),
    history: List[dict] = Body([], embed=True),
    tenant_id: str = Depends(get_current_tenant),
    user_id: str = "anonymous" # MVP logic
):
    result = await ai_pipeline.process(
        company_id=tenant_id,
        user_id=user_id,
        message=message,
        history=history
    )
    return result
