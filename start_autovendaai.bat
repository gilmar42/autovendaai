@echo off
echo Iniciando AutovendaAI...
echo Por favor, mantenha estas janelas abertas.

REM Iniciar backend
start cmd /k "cd /d %~dp0backend && node index.js"

REM Iniciar frontend
timeout /t 5 /nobreak
start cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo Janelas de terminal abertas. Verifique se ha erros nelas.
echo http://localhost:3000
pause
