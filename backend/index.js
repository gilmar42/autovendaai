require('dotenv').config({ quiet: process.env.NODE_ENV === 'test' });
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
const app = express();
const { startAutoSales } = require('./automation/autoSales');

const shouldLogRequestDebug = process.env.DEBUG_REQUESTS === 'true'
  || (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test');

if (shouldLogRequestDebug) {
  app.use((req, res, next) => {
    logger.info(`[DEBUG] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
  });
}

app.use(cors({
  origin: true, // Echoes the request origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());
require('./middleware/csp')(app);

let autoSalesTask = null;
if (process.env.NODE_ENV !== 'test') {
  autoSalesTask = startAutoSales();
}

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rotas
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/ai', require('./routes/ai'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  logger.error('MONGO_URI não definida no .env');
  process.exit(1);
}

// Conecta ao MongoDB e inicia o servidor
const mongoConnection = mongoose.connect(MONGO_URI)
  .then(() => {
    if (require.main === module) {
      app.listen(PORT, '0.0.0.0', () => {
        logger.info(`Servidor rodando em http://127.0.0.1:${PORT}`);
      });
    }
  })
  .catch(err => {
    logger.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

app.locals.mongoConnection = mongoConnection;
app.locals.autoSalesTask = autoSalesTask;

// Tratamento global de erros
process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
  logger.error('Unhandled Rejection:', err);
});

module.exports = app;
