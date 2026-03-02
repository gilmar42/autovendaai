// Módulo de detecção de fraudes (mock)
const Sale = require('../models/Sale');

async function detectFraud() {
  // Exemplo: vendas acima de 100 unidades em uma única transação
  const suspicious = await Sale.find({ quantity: { $gt: 100 } });
  return suspicious;
}

module.exports = {
  detectFraud
};
