import React, { useState } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import api from '../services/api';

function Prospection() {
  const [niche, setNiche] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProspect = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/ai/prospect', { profile: { niche } });
      setResults(res.data);
    } catch {
      setError('Erro na prospecção');
    }
    setLoading(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Prospecção Inteligente</Typography>
      <TextField label="Nicho" value={niche} onChange={e => setNiche(e.target.value)} fullWidth margin="normal" />
      <Button variant="contained" onClick={handleProspect} disabled={loading}>Buscar Clientes Potenciais</Button>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {results.map((item, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={item.title} secondary={`${item.source} | ${item.link}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Prospection;
