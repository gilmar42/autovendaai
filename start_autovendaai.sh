#!/bin/bash
# Script para iniciar backend e frontend do AutovendaAI automaticamente (Linux/Mac)

# Iniciar backend
(cd backend && npx nodemon index.js &)

# Iniciar frontend
(cd frontend && npm start &)

echo "Backend e frontend iniciados em segundo plano."
