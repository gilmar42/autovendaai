# AutovendaAI

Sistema de vendas automáticas moderno.

## Backend
- Node.js/Express
- MongoDB
- JWT, bcrypt
- Agendamento, integração de pagamentos

## Frontend
- React
- Material UI
- React Router
- Axios
- React Hook Form


## Como rodar e integrar


### Backend (Produção)
1. Instale dependências: `npm install`
2. Configure o arquivo `.env` com dados seguros.
3. Inicie em produção com [pm2](https://pm2.keymetrics.io/):
	- Instale globalmente: `npm install -g pm2`
	- Execute: `pm2 start index.js --name autovenda-backend`
	- Para monitorar: `pm2 monit`
	- Para listar apps: `pm2 list`
	- Para parar: `pm2 stop autovenda-backend`



### Frontend (Produção)
1. Instale dependências: `npm install`
2. Gere o build: `npm run build`
3. Sirva a aplicação com [serve](https://www.npmjs.com/package/serve):
	- Instale globalmente: `npm install -g serve`
	- Execute: `serve -s build`
	- Por padrão, será servido em http://localhost:5000
	- Para customizar porta: `serve -s build -l 3000`
4. O frontend está configurado para consumir a API do backend em produção.

### Integração JWT
O token JWT é salvo no localStorage após login e usado automaticamente nas requisições protegidas.

### Pagamentos
O botão de pagamento na página de vendas faz uma requisição mock ao backend.

## Funcionalidades
- Cadastro e autenticação de usuários
- Cadastro de produtos
- Gestão de estoque
- Registro de vendas automáticas
- Relatórios de vendas
- Integração com pagamentos (mock)

## Estrutura
- backend/models: Modelos das entidades
- backend/routes: Rotas da API
- frontend: Interface do usuário

## Expansão
Adicione integrações reais de pagamento e agendamento conforme necessidade.