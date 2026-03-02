from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import contextvars

# Contexto para armazenar o company_id durante a requisição
tenant_id_ctx = contextvars.ContextVar("tenant_id", default=None)

class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Em um sistema real, extraímos do JWT. 
        # Para o MVP, aceitaremos um header X-Tenant-Id para testes rápidos.
        tenant_id = request.headers.get("X-Tenant-Id")
        
        # Token para armazenar o estado do contexto
        token = tenant_id_ctx.set(tenant_id)
        
        try:
            response = await call_next(request)
        finally:
            tenant_id_ctx.reset(token)
            
        return response

def get_current_tenant():
    tenant_id = tenant_id_ctx.get()
    if not tenant_id:
        # No MVP, podemos permitir 'public' ou lançar erro
        return "public"
    return tenant_id
