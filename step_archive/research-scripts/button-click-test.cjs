// @MX:NOTE: 컨트롤 버튼(Reset / 단계 / 자동) 동작 검증 + 단원별 스크린샷.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = 'http://localhost:5173/';
const OUT = path.resolve(__dirname, '../screenshots/buttons');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push('pageerror: ' + err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('console: ' + msg.text()); });

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);

  const chapters = ['intro', 'rle', 'huffman', 'lz77', 'base64'];
  const report = [];

  for (const id of chapters) {
    const sec = '#' + id;
    await page.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sec);
    await page.waitForTimeout(300);

    // 초기 step-meter 값 (입력이 textarea에 있으니 0/N 또는 N/N)
    const before = await page.textContent(`${sec} .step-meter`);
    const inspBefore = await page.textContent(`${sec} [data-role=inspector]`);

    // 1) Reset 클릭 → cursor = 0
    await page.click(`${sec} [data-action=reset]`);
    await page.waitForTimeout(150);
    const afterReset = await page.textContent(`${sec} .step-meter`);
    const inspReset = await page.textContent(`${sec} [data-role=inspector]`);
    await page.screenshot({ path: path.join(OUT, `${id}-after-reset.png`), clip: await clipOf(page, sec) });

    // 2) Step 클릭 → cursor++ (3번 연속)
    await page.click(`${sec} [data-action=step]`);
    await page.click(`${sec} [data-action=step]`);
    await page.click(`${sec} [data-action=step]`);
    await page.waitForTimeout(150);
    const afterStep3 = await page.textContent(`${sec} .step-meter`);
    const inspStep = await page.textContent(`${sec} [data-role=inspector]`);
    await page.screenshot({ path: path.join(OUT, `${id}-after-step3.png`), clip: await clipOf(page, sec) });

    // 3) Auto 클릭 → setInterval 380ms × snapshots 까지
    await page.click(`${sec} [data-action=auto]`);
    await page.waitForTimeout(2200);  // auto가 끝까지 도달할 시간
    const afterAuto = await page.textContent(`${sec} .step-meter`);
    const inspAuto = await page.textContent(`${sec} [data-role=inspector]`);
    await page.screenshot({ path: path.join(OUT, `${id}-after-auto.png`), clip: await clipOf(page, sec) });

    report.push({
      id,
      meter: { before: before?.trim(), afterReset: afterReset?.trim(), afterStep3: afterStep3?.trim(), afterAuto: afterAuto?.trim() },
      inspector: { before: inspBefore?.trim()?.slice(0, 80), reset: inspReset?.trim()?.slice(0, 80), step: inspStep?.trim()?.slice(0, 80), auto: inspAuto?.trim()?.slice(0, 80) },
    });
  }

  fs.writeFileSync(path.join(__dirname, '..', 'button-click-report.json'), JSON.stringify({ errors, report }, null, 2));
  console.log(JSON.stringify({ errors, report }, null, 2));
  await browser.close();
})();

async function clipOf(page, sel) {
  const box = await page.evaluate(s => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.max(0, r.left), y: Math.max(0, r.top), width: Math.min(1366, r.width), height: Math.min(900, r.height) };
  }, sel);
  return box || { x: 0, y: 0, width: 1366, height: 900 };
}
