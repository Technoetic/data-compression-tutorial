// @MX:NOTE: step037 빌드 후 스모크 테스트. 5단원 모두 렌더되는지 확인.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = 'http://localhost:5173/';
const OUT = path.resolve(__dirname, '../screenshots');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', err => errors.push('pageerror: ' + err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('console: ' + msg.text()); });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('#rle .chapter__viz .rle-card', { timeout: 10000 });
  await page.waitForSelector('#huffman canvas', { timeout: 10000 });
  await page.waitForSelector('#lz77 .lz77-card', { timeout: 10000 });
  await page.waitForSelector('#base64 .b64-card', { timeout: 10000 });
  await page.screenshot({ path: path.join(OUT, 'smoke-desktop-full.png'), fullPage: true });
  // Mobile viewport
  await ctx.close();
  const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await m.newPage();
  await mp.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await mp.screenshot({ path: path.join(OUT, 'smoke-mobile-full.png'), fullPage: true });
  // 단원별 클로즈업
  for (const id of ['intro', 'rle', 'huffman', 'lz77', 'base64', 'sum']) {
    const desktop2 = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const dp = await desktop2.newPage();
    await dp.goto(URL + '#' + id, { waitUntil: 'networkidle', timeout: 30000 });
    await dp.waitForTimeout(800);
    const el = await dp.$('#' + id);
    if (el) await el.screenshot({ path: path.join(OUT, `smoke-${id}.png`) });
    await desktop2.close();
  }
  await browser.close();
  console.log('ERRORS=' + JSON.stringify(errors));
  if (errors.length) process.exit(2);
})();
