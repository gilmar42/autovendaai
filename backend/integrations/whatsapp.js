// WhatsApp API integration
const axios = require('axios');

async function searchWhatsApp(niche, token) {
  // Exemplo: busca por contatos ou mensagens (depende do provedor)
  const res = await axios.get('https://api.whatsapp.com/v1/messages', {
    params: { q: niche },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.messages.map(m => ({ content: m.body, contact: m.from }));
}

module.exports = { searchWhatsApp };
