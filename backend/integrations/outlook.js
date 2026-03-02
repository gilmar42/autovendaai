// Outlook API integration
const axios = require('axios');

async function searchOutlook(niche, token) {
  const res = await axios.get('https://graph.microsoft.com/v1.0/me/messages', {
    params: { $search: niche },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.value.map(m => ({ subject: m.subject, link: m.webLink }));
}

module.exports = { searchOutlook };
