const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Users\\Admin\\.cache\\puppeteer\\chrome\\win64-150.0.7871.24\\chrome-win64\\chrome.exe'
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`PAGE LOG [${msg.type()}]:`, msg.text());
  });

  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.toString());
  });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await browser.close();
})();
