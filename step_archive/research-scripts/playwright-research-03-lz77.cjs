// @MX:NOTE: step016 조사용 Playwright 스크립트 (LZ77/Deflate)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET = 'https://en.wikipedia.org/wiki/LZ77_and_LZ78';
const N = '03-lz77';
const ROOT = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  try {
    await page.goto(TARGET, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);
    await page.screenshot({
      path: path.join(ROOT, `screenshots/research-${N}.png`),
      fullPage: true,
    });
    const content = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(
      path.join(ROOT, `research-raw-${N}.txt`),
      `# SOURCE: ${TARGET}\n# COLLECTED_AT: ${new Date().toISOString()}\n\n` + content,
      'utf8'
    );
    console.log(`[${N}] OK`);
  } catch (e) {
    console.error(`[${N}] FAIL`, e.message);
  } finally {
    await browser.close();
  }
})();
