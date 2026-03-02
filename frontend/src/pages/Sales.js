import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Card, CardContent, 
  CardActions, TextField, MenuItem, Box, Divider, Alert 
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import api from '../services/api';

function Sales() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ text: '', type: 'info' });

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Erro ao carregar produtos'));
  }, []);

  const handleSale = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const res = await api.post('/sales', {
        productId: selectedProduct,
        quantity: parseInt(quantity)
      });
      setMessage({ text: `Venda realizada! Total: R$ ${res.data.total.toFixed(2)}`, type: 'success' });
      // Atualiza lista local de produtos (estoque)
      const updatedProducts = await api.get('/products');
      setProducts(updatedProducts.data);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Erro ao processar venda', type: 'error' });
    }
  };

  const currentProd = products.find(p => p._id === selectedProduct);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>Terminal de Vendas</Typography>
      
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Registrar Nova Venda</Typography>
              <Box component="form" onSubmit={handleSale} sx={{ mt: 2 }}>
                <TextField
                  select fullWidth label="Selecionar Produto"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  margin="normal" required
                >
                  {products.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.name} (R$ {p.price.toFixed(2)}) - Estoque: {p.stock}
                    </MenuItem>
                  ))}
                </TextField>
                
                <TextField
                  fullWidth label="Quantidade" type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  margin="normal" required
                  inputProps={{ min: 1, max: currentProd?.stock || 100 }}
                />

                <Button 
                  type="submit" variant="contained" fullWidth size="large" 
                  sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
                  disabled={!selectedProduct || (currentProd && currentProd.stock < quantity)}
                >
                  Finalizar Venda
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={4} sx={{ bgcolor: '#f8f9fa' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Resumo do Pedido</Typography>
              <Divider sx={{ my: 2 }} />
              {currentProd ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{currentProd.name} x {quantity}</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>R$ {(currentProd.price * quantity).toFixed(2)}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Estoque atual: {currentProd.stock}</Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5" fontWeight="bold">Total</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">R$ {(currentProd.price * quantity).toFixed(2)}</Typography>
                  </Box>
                </Box>
              ) : (
                <Typography color="text.secondary" align="center">Selecione um produto para ver o resumo.</Typography>
              )}
            </CardContent>
          </Card>
          
          {message.text && (
            <Alert severity={message.type} sx={{ mt: 2 }}>
              {message.text}
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Sales;
