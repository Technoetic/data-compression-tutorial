const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:5176/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const r = await new AxeBuilder({ page }).analyze();
  fs.writeFileSync('step_archive/a11y-detail.json', JSON.stringify(r.violations.map(v => ({
    id: v.id, impact: v.impact,
    nodes: v.nodes.map(n => ({ target: n.target, html: n.html.slice(0, 200), failureSummary: n.failureSummary }))
  })), null, 2));
  console.log('written');
  await browser.close();
})();
