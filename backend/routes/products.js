const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const { body, validationResult } = require('express-validator');

// Listar produtos
router.get('/', async (req, res) => {
  try {
    const products = await productService.listProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cadastro de produto
router.post('/',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('price').isFloat({ gt: 0 }).withMessage('Preço deve ser maior que zero'),
    body('stock').isInt({ min: 0 }).withMessage('Estoque deve ser inteiro >= 0')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, price, stock, description } = req.body;
    try {
      const product = await productService.createProduct({ name, price, stock, description });
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Excluir produto
router.delete('/:id', async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
