# AutovendaAI - Documentação Completa

## Visão Geral
Sistema de vendas automáticas com arquitetura moderna, módulos de IA, integração com modelos externos, configuração de regras, métricas e usabilidade avançada.

## Backend
- Node.js/Express
- MongoDB
- JWT para autenticação
- Camadas: rotas, serviços, modelos, middleware
- Módulos IA: recomendação, preditivo, fraude, integração externa

## Frontend
- React
- Material UI
- Axios para requisições
- Navegação por páginas: Login, Cadastro, Dashboard, Produtos, Vendas, Estoque, Relatórios, Engine IA

## Como rodar

### Backend
1. Instale dependências: `npm install`
2. Configure o arquivo `.env`:
   - MONGO_URI=mongodb://localhost:27017/autovendaai
   - JWT_SECRET=secreto123
   - PORT=5000
3. Inicie: `node index.js` ou `nodemon index.js`

### Frontend
1. Instale dependências: `npm install`
2. Inicie: `npm start`

## Funcionalidades
- Cadastro e autenticação de usuários
- Cadastro e gestão de produtos (admin)
- Gestão de estoque
- Registro e listagem de vendas
- Relatórios detalhados e exportação CSV
- Integração de pagamentos (mock)
- Logs de operações críticas
- Agendamento de vendas automáticas
- Recomendações inteligentes (IA)
- Análise preditiva de vendas
- Detecção de fraudes
- Integração com modelos externos (API Python)
- Configuração de regras de IA (expansível)
- Painel de métricas IA

## Uso dos módulos IA
- Recomendações: `/api/ai/recommendations` (GET)
- Preditivo: `/api/ai/predict/:productId` (GET)
- Fraude: `/api/ai/fraud` (GET)
- Modelo externo: `/api/ai/external-model` (POST)

## Exemplo de integração com modelo externo
- Backend: envia dados para API Python em `/api/ai/external-model`
- Frontend: página Engine IA permite consulta e exibe resultado

## Expansão
- Adicione novos modelos IA em `backend/ai/`
- Configure regras em coleção MongoDB `ai_rules`
- Expanda métricas e dashboards no frontend

## Segurança
- Rotas protegidas por JWT
- Controle de acesso por perfil (admin/user)
- Validação robusta de dados

## Logs e Auditoria
- Operações críticas registradas no console
- Expansível para persistência em arquivos ou MongoDB

## Contato e Suporte
Para dúvidas, exemplos ou novas funcionalidades, solicite diretamente pelo sistema ou consulte esta documentação.

---

Sistema pronto para produção, integração e expansão.
