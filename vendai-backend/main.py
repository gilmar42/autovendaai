from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.middleware.tenant import TenantMiddleware
from app.middleware.security import SecurityHeadersMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.api.products import router as product_router
from app.api.ai import router as ai_router
from app.api.sales import router as sales_router
from app.core.config import settings
from app.core.logger import setup_logging, logger as vendai_logger

# Initialize Logging
setup_logging()

app = FastAPI(title="VendAI API", version="0.1.0")

# Security and Middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(TenantMiddleware)
app.add_middleware(
    CORSMiddleware,
    # More restrictive for prod hardening
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    vendai_logger.error(f"Erro não tratado: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Erro Interno do Servidor",
                 "detail": "Ocorreu um erro inesperado no processamento."}
    )

app.include_router(
    product_router, prefix=f"{settings.API_V1_STR}/products", tags=["products"])
app.include_router(ai_router, prefix=f"{settings.API_V1_STR}/ai", tags=["ai"])
app.include_router(
    sales_router, prefix=f"{settings.API_V1_STR}/sales", tags=["sales"])


@app.get("/")
async def root():
    return {"message": "API VendAI está em execução", "version": "0.1.0"}


@app.get("/health")
async def health_check():
    return {"status": "saudável"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
