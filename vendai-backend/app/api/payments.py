from fastapi import APIRouter

router = APIRouter()


@router.post("/pay")
async def process_payment():
    # Placeholder para integração de pagamentos (Stripe/PagSeguro/MercadoPago)
    return {"message": "Pagamento processado (mock)"}
