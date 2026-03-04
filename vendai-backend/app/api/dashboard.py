from fastapi import APIRouter, Depends
from app.middleware.tenant import get_current_tenant
from app.core.database import get_database

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(
    tenant_id: str = Depends(get_current_tenant),
    db=Depends(get_database)
):
    pipeline = [
        {"$match": {"company_id": tenant_id}},
        {"$group": {"_id": None, "total": {"$sum": "$total_price"}}}
    ]
    sales_result = await db.sales.aggregate(pipeline).to_list(1)
    total_sales = sales_result[0]["total"] if sales_result else 0

    sales_count = await db.sales.count_documents({"company_id": tenant_id})
    conversion_rate = 24.5
    hours_saved = 180
    
    cursor = db.sales.find({"company_id": tenant_id}).sort("date", -1).limit(4)
    activities = []
    async for doc in cursor:
        activities.append({
            "id": str(doc["_id"]),
            "message": "Nova venda registrada",
            "date": doc.get("date", ""),
            "amount": doc.get("total_price", 0)
        })

    return {
        "stats": [
            {"label": "Vendas Totais", "value": f"R$ {total_sales:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."), "trend": "+12%"},
            {"label": "Conversão IA", "value": f"{conversion_rate}%", "trend": "+5%"},
            {"label": "Leads Ativos", "value": f"{sales_count * 5}", "trend": "+18%"},
            {"label": "Economia (Horas)", "value": f"{hours_saved}h", "trend": "+25%"},
        ],
        "activities": activities
    }
