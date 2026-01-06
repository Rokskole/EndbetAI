// API route to serve privacy policy
// This ensures the privacy policy is always accessible, even if static routing fails

const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Set content type
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  // Read the privacy policy HTML file
  const filePath = path.join(__dirname, '../public/privacy-policy.html');
  
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error reading privacy policy:', error);
    res.status(500).send(`
      <html>
        <head><title>Privacy Policy - Error</title></head>
        <body>
          <h1>Privacy Policy</h1>
          <p>Unable to load privacy policy. Please contact us at privacy@quitbetai.com</p>
        </body>
      </html>
    `);
  }
};

