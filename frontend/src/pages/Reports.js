import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import api from '../services/api';

function Reports() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/sales/report')
      .then(res => {
        setReport(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar relatório');
        setLoading(false);
      });
  }, []);

  const handleExportCSV = () => {
    window.open(`${api.defaults.baseURL}/sales/report/csv`, '_blank');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Relatórios</Typography>
      <Button variant="outlined" onClick={handleExportCSV}>Exportar CSV</Button>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {report.map((item, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={item.produto} secondary={`Usuário: ${item.usuario} | Quantidade: ${item.quantidade} | Total: R$${item.total} | Data: ${new Date(item.data).toLocaleString()}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Reports;
