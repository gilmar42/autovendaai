// Shopify API integration
const axios = require('axios');

async function searchShopify(niche, shopUrl, token) {
  const res = await axios.get(`${shopUrl}/admin/api/2023-01/products.json`, {
    params: { title: niche },
    headers: { 'X-Shopify-Access-Token': token }
  });
  return res.data.products.map(p => ({ title: p.title, link: `${shopUrl}/products/${p.handle}` }));
}

module.exports = { searchShopify };
