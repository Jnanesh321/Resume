const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const themes = ['obsidian', 'apple', 'aws', 'netflix', 'minecraft'];
const sections = ['hero', 'projects', 'skills', 'contact'];

async function run() {
  console.log('Launching Puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Desktop 1440x900
  await page.setViewport({ width: 1440, height: 900 });

  for (const theme of themes) {
    console.log(`Processing theme: ${theme}...`);
    const url = `http://localhost:3000/?theme=${theme}`;
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600)); // allow CSS transitions to settle

    for (const sec of sections) {
      const el = await page.$(`#${sec}`);
      if (el) {
        // Scroll element into view smoothly
        await page.evaluate((s) => {
          const target = document.getElementById(s);
          if (target) target.scrollIntoView();
        }, sec);
        await new Promise(r => setTimeout(r, 350));

        const filename = `${theme}-${sec}.png`;
        const filepath = path.join(screenshotsDir, filename);
        await page.screenshot({ path: filepath, clip: { x: 0, y: 0, width: 1440, height: 850 } });
        console.log(`  ✓ Saved ${filename}`);
      }
    }
  }

  // Also capture mobile (390px) hero for Obsidian and Apple
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  for (const theme of ['obsidian', 'apple']) {
    await page.goto(`http://localhost:3000/?theme=${theme}`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 500));
    const filename = `${theme}-mobile-390px.png`;
    await page.screenshot({ path: path.join(screenshotsDir, filename) });
    console.log(`  ✓ Saved ${filename}`);
  }

  await browser.close();
  console.log('All screenshots captured successfully in /docs/screenshots/');
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
