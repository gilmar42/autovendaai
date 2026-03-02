import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  TextField, IconButton, Box, Chip
} from '@mui/material';
import { Save, Refresh } from '@mui/icons-material';
import api from '../services/api';

function Stock() {
  const [products, setProducts] = useState([]);
  const [adjustments, setAdjustments] = useState({});

  const fetchStock = () => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Erro ao buscar estoque'));
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleAdjustmentChange = (id, val) => {
    setAdjustments({ ...adjustments, [id]: val });
  };

  const saveAdjustment = async (id) => {
    const newVal = adjustments[id];
    if (newVal === undefined || newVal === '') return;
    try {
      await api.put(`/products/${id}`, { stock: parseInt(newVal) });
      fetchStock();
      const newAdj = { ...adjustments };
      delete newAdj[id];
      setAdjustments(newAdj);
    } catch (err) {
      alert('Erro ao atualizar estoque');
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: 'Esgotado', color: 'error' };
    if (stock < 10) return { label: 'Baixo', color: 'warning' };
    return { label: 'OK', color: 'success' };
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">Controle de Estoque</Typography>
        <IconButton onClick={fetchStock} color="primary"><Refresh /></IconButton>
      </Box>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Produto</strong></TableCell>
              <TableCell><strong>Qtd Atual</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Ajuste Direto</strong></TableCell>
              <TableCell align="right"><strong>Ação</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod) => {
              const status = getStockStatus(prod.stock);
              return (
                <TableRow key={prod._id} hover>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell>{prod.stock}</TableCell>
                  <TableCell>
                    <Chip label={status.label} color={status.color} size="small" />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small" type="number" placeholder="Nova qtd"
                      value={adjustments[prod._id] || ''}
                      onChange={(e) => handleAdjustmentChange(prod._id, e.target.value)}
                      sx={{ width: 120 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="success" 
                      disabled={adjustments[prod._id] === undefined}
                      onClick={() => saveAdjustment(prod._id)}
                    >
                      <Save />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Stock;
