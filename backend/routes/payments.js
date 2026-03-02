const express = require('express');
const router = express.Router();

// Placeholder para integração de pagamentos

router.post('/pay', async (req, res) => {
  // Implementar integração com Stripe/PagSeguro/MercadoPago
  res.json({ message: 'Pagamento processado (mock)' });
});

module.exports = router;
