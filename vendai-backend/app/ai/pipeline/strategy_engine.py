from app.ai.pipeline.intent_classifier import Intent

async def apply_strategy(intent: Intent, context: dict, products: list) -> str:
    # MVP: Lógica baseada em regras.
    if intent == Intent.GREETING:
        return "Olá! Eu sou o assistente virtual da VendAI. Como posso te ajudar hoje?"
    
    if intent == Intent.PRODUCT_INQUIRY or intent == Intent.PRICE_INQUIRY:
        if not products:
            return "Infelizmente não encontrei o que você procura. Gostaria de ver outros modelos?"
        
        prod = products[0]
        return f"Temos o {prod['name']} por apenas R$ {prod['price']:.2f}. Temos {prod['stock']} em estoque. Deseja fechar o pedido?"
    
    if intent == Intent.CHECKOUT:
        return "Perfeito! Vou preparar o seu link de pagamento agora mesmo. Um momento..."
    
    return "Entendi. Pode me dar mais detalhes para que eu possa te ajudar melhor?"
