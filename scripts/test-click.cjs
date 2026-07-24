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
  console.log("Page loaded. Attempting to click all modules...");

  try {
    await page.waitForSelector('aside button');
    
    // Get all buttons in the aside
    const buttons = await page.$$('aside button');
    console.log(`Found ${buttons.length} buttons in aside.`);
    
    for (let i = 0; i < buttons.length; i++) {
        console.log(`Clicking button ${i}...`);
        await buttons[i].click();
        await new Promise(r => setTimeout(r, 1000));
    }
  } catch (err) {
    console.error("Puppeteer script error:", err);
  }
  
  await browser.close();
})();
