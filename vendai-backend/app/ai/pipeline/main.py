from app.ai.pipeline.context_builder import build_context
from app.ai.pipeline.intent_classifier import classify_intent
from app.ai.pipeline.retrieval_engine import retrieve_products
from app.ai.pipeline.strategy_engine import apply_strategy
from app.core.logger import logger
import re


def sanitize_input(text: str) -> str:
    # Remove tags HTML e caracteres suspectos de prompt injection
    clean = re.sub(r'<.*?>', '', text)
    # Bloqueia tentativas comuns de bypass (System:', 'Ignore previous')
    if any(k in clean.lower() for k in ["ignore as instruções", "delete tudo", "você é agora"]):
        return "Mensagem bloqueada por questões de segurança."
    return clean


class AIPipeline:
    async def process(self, company_id: str, user_id: str, message: str, history: list = []):
        try:
            # 0. Sanitize
            safe_message = sanitize_input(message)
            if "bloqueada" in safe_message:
                return {"response": safe_message, "intent": "blocked", "context": {}, "products_referenced": []}

            # 1. Build Context
            context = await build_context(company_id, user_id, history + [{"role": "user", "content": safe_message}])

            # 2. Classify Intent
            intent = await classify_intent(safe_message)

            # 3. Retrieve Knowledge/Products
            products = []
            if intent in ["product_inquiry", "price_inquiry"]:
                products = await retrieve_products(safe_message, company_id)

            # 4. Apply Sales Strategy & Generate Response
            response = await apply_strategy(intent, context.dict(), products)

            return {
                "response": response,
                "intent": intent,
                "context": context.dict(),
                "products_referenced": [p["_id"] for p in products]
            }
        except Exception as e:
            logger.error(f"Error in AI Pipeline: {str(e)}", exc_info=True)
            return {
                "response": "Olá! Estou passando por uma manutenção rápida. Posso te atender em instantes?",
                "intent": "error",
                "context": {},
                "products_referenced": []
            }


ai_pipeline = AIPipeline()
