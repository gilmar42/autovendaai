import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import api from '../services/api';

function AIEngine() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fraud, setFraud] = useState([]);
  const [error, setError] = useState('');
  const [externalResult, setExternalResult] = useState(null);
  const [externalInput, setExternalInput] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/ai/recommendations')
      .then(res => {
        setRecommendations(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar recomendações');
        setLoading(false);
      });
  }, []);

  const handleFraudCheck = () => {
    api.get('/ai/fraud')
      .then(res => setFraud(res.data))
      .catch(() => setError('Erro ao detectar fraudes'));
  };

  const handleExternalModel = async () => {
    try {
      const res = await api.post('/ai/external-model', { input: externalInput });
      setExternalResult(res.data.result);
    } catch {
      setError('Erro ao consultar modelo externo');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Engine IA</Typography>
      <Typography variant="h6">Recomendações Inteligentes</Typography>
      {loading && <CircularProgress />}
      <List>
        {recommendations.map(prod => (
          <ListItem key={prod._id}>
            <ListItemText primary={prod.name} secondary={`Preço: R$${prod.price} | Estoque: ${prod.stock}`} />
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" onClick={handleFraudCheck}>Detectar Fraudes</Button>
      {fraud.length > 0 && (
        <List>
          {fraud.map(f => (
            <ListItem key={f._id}>
              <ListItemText primary={`Venda suspeita: Produto ${f.product}, Quantidade ${f.quantity}`} />
            </ListItem>
          ))}
        </List>
      )}
      <Typography variant="h6" sx={{ mt: 2 }}>Consulta Modelo Externo (Python)</Typography>
      <input value={externalInput} onChange={e => setExternalInput(e.target.value)} placeholder="Dados para modelo externo" />
      <Button variant="contained" onClick={handleExternalModel}>Consultar Modelo Externo</Button>
      {externalResult && (
        <Typography sx={{ mt: 1 }}>Resultado: {JSON.stringify(externalResult)}</Typography>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
}

export default AIEngine;
