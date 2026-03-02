require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/autovendaai';

const User = require('./models/User');

async function removerAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    const resultado = await User.deleteMany({ email: 'admin@teste.com' });
    logger.info(`Usuários removidos: ${resultado.deletedCount}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    logger.error('Erro ao remover usuário admin:', err);
    process.exit(1);
  }
}

removerAdmin();
