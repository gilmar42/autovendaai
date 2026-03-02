const http = require('http');

async function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  try {
    // 1. Register Auth
    console.log('Passo 1: Registro Auth');
    const authData = JSON.stringify({
      name: 'Profissional Teste',
      email: 'prof@teste.com',
      password: 'password123'
    });
    const authRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': authData.length }
    }, authData);
    console.log('Status Auth:', authRes.statusCode);
    if (authRes.statusCode !== 200) throw new Error('Auth failed');

    const userId = authRes.body.user.id;
    const token = authRes.body.token;

    // 2. Register Professional
    console.log('Passo 2: Registro Profissional');
    const profData = JSON.stringify({
      userId,
      specialty: 'Teste',
      experience: 5,
      bio: 'Bio de teste'
    });
    const profRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/professional/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': profData.length,
        'Authorization': `Bearer ${token}`
      }
    }, profData);
    console.log('Status Prof:', profRes.statusCode);
    console.log('Resposta Prof:', JSON.stringify(profRes.body));

    if (profRes.statusCode === 200) {
      console.log('FLUXO COMPLETO OK!');
    }
  } catch (err) {
    console.error('ERRO NO FLUXO:', err.message);
  }
  process.exit(0);
}

run();
