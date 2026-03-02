import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ mb: 4, background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
          AutovendaAI
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/products')}>Produtos</Button>
          <Button color="inherit" onClick={() => navigate('/stock')}>Estoque</Button>
          <Button color="inherit" onClick={() => navigate('/sales')}>Vendas</Button>
          <Button color="inherit" onClick={() => navigate('/ai')}>IA Engine</Button>
          <Button color="inherit" onClick={() => navigate('/prospection')}>Prospecção</Button>
          <Button color="inherit" onClick={() => navigate('/reports')}>Relatórios</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
