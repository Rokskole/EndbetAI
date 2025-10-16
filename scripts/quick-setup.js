#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 QuitBet AI - Quick Setup Script');
console.log('==================================\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18+ is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version:', nodeVersion);

// Check npm version
try {
  const npmVersion = execSync('npm -v', { encoding: 'utf8' }).trim();
  console.log('✅ npm version:', npmVersion);
} catch (error) {
  console.error('❌ npm not found. Please install npm.');
  process.exit(1);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Check for .env file
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n⚠️  .env file not found. Creating from template...');
  try {
    const envExample = fs.readFileSync(path.join(__dirname, '..', 'env.example'), 'utf8');
    fs.writeFileSync(envPath, envExample);
    console.log('✅ .env file created. Please edit it with your configuration.');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
  }
} else {
  console.log('✅ .env file found');
}

// Check for required environment variables
console.log('\n🔍 Checking environment configuration...');
require('dotenv').config();

const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'DEEPSEEK_API_KEY'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('⚠️  Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\nPlease edit .env file with your configuration.');
} else {
  console.log('✅ All required environment variables are set');
}

// Type checking
console.log('\n🔍 Running type checks...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ Type checks passed');
} catch (error) {
  console.log('⚠️  Type checks failed. This is normal for initial setup.');
}

// Linting
console.log('\n🔍 Running linter...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed');
} catch (error) {
  console.log('⚠️  Linting issues found. Run "npm run lint" to see details.');
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Edit .env file with your Supabase and DeepSeek credentials');
console.log('2. Set up your PostgreSQL database and run the schema');
console.log('3. Start development: npm run dev');
console.log('4. For mobile: cd apps/mobile && npm run dev');
console.log('\n📚 See DEVELOPMENT_PLAN.md for detailed instructions');
