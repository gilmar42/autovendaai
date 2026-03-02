// Instagram API integration
const axios = require('axios');

async function searchInstagram(niche, token) {
  // Exemplo: busca por hashtags
  const res = await axios.get('https://graph.instagram.com/v17.0/ig_hashtag_search', {
    params: { q: niche },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data.map(h => ({ title: h.name, link: `https://instagram.com/explore/tags/${h.name}` }));
}

module.exports = { searchInstagram };
