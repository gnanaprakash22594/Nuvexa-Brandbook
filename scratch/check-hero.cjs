const puppeteer = require('../Green-School-Bali-Carousel/node_modules/puppeteer');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const output = path.join(__dirname, 'hero-review');
  fs.mkdirSync(output, { recursive: true });
  try {
    for (const [name, width, height] of [['desktop', 1536, 720], ['laptop', 1280, 720], ['mobile', 390, 844], ['small-mobile', 350, 725], ['compact-mobile', 320, 667]]) {
      const page = await browser.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: 1 });
      await page.evaluateOnNewDocument(() => localStorage.setItem('nuvexa_popup_submitted', 'true'));
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await page.goto('http://127.0.0.1:3100', { waitUntil: 'networkidle0', timeout: 60000 });
      await page.evaluate(async () => {
        await document.fonts.ready;
        const video = document.querySelector('#hero video');
        video.pause();
        video.currentTime = 1;
        await new Promise((resolve) => setTimeout(resolve, 700));
      });
      const bounds = await page.evaluate(() => {
        const selectors = ['#main-nav', '#hero', '.hero-eyebrow', '.hero-h1', '.hero-sub', '.hero-ctas', '.hero-stats'];
        return Object.fromEntries(selectors.map((selector) => {
          const el = document.querySelector(selector);
          const { x, y, width, height, bottom } = el.getBoundingClientRect();
          return [selector, { x, y, width, height, bottom }];
        }).concat([['overflow', document.documentElement.scrollWidth > innerWidth]]));
      });
      console.log(name, JSON.stringify(bounds));
      await page.screenshot({ path: path.join(output, `${process.env.HERO_PHASE || 'after'}-${name}.png`) });
      await page.close();
    }
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
