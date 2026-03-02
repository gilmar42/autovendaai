import React, { useState } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import api from '../services/api';

const integrations = [
  { name: 'Facebook', endpoint: '/ai/facebook', param: 'niche' },
  { name: 'Gmail', endpoint: '/ai/gmail', param: 'niche' },
  { name: 'Instagram', endpoint: '/ai/instagram', param: 'niche' },
  { name: 'LinkedIn', endpoint: '/ai/linkedin', param: 'niche' },
  { name: 'MercadoLivre', endpoint: '/ai/mercadolivre', param: 'niche' },
  { name: 'OLX', endpoint: '/ai/olx', param: 'niche' },
  { name: 'Outlook', endpoint: '/ai/outlook', param: 'niche' },
  { name: 'Shopify', endpoint: '/ai/shopify', param: 'shopUrl' },
  { name: 'WhatsApp', endpoint: '/ai/whatsapp', param: 'niche' }
];

function IntegrationsTest() {
  const [param, setParam] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [integration, setIntegration] = useState(integrations[0]);

  const handleTest = async () => {
    try {
      const res = await api.post(integration.endpoint, { [integration.param]: param });
      setResults(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao testar integração');
      setResults([]);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Testar Integrações</Typography>
      <TextField label={integration.param} fullWidth margin="normal" value={param} onChange={e => setParam(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleTest}>Testar {integration.name}</Button>
      <div style={{ margin: '20px 0' }}>
        <select value={integration.name} onChange={e => setIntegration(integrations.find(i => i.name === e.target.value))}>
          {integrations.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
        </select>
      </div>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {results.map((r, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={JSON.stringify(r)} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default IntegrationsTest;
