// Módulo de análise preditiva (mock)
const Sale = require('../models/Sale');
const Product = require('../models/Product');

async function predictSales(productId) {
  // Exemplo: média de vendas dos últimos 30 dias
  const now = new Date();
  const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sales = await Sale.find({ product: productId, date: { $gte: past, $lte: now } });
  const total = sales.reduce((sum, s) => sum + s.quantity, 0);
  return { predicted: Math.round(total / 30) };
}

module.exports = {
  predictSales
};
