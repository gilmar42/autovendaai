const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const logger = require('../utils/logger');

// Registrar venda com atualização de estoque
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Estoque insuficiente' });
    }

    const total = product.price * quantity;
    const sale = new Sale({ 
      product: productId, 
      quantity, 
      total,
      date: new Date()
    });

    // Atualiza o estoque do produto
    product.stock -= quantity;
    await product.save();
    await sale.save();

    logger.info(`[VENDA] R$ ${total.toFixed(2)} - ${product.name} (Qtd: ${quantity})`);
    res.status(201).json(sale);
  } catch (err) {
    logger.error('Erro ao registrar venda:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Listar vendas
router.get('/', async (req, res) => {
  const sales = await Sale.find().populate('product').sort({ date: -1 });
  res.json(sales);
});

// Relatório de vendas
router.get('/report', async (req, res) => {
  const sales = await Sale.find().populate('product').sort({ date: -1 });
  const report = sales.map(s => ({
    produto: s.product ? s.product.name : 'Produto Excluído',
    quantidade: s.quantity,
    total: s.total,
    data: s.date
  }));
  res.json(report);
});

const { Parser } = require('json2csv');
router.get('/report/csv', async (req, res) => {
  const sales = await Sale.find().populate('product');
  const report = sales.map(s => ({
    produto: s.product ? s.product.name : 'N/A',
    quantidade: s.quantity,
    total: s.total,
    data: s.date
  }));
  const parser = new Parser();
  const csv = parser.parse(report);
  res.header('Content-Type', 'text/csv');
  res.attachment('relatorio_vendas.csv');
  res.send(csv);
});

module.exports = router;
