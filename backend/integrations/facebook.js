// Facebook API integration
const axios = require('axios');

async function searchFacebook(niche, token) {
  // Exemplo: busca em grupos ou páginas
  const res = await axios.get('https://graph.facebook.com/v17.0/search', {
    params: { q: niche, type: 'page' },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data.map(p => ({ title: p.name, link: `https://facebook.com/${p.id}` }));
}

module.exports = { searchFacebook };
