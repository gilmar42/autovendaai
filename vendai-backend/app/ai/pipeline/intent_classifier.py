from enum import Enum

class Intent(str, Enum):
    GREETING = "greeting"
    PRODUCT_INQUIRY = "product_inquiry"
    PRICE_INQUIRY = "price_inquiry"
    CHECKOUT = "checkout"
    SUPPORT = "support"
    UNKNOWN = "unknown"

async def classify_intent(message: str) -> Intent:
    # Heurística simples para MVP. No futuro, usar LLM para classificar.
    msg = message.lower()
    if any(k in msg for k in ["oi", "olá", "bom dia"]):
        return Intent.GREETING
    if any(k in msg for k in ["quanto", "preço", "valor"]):
        return Intent.PRICE_INQUIRY
    if any(k in msg for k in ["comprar", "pagar", "fechar"]):
        return Intent.CHECKOUT
    if any(k in msg for k in ["produto", "tem", "mostra"]):
        return Intent.PRODUCT_INQUIRY
    
    return Intent.UNKNOWN
