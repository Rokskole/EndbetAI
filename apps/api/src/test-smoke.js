// Minimal smoke tests for key endpoints
const API = 'https://endbet-ai-api-749k.vercel.app/api';

async function main() {
  console.log('🧪 Smoke tests starting...');

  const health = await fetch('https://endbet-ai-api-749k.vercel.app/health').then(r=>r.json());
  console.log('Health:', health.status);

  const endpoints = [
    `${API}/auth/login`,
    `${API}/journal`,
    `${API}/finance/transactions`,
    `${API}/tasks`,
    `${API}/sos/helplines`,
    `${API}/content/articles`,
  ];

  for (const url of endpoints) {
    const res = await fetch(url);
    console.log(url, '->', res.status);
  }

  console.log('✅ Smoke tests finished');
}

main();


