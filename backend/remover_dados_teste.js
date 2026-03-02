require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/autovendaai';

const User = require('./models/User');
const Product = require('./models/Product');
const Sale = require('./models/Sale');

async function removerDadosTeste() {
  try {
    await mongoose.connect(MONGO_URI);
    // Remove usuários de teste
    const usuariosRemovidos = await User.deleteMany({ email: /teste|admin@teste.com|dummy|exemplo|sample/i });
    // Remove produtos de teste
    const produtosRemovidos = await Product.deleteMany({ name: /teste|mock|exemplo|sample|produto/i });
    // Remove vendas de teste
    const vendasRemovidas = await Sale.deleteMany({}); // Remove todas as vendas
    logger.info(`Usuários removidos: ${usuariosRemovidos.deletedCount}`);
    logger.info(`Produtos removidos: ${produtosRemovidos.deletedCount}`);
    logger.info(`Vendas removidas: ${vendasRemovidas.deletedCount}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    logger.error('Erro ao remover dados de teste:', err);
    process.exit(1);
  }
}

removerDadosTeste();
