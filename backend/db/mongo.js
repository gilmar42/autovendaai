const mongoose = require('mongoose');
const logger = require('../utils/logger');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/autovendaai';

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Conectado ao MongoDB:', MONGO_URI);
  } catch (err) {
    logger.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
}

module.exports = connectMongo;
