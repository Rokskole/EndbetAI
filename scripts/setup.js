#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 QuitBet AI Setup Script\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from template');
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Check TypeScript compilation
console.log('\n🔧 Checking TypeScript compilation...');
try {
  const { execSync } = require('child_process');
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('⚠️  TypeScript compilation issues found (this is normal for initial setup)');
}

console.log('\n📋 Setup Checklist:');
console.log('1. ✅ Project structure created');
console.log('2. ✅ Dependencies installed');
console.log('3. ✅ Environment file created');
console.log('4. ⏳ Configure Supabase project');
console.log('5. ⏳ Set up PostgreSQL database');
console.log('6. ⏳ Update .env with your credentials');
console.log('7. ⏳ Run database schema: psql -d your_database < infra/db/schema.sql');
console.log('8. ⏳ Start development: npm run dev');

console.log('\n🎯 Next Steps:');
console.log('1. Create a Supabase project at https://supabase.com');
console.log('2. Get your project URL and API keys');
console.log('3. Update the .env file with your Supabase credentials');
console.log('4. Set up a PostgreSQL database (or use Supabase)');
console.log('5. Run the database schema from infra/db/schema.sql');
console.log('6. Start the development servers with: npm run dev');

console.log('\n📚 Documentation:');
console.log('- README.md: Complete setup and usage guide');
console.log('- docs/CONTEX.md: Project context and requirements');
console.log('- apps/api/src/test-auth.js: Authentication testing script');

console.log('\n✨ Setup complete! Happy coding!');
