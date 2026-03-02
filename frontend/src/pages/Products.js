import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', description: '' });

  const fetchProducts = () => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Erro ao carregar produtos'));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ name: product.name, price: product.price, stock: product.stock, description: product.description || '' });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', stock: '', description: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      fetchProducts();
      handleClose();
    } catch (err) {
      alert('Erro ao salvar produto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Erro ao excluir produto');
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">Gestão de Produtos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Novo Produto</Button>
      </Box>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Preço</strong></TableCell>
              <TableCell><strong>Estoque</strong></TableCell>
              <TableCell><strong>Descrição</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod) => (
              <TableRow key={prod._id} hover>
                <TableCell>{prod.name}</TableCell>
                <TableCell>R$ {prod.price.toFixed(2)}</TableCell>
                <TableCell>{prod.stock}</TableCell>
                <TableCell>{prod.description || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(prod)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(prod._id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth label="Nome" margin="normal" required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <TextField
              fullWidth label="Preço" type="number" margin="normal" required
              value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
            />
            <TextField
              fullWidth label="Estoque Inicial" type="number" margin="normal" required
              value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})}
            />
            <TextField
              fullWidth label="Descrição" multiline rows={3} margin="normal"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">Salvar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default Products;
