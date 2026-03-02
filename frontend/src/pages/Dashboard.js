import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Divider, List, ListItem, ListItemText, LinearProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ShoppingCart, Inventory, TrendingUp, SmartToy } from '@mui/icons-material';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({ totalSales: 0, lowStock: 0, productCount: 0, recentSales: [] });
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [salesRes, productsRes, aiRes] = await Promise.all([
          api.get('/sales'),
          api.get('/products'),
          api.get('/ai/recommendations')
        ]);

        const totalValue = salesRes.data.reduce((sum, s) => sum + s.total, 0);
        const lowStockCount = productsRes.data.filter(p => p.stock < 10).length;

        setStats({
          totalSales: totalValue,
          lowStock: lowStockCount,
          productCount: productsRes.data.length,
          recentSales: salesRes.data.slice(0, 5)
        });
        setInsights(aiRes.data.slice(0, 3));
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard');
      }
    }
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={4} sx={{ height: '100%', borderLeft: `6px solid ${color}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1, color: 'text.secondary' }}>{title}</Typography>
        </Box>
        <Typography variant="h4" fontWeight="bold">{value}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>Painel de Controle</Typography>
      
<Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Vendas" value={`R$ ${stats.totalSales.toFixed(2)}`} icon={<TrendingUp color="success" />} color="#4caf50" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Vendas Realizadas" value={stats.recentSales.length} icon={<ShoppingCart color="primary" />} color="#2196f3" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Estoque Baixo" value={stats.lowStock} icon={<Inventory color="warning" />} color="#ff9800" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Produtos" value={stats.productCount} icon={<SmartToy color="info" />} color="#00bcd4" />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Vendas Recentes</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {stats.recentSales.length > 0 ? stats.recentSales.map((sale, i) => (
                  <ListItem key={i} divider={i < stats.recentSales.length - 1}>
                    <ListItemText 
                      primary={sale.product?.name || 'Venda'} 
                      secondary={new Date(sale.date).toLocaleString()} 
                    />
                    <Typography fontWeight="bold" color="success.main">R$ {sale.total.toFixed(2)}</Typography>
                  </ListItem>
                )) : <Typography align="center" color="text.secondary">Nenhuma venda registrada.</Typography>}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={4} sx={{ bgcolor: '#f0f4f8' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SmartToy sx={{ mr: 1 }} color="primary" /> Insights de IA
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>PRODUTOS RECOMENDADOS (ALTA PERFORMANCE):</Typography>
              <List>
                {insights.map((item, i) => (
                  <ListItem key={i} sx={{ px: 0 }}>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.stock} un.</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={Math.min(item.stock, 100)} color={item.stock < 10 ? "warning" : "primary"} />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
