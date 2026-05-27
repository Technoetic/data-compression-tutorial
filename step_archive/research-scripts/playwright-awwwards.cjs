// @MX:NOTE: step022 Awwwards 5개 URL 일괄 수집. 단일 스크립트로 5개 사이트 직렬 수집해 동시 띄움 부담 줄임.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_SS = path.join(ROOT, 'screenshots/research');
fs.mkdirSync(OUT_SS, { recursive: true });

const TARGETS = [
  { name: 'ciechanowski', url: 'https://ciechanow.ski/' },
  { name: 'distill', url: 'https://distill.pub/' },
  { name: 'linear', url: 'https://linear.app/' },
  { name: 'vercel', url: 'https://vercel.com/' },
  { name: 'visualgo', url: 'https://visualgo.net/en' },
];

const VIEWPORTS = [
  { tag: 'desktop', width: 1920, height: 1080 },
  // mobile은 필요한 사이트에만 추가 — 본 튜토리얼은 desktop 중심
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const t of TARGETS) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      try {
        await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForTimeout(3000);
        const ssPath = path.join(OUT_SS, `awwwards-${t.name}-home-${vp.tag}.png`);
        await page.screenshot({ path: ssPath, fullPage: true });
        const content = await page.evaluate(() => document.body.innerText);
        const txtPath = path.join(ROOT, `awwwards-${t.name}-content.txt`);
        fs.writeFileSync(
          txtPath,
          `# SOURCE: ${t.url}\n# VIEWPORT: ${vp.tag} ${vp.width}x${vp.height}\n# COLLECTED_AT: ${new Date().toISOString()}\n\n` + content,
          'utf8'
        );
        console.log(`[${t.name}/${vp.tag}] OK ss=${ssPath}`);
      } catch (e) {
        console.error(`[${t.name}/${vp.tag}] FAIL`, e.message);
      } finally {
        await ctx.close();
      }
    }
  }
  await browser.close();
})();
