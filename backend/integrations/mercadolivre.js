// Mercado Livre API integration
const axios = require('axios');

async function searchMercadoLivre(niche, token) {
  const res = await axios.get('https://api.mercadolibre.com/sites/MLB/search', {
    params: { q: niche },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.results.map(r => ({ title: r.title, link: r.permalink }));
}

module.exports = { searchMercadoLivre };
