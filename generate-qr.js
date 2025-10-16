import qrcode from 'qrcode-terminal';

const appUrl = 'http://172.20.10.2';

console.log('📱 QR Code for QuitBet AI App');
console.log('================================');
console.log(`URL: ${appUrl}`);
console.log('');

qrcode.generate(appUrl, { small: true }, function (qrcode) {
    console.log(qrcode);
});

console.log('');
console.log('📋 Instructions:');
console.log('1. Open your phone camera');
console.log('2. Point it at the QR code above');
console.log('3. Tap the notification to open the app');
console.log('');
console.log('Or manually type this URL in your phone browser:');
console.log(appUrl);