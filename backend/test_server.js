const express = require('express');
const app = express();
const PORT = 5000;

app.post('/test', (req, res) => {
  console.log('Recebido POST /test');
  res.json({ message: 'OK' });
});

app.listen(PORT, () => console.log(`Server de teste na porta ${PORT}`));
