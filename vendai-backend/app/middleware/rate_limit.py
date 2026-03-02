from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import time
from collections import defaultdict

# Cache em memória simples para o MVP. Em produção, usar Redis.
rate_limit_store = defaultdict(list)


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()

        # Mantém apenas requisições dos últimos 60 segundos
        rate_limit_store[client_ip] = [
            t for t in rate_limit_store[client_ip] if current_time - t < 60]

        # Limite: 60 requisições por minuto
        if len(rate_limit_store[client_ip]) >= 60:
            raise HTTPException(
                status_code=429, detail="Muitas requisições. Tente novamente em um minuto.")

        rate_limit_store[client_ip].append(current_time)

        response = await call_next(request)
        return response
