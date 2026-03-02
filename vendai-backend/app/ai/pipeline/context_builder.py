from pydantic import BaseModel
from typing import List, Optional

class AIContext(BaseModel):
    company_id: str
    user_id: Optional[str] = None
    last_messages: List[dict] = []
    metadata: dict = {}

async def build_context(company_id: str, user_id: str, messages: List[dict]) -> AIContext:
    # No MVP, apenas retornamos o que recebemos. 
    # No futuro, buscaremos histórico no banco/Redis.
    return AIContext(
        company_id=company_id,
        user_id=user_id,
        last_messages=messages[-5:] # Últimas 5 mensagens
    )
