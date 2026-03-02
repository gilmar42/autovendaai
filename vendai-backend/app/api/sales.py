from fastapi import APIRouter, Depends, HTTPException
from app.models.sale import SaleCreate, Sale
from app.middleware.tenant import get_current_tenant
from app.core.database import get_database
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=Sale)
async def create_sale(
    sale_in: SaleCreate,
    tenant_id: str = Depends(get_current_tenant),
    db = Depends(get_database)
):
    sale_dict = sale_in.dict()
    sale_dict["company_id"] = tenant_id
    sale_dict["date"] = datetime.now()
    
    # Valida estoque
    product = await db.products.find_one({"_id": sale_in.product_id, "company_id": tenant_id})
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    if product["stock"] < sale_in.quantity:
        raise HTTPException(status_code=400, detail="Estoque insuficiente")
    
    # Registra venda e atualiza estoque
    result = await db.sales.insert_one(sale_dict)
    await db.products.update_one(
        {"_id": sale_in.product_id},
        {"$inc": {"stock": -sale_in.quantity}}
    )
    
    sale_dict["_id"] = str(result.inserted_id)
    return sale_dict

@router.get("/")
async def list_sales(
    tenant_id: str = Depends(get_current_tenant),
    db = Depends(get_database)
):
    cursor = db.sales.find({"company_id": tenant_id})
    sales = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        sales.append(doc)
    return sales
