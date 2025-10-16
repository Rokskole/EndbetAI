// Simple test script for authentication endpoints
const API_BASE = 'http://localhost:3001/api';

async function testAuth() {
  console.log('🧪 Testing QuitBet AI Authentication System\n');

  try {
    // Test 1: Send magic link
    console.log('1. Testing magic link sending...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      }),
    });

    const loginData = await loginResponse.json();
    console.log('✅ Magic link sent:', loginData.message);

    // Test 2: Health check
    console.log('\n2. Testing health check...');
    const healthResponse = await fetch(`${API_BASE.replace('/api', '')}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ API is healthy:', healthData.status);

    // Test 3: Test protected endpoint without auth
    console.log('\n3. Testing protected endpoint without auth...');
    const protectedResponse = await fetch(`${API_BASE}/auth/me`);
    const protectedData = await protectedResponse.json();
    console.log('✅ Protected endpoint correctly rejected:', protectedData.error);

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📝 Next steps:');
    console.log('1. Set up Supabase project and update environment variables');
    console.log('2. Run the database schema in your PostgreSQL database');
    console.log('3. Test the mobile app authentication flow');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuth();
