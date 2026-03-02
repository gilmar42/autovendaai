from app.core.database import get_database
from typing import List

async def retrieve_products(query: str, company_id: str) -> List[dict]:
    db = await get_database()
    # No MVP, pesquisa textual simples no nome/descrição. 
    # V2 usará embeddings/RAG.
    cursor = db.products.find({
        "company_id": company_id,
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"description": {"$regex": query, "$options": "i"}}
        ]
    })
    products = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        products.append(doc)
    return products
