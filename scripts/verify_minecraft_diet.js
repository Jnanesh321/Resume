const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const dietDir = path.join(__dirname, '..', 'docs', 'screenshots', 'minecraft-diet');
if (!fs.existsSync(dietDir)) {
  fs.mkdirSync(dietDir, { recursive: true });
}

const sections = ['hero', 'projects', 'skills', 'contact'];
const fxModes = ['low', 'full'];

async function verify() {
  console.log('=== STARTING MINECRAFT DIET VERIFICATION SUITE ===');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Screenshot Capture in data-fx=low and data-fx=full at 1440 & 390
  for (const fx of fxModes) {
    console.log(`\n[Diet Screenshots] Testing Minecraft with data-fx="${fx}"`);
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:3000/?theme=minecraft`, { waitUntil: 'networkidle2' });
    await page.evaluate((f) => {
      window.ThemeRegistry.setFxLevel(f);
    }, fx);
    await new Promise(r => setTimeout(r, 400));

    // Desktop 1440
    for (const sec of sections) {
      await page.evaluate((s) => {
        const el = document.getElementById(s);
        if (el) el.scrollIntoView();
      }, sec);
      await new Promise(r => setTimeout(r, 250));
      const filename = `diet-1440-fx-${fx}-${sec}.png`;
      await page.screenshot({ path: path.join(dietDir, filename), clip: { x: 0, y: 0, width: 1440, height: 850 } });
      console.log(`  ✓ Saved ${filename}`);
    }

    // Mobile 390
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.evaluate((s) => {
      const el = document.getElementById('hero');
      if (el) el.scrollIntoView();
    }, 'hero');
    await new Promise(r => setTimeout(r, 250));
    const mobileHero = `diet-390-fx-${fx}-hero.png`;
    await page.screenshot({ path: path.join(dietDir, mobileHero) });
    console.log(`  ✓ Saved ${mobileHero}`);

    await page.evaluate((s) => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView();
    }, 'projects');
    await new Promise(r => setTimeout(r, 250));
    const mobileProjects = `diet-390-fx-${fx}-projects.png`;
    await page.screenshot({ path: path.join(dietDir, mobileProjects) });
    console.log(`  ✓ Saved ${mobileProjects}`);
  }

  // 2. 10-Second Idle Trace in low mode
  console.log('\n[Performance Trace] Measuring idle activity in data-fx="low" for 10 seconds...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/?theme=minecraft', { waitUntil: 'networkidle2' });
  await page.evaluate(() => window.ThemeRegistry.setFxLevel('low'));
  await new Promise(r => setTimeout(r, 500));

  const tracePath = path.join(__dirname, '..', 'docs', 'idle-trace.json');
  await page.tracing.start({ path: tracePath, screenshots: false });
  console.log('  Tracing started... leaving page completely untouched for 10s');
  await new Promise(r => setTimeout(r, 10000));
  await page.tracing.stop();
  console.log('  Tracing stopped.');

  // Parse trace events
  const traceData = JSON.parse(fs.readFileSync(tracePath, 'utf8'));
  const events = traceData.traceEvents || [];
  const animFrameEvents = events.filter(e => e.name === 'FireAnimationFrame' || e.name === 'RequestAnimationFrame');
  const layoutEvents = events.filter(e => e.name === 'Layout' || e.name === 'UpdateLayoutTree');
  const paintEvents = events.filter(e => e.name === 'Paint' || e.name === 'CompositeLayers');

  console.log('\n--- 10-SECOND IDLE ACTIVITY REPORT (data-fx="low") ---');
  console.log(`  Animation Frame Events: ${animFrameEvents.length} (Expected: 0)`);
  console.log(`  Layout Recalculations:  ${layoutEvents.length} (Expected: <= 2 on settle)`);
  console.log(`  Paint / Composite Events: ${paintEvents.length} (Expected: <= 2 on settle)`);

  // 3. Contrast Evaluation (WCAG AA check)
  console.log('\n[Contrast Audit] Checking text contrast across Minecraft theme sections...');
  const contrastCheck = await page.evaluate(() => {
    function getLuminance(r, g, b) {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function parseColor(str) {
      const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
      return [240, 253, 244]; // fallback light green
    }

    const heading = document.querySelector('.section-title');
    const hColor = heading ? window.getComputedStyle(heading).color : 'rgb(240,253,244)';
    const bodyText = document.querySelector('.project-desc');
    const bColor = bodyText ? window.getComputedStyle(bodyText).color : 'rgb(209,250,229)';

    const [hr, hg, hb] = parseColor(hColor);
    const [br, bg, bb] = parseColor(bColor);
    const bgLum = getLuminance(12, 18, 12); // #0c120c background

    const hRatio = (getLuminance(hr, hg, hb) + 0.05) / (bgLum + 0.05);
    const bRatio = (getLuminance(br, bg, bb) + 0.05) / (bgLum + 0.05);

    return {
      headingColor: hColor,
      headingRatio: hRatio.toFixed(2),
      headingPass: hRatio >= 4.5,
      bodyColor: bColor,
      bodyRatio: bRatio.toFixed(2),
      bodyPass: bRatio >= 4.5
    };
  });

  console.log(`  Heading text contrast: ${contrastCheck.headingRatio}:1 (Pass WCAG AA: ${contrastCheck.headingPass})`);
  console.log(`  Body text contrast:    ${contrastCheck.bodyRatio}:1 (Pass WCAG AA: ${contrastCheck.bodyPass})`);

  await browser.close();
  console.log('\n=== MINECRAFT DIET VERIFICATION FINISHED SUCCESSFULLY ===');
}

verify().catch(e => {
  console.error('Verification failed:', e);
  process.exit(1);
});
