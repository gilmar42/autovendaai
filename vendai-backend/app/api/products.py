from fastapi import APIRouter, Depends, HTTPException, status
from app.models.product import ProductCreate, Product
from app.middleware.tenant import get_current_tenant
from app.core.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()


@router.post("/", response_model=Product)
async def create_product(
    product_in: ProductCreate,
    tenant_id: str = Depends(get_current_tenant),
    db=Depends(get_database)
):
    # Manual data preparation
    now = datetime.now().isoformat()
    product_data = {
        "name": product_in.name,
        "description": product_in.description,
        "price": product_in.price,
        "stock": product_in.stock,
        "company_id": tenant_id,
        "created_at": now,
        "updated_at": now
    }

    result = await db.products.insert_one(product_data)
    # Manual ID mapping
    product_data["id"] = str(result.inserted_id)
    return product_data


@router.get("/")
async def list_products(
    tenant_id: str = Depends(get_current_tenant),
    db=Depends(get_database)
):
    cursor = db.products.find({"company_id": tenant_id})
    products = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        doc["created_at"] = str(doc.get("created_at", ""))
        doc["updated_at"] = str(doc.get("updated_at", ""))
        products.append(doc)
    return products


@router.get("/{product_id}", response_model=Product)
async def get_product(
    product_id: str,
    tenant_id: str = Depends(get_current_tenant),
    db=Depends(get_database)
):
    doc = await db.products.find_one({"_id": ObjectId(product_id), "company_id": tenant_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    doc["id"] = str(doc.pop("_id"))
    doc["created_at"] = str(doc.get("created_at", ""))
    doc["updated_at"] = str(doc.get("updated_at", ""))
    return doc


@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_in: ProductCreate,
    tenant_id: str = Depends(get_current_tenant),
    db=Depends(get_database)
):
    now = datetime.now().isoformat()
    update_data = {
        "name": product_in.name,
        "description": product_in.description,
        "price": product_in.price,
        "stock": product_in.stock,
        "updated_at": now
    }

    result = await db.products.update_one(
        {"_id": ObjectId(product_id), "company_id": tenant_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    doc = await db.products.find_one({"_id": ObjectId(product_id)})
    doc["id"] = str(doc.pop("_id"))
    doc["created_at"] = str(doc.get("created_at", ""))
    doc["updated_at"] = str(doc.get("updated_at", ""))
    return doc


@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    tenant_id: str = Depends(get_current_tenant),
    db=Depends(get_database)
):
    result = await db.products.delete_one({"_id": ObjectId(product_id), "company_id": tenant_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return {"message": "Produto deletado com sucesso"}
