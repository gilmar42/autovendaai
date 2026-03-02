@echo off
echo Iniciando VendAI - Plataforma SaaS Premium...

:: Finaliza processos anteriores
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul

:: Inicia o Backend FastAPI
start "VendAI Backend" cmd /c "cd vendai-backend && python -m uvicorn main:app --reload --port 8000"

:: Inicia o Frontend Next.js
echo Aguardando inicializacao do Backend...
timeout /t 5
start "VendAI Frontend" cmd /c "cd vendai-frontend && npm run dev"

echo.
echo ==========================================
echo VEND-AI ESTÁ INICIALIZANDO!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://127.0.0.1:3000
echo ==========================================
echo Aguarde a mensagem "Compiled successfully" no terminal do Frontend.
pause
