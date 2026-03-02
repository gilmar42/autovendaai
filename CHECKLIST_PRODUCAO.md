# Checklist de Produção

1. **Variáveis de ambiente**
   - Configure .env com MONGO_URI, JWT_SECRET, PORT, tokens de APIs externas.

2. **Build do frontend**
   - Execute: `npm run build` na pasta frontend.
   - O build será gerado em `frontend/build`.

3. **Deploy do backend**
   - Use PM2, Docker ou outro gerenciador para rodar o backend.
   - Exemplo PM2: `pm2 start index.js --name autovenda-backend`
   - Exemplo Docker:
     ```dockerfile
     FROM node:18
     WORKDIR /app
     COPY . .
     RUN npm install
     CMD ["node", "index.js"]
     ```

4. **Deploy do frontend**
   - Sirva o build estático com Nginx, Apache ou serviço cloud.
   - Exemplo Nginx:
     ```nginx
     server {
       listen 80;
       server_name seu_dominio.com;
       root /caminho/para/frontend/build;
       index index.html;
       location / {
         try_files $uri $uri/ /index.html;
       }
     }
     ```

5. **Testes**
   - Teste todos endpoints, autenticação, integrações externas.
   - Valide usabilidade e performance.

6. **Logs e monitoramento**
   - Configure logs (PM2, Docker, cloud).
   - Use ferramentas como Sentry, Loggly, Datadog para monitorar erros.

7. **Segurança**
   - Habilite HTTPS.
   - Proteja variáveis de ambiente e tokens.
   - Revise permissões de acesso.

8. **Backup e escalabilidade**
   - Configure backups automáticos do MongoDB.
   - Prepare para escalar horizontalmente (load balancer, múltiplos containers).

---

# Scripts de Build e Deploy

## Backend
- `pm2 start index.js --name autovenda-backend`
- `docker build -t autovenda-backend . && docker run -d -p 5000:5000 autovenda-backend`

## Frontend
- `npm run build`
- Deploy o conteúdo de `build/` em servidor estático

---

Sistema pronto para produção. Siga o checklist para garantir estabilidade, segurança e performance.

---

## Validação de Logs (Fonte vs Build)

- ✅ **Código-fonte limpo:** não há ocorrências de `console.log`, `console.warn`, `console.info` ou `console.error` no código da aplicação (`backend` e `frontend/src`).
- ✅ **Backend padronizado:** logs do runtime usam logger central e testes executam com saída limpa.
- ℹ️ **Build do frontend:** o artefato em `frontend/build` contém logs `console.*` de bibliotecas/vendor empacotadas (comportamento esperado de bundle), sem impacto na padronização do código-fonte.
