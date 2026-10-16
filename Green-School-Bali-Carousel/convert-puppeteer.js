const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  });

  const page = await browser.newPage();

  // Set viewport to match SVG dimensions
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });

  // Pre-load the Inter font on a blank page first
  console.log('Pre-loading Inter font...');
  await page.goto('about:blank');
  await page.setContent(`<!DOCTYPE html>
<html><head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=block" rel="stylesheet">
<style>
  .preload { font-family: 'Inter', sans-serif; visibility: hidden; position: absolute; }
</style>
</head><body>
<span class="preload" style="font-weight:100">X</span>
<span class="preload" style="font-weight:200">X</span>
<span class="preload" style="font-weight:300">X</span>
<span class="preload" style="font-weight:400">X</span>
<span class="preload" style="font-weight:500">X</span>
<span class="preload" style="font-weight:600">X</span>
<span class="preload" style="font-weight:700">X</span>
<span class="preload" style="font-weight:800">X</span>
<span class="preload" style="font-weight:900">X</span>
</body></html>`, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForFunction(() => document.fonts.ready);
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Fonts loaded.\n');

  const dirUri = 'file:///' + __dirname.replace(/\\/g, '/');

  for (let i = 1; i <= 8; i++) {
    const svgFile = path.resolve(__dirname, `slide-${i}.svg`);
    const pngFile = path.resolve(__dirname, `slide-${i}.png`);

    if (!fs.existsSync(svgFile)) {
      console.log(`slide-${i}.svg not found, skipping.`);
      continue;
    }

    console.log(`Converting slide-${i}.svg to PNG...`);

    // Read the SVG content
    let svgContent = fs.readFileSync(svgFile, 'utf-8');

    // Convert relative image hrefs to absolute file:// URIs
    svgContent = svgContent.replace(
      /href="(?!https?:\/\/|data:|file:\/\/)(.*?)"/g,
      (match, p1) => `href="${dirUri}/${p1}"`
    );

    // Build HTML that renders the SVG at exact size with fonts already cached
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=block" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1350px;
      overflow: hidden;
      background: transparent;
    }
    svg {
      display: block;
      width: 1080px;
      height: 1350px;
    }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

    // Use domcontentloaded + manual font wait (fonts are cached from preload)
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Wait for fonts and rendering
    await page.waitForFunction(() => document.fonts.ready);
    await new Promise(resolve => setTimeout(resolve, 1500));

    await page.screenshot({
      path: pngFile,
      clip: { x: 0, y: 0, width: 1080, height: 1350 },
      omitBackground: false,
      type: 'png'
    });

    console.log(`✓ Generated slide-${i}.png`);
  }

  await browser.close();
  console.log('\nAll slides converted successfully!');
})();
