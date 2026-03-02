// Módulo de recomendação inteligente
const Product = require('../models/Product');

async function recommendProducts() {
  // Exemplo: recomendar produtos com maior estoque e menor preço
  const products = await Product.find().sort({ stock: -1, price: 1 }).limit(5);
  return products;
}

module.exports = {
  recommendProducts
};
