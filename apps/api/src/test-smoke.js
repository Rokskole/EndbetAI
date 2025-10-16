// Minimal smoke tests for key endpoints
const API = 'http://localhost:3001/api';

async function main() {
  console.log('🧪 Smoke tests starting...');

  const health = await fetch('http://localhost:3001/health').then(r=>r.json());
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


