const express = require('express');
const router = express.Router();

const aiRecommendation = require('../ai/recommendation');
const aiPredictive = require('../ai/predictive');
const aiFraud = require('../ai/fraud');
const aiProspection = require('../ai/prospection');
const axios = require('axios');

// Recomendações inteligentes
router.get('/recommendations', async (req, res) => {
  const products = await aiRecommendation.recommendProducts();
  res.json(products);
});

// Análise preditiva de vendas
router.get('/predict/:productId', async (req, res) => {
  const result = await aiPredictive.predictSales(req.params.productId);
  res.json(result);
});

// Detecção de fraudes
router.get('/fraud', async (req, res) => {
  const suspicious = await aiFraud.detectFraud();
  res.json(suspicious);
});


// Integração com modelo externo (API Python)
router.post('/external-model', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8000/predict', req.body);
    res.json({ result: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar modelo externo' });
  }
});


// Prospecção inteligente de clientes
router.post('/prospect', async (req, res) => {
  try {
    const opportunities = await aiProspection.prospectClients(req.body.profile);
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ error: 'Erro na prospecção inteligente' });
  }
});

module.exports = router;
