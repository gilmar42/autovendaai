const cron = require('node-cron');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const logger = require('../utils/logger');

function startAutoSales() {
  return cron.schedule('0 8 * * *', async () => {
    const products = await Product.find();
    for (const prod of products) {
      if (prod.stock > 0) {
        await Sale.create({
          product: prod._id,
          user: null,
          quantity: 1,
          total: prod.price,
          date: new Date()
        });
        prod.stock -= 1;
        await prod.save();
      }
    }
    logger.info('Vendas automáticas realizadas');
  });
}

module.exports = { startAutoSales };
