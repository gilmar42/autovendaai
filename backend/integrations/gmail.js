// Gmail API integration
const { google } = require('googleapis');

async function searchGmail(niche, oauth2Client) {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const res = await gmail.users.messages.list({ userId: 'me', q: niche });
  return res.data.messages || [];
}

module.exports = { searchGmail };
