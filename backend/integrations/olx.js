// OLX API integration
const axios = require('axios');

async function searchOLX(niche, token) {
  const res = await axios.get('https://api.olx.com.br/v1/search', {
    params: { q: niche },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.results.map(r => ({ title: r.title, link: r.url }));
}

module.exports = { searchOLX };
