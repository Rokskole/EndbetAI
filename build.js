const { execSync } = require('child_process');
const path = require('path');

console.log('Building API...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build packages
  console.log('Building packages...');
  execSync('npm run build --workspace=packages/config', { stdio: 'inherit' });
  execSync('npm run build --workspace=packages/types', { stdio: 'inherit' });
  execSync('npm run build --workspace=packages/validation', { stdio: 'inherit' });
  
  // Build API
  console.log('Building API...');
  execSync('npm run build --workspace=apps/api', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
