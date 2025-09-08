// DocuSign Configuration Checker
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking DocuSign Configuration...\n');

const requiredEnvVars = {
  DOCUSIGN_INTEGRATION_KEY: process.env.DOCUSIGN_INTEGRATION_KEY,
  DOCUSIGN_USER_ID: process.env.DOCUSIGN_USER_ID,
  DOCUSIGN_ACCOUNT_ID: process.env.DOCUSIGN_ACCOUNT_ID,
  DOCUSIGN_PRIVATE_KEY: process.env.DOCUSIGN_PRIVATE_KEY,
};

let allConfigured = true;

for (const [key, value] of Object.entries(requiredEnvVars)) {
  const isPlaceholder = value?.includes('your-docusign') || !value;
  const status = isPlaceholder ? '❌ NOT SET' : '✅ SET';

  console.log(`${key}: ${status}`);

  if (isPlaceholder) {
    allConfigured = false;
  }
}

console.log('\n' + '='.repeat(50));

if (allConfigured) {
  console.log('✅ All DocuSign environment variables are configured!');
  console.log('\nNext steps:');
  console.log('1. Restart your development server');
  console.log('2. Test the DocuSign templates API');
} else {
  console.log('❌ DocuSign configuration incomplete');
  console.log('\nTo configure DocuSign:');
  console.log('1. Go to https://developers.docusign.com/');
  console.log('2. Create/access your DocuSign app');
  console.log('3. Get your Integration Key from app settings');
  console.log('4. Generate RSA key pair for JWT authentication');
  console.log('5. Get your User ID (GUID format)');
  console.log('6. Update the values in your .env.local file');
  console.log('\nExample format:');
  console.log('DOCUSIGN_INTEGRATION_KEY=12345678-abcd-1234-abcd-123456789abc');
  console.log('DOCUSIGN_USER_ID=12345678-abcd-1234-abcd-123456789abc');
  console.log('DOCUSIGN_ACCOUNT_ID=1234567 (optional)');
  console.log(
    'DOCUSIGN_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\\nYour private key here\\n-----END RSA PRIVATE KEY-----"'
  );
}

console.log('\n🌐 Current NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
