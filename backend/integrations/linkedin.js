// LinkedIn API integration
const axios = require('axios');

async function searchLinkedIn(niche, token) {
  // Exemplo: busca por empresas ou grupos
  const res = await axios.get('https://api.linkedin.com/v2/search', {
    params: { keywords: niche },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.elements.map(e => ({ title: e.title, link: e.url }));
}

module.exports = { searchLinkedIn };
