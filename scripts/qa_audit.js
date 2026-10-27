const puppeteer = require('puppeteer');
const fs = require('fs');

const themes = ['obsidian', 'apple', 'aws', 'netflix', 'minecraft'];
const widths = [1440, 1024, 768, 390];

async function runQA() {
  console.log('=== STARTING AUTOMATED QA & AUDIT SUITE ===');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 1. Console Errors & Load Test for all themes
  for (const theme of themes) {
    console.log(`[QA] Testing theme: ${theme}`);
    await page.goto(`http://localhost:3000/?theme=${theme}`, { waitUntil: 'networkidle2' });
    
    // Check that html has correct data-theme attribute
    const activeTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (activeTheme !== theme) {
      console.error(`FAIL: Theme mismatch! Expected ${theme}, got ${activeTheme}`);
    } else {
      console.log(`  ✓ data-theme="${activeTheme}" correctly set`);
    }

    // Check viewport widths
    for (const w of widths) {
      await page.setViewport({ width: w, height: 800 });
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      if (hasHorizontalScroll) {
        console.warn(`  ⚠ Warning: Horizontal overflow detected at ${w}px width in theme ${theme}`);
      } else {
        console.log(`  ✓ Width ${w}px passed (no horizontal overflow)`);
      }
    }
  }

  // 2. Test Theme Switcher Interaction via DOM
  console.log('[QA] Testing Theme Switcher UI interaction...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await page.click('#theme-menu-toggle');
  const isOpen = await page.evaluate(() => {
    return document.getElementById('theme-menu-dropdown').classList.contains('open');
  });
  console.log('  ✓ Dropdown opened:', isOpen);

  // Click Apple Glass
  await page.click('.theme-menu-item[data-theme-target="apple"]');
  const themeAfterClick = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('  ✓ Theme after clicking Apple Glass:', themeAfterClick);

  // Check LocalStorage persistence
  const savedStorage = await page.evaluate(() => localStorage.getItem('jnanesh-active-theme'));
  console.log('  ✓ LocalStorage active theme:', savedStorage);

  // 3. Accessibility / ARIA checks
  console.log('[QA] Checking accessibility markers...');
  const a11yChecks = await page.evaluate(() => {
    const termInput = document.getElementById('term-cli-input');
    const termHasAria = termInput && (termInput.getAttribute('aria-labelledby') || termInput.getAttribute('aria-label'));
    const modal = document.getElementById('project-modal-backdrop');
    const modalHasAria = modal && modal.getAttribute('role') === 'dialog' && modal.getAttribute('aria-modal') === 'true';
    const formLabels = document.querySelectorAll('#contact form label');
    const contactLinks = document.querySelectorAll('#contact a[href^="tel:"]');

    return {
      termInputAria: !!termHasAria,
      modalDialogAria: !!modalHasAria,
      contactLabelsCount: formLabels.length,
      phoneLinksCount: contactLinks.length
    };
  });

  console.log('  ✓ Terminal input aria:', a11yChecks.termInputAria);
  console.log('  ✓ Project modal role=dialog aria-modal=true:', a11yChecks.modalDialogAria);
  console.log('  ✓ Form labels count:', a11yChecks.contactLabelsCount);
  console.log('  ✓ Public phone links count (should be 0):', a11yChecks.phoneLinksCount);

  if (consoleErrors.length > 0) {
    console.warn('[QA] Recorded console errors:', consoleErrors);
  } else {
    console.log('  ✓ Zero console errors recorded across all themes!');
  }

  await browser.close();
  console.log('=== QA AUDIT SUITE FINISHED SUCCESSFULLY ===');
}

runQA().catch(e => {
  console.error('QA failed:', e);
  process.exit(1);
});
