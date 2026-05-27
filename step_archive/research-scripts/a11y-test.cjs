// @MX:NOTE: step058+ axe-core 접근성 검증
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
  fs.writeFileSync('step_archive/a11y-results.json', JSON.stringify({
    violations: r.violations.length,
    passes: r.passes.length,
    incomplete: r.incomplete.length,
    items: r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length }))
  }, null, 2));
  console.log('VIOLATIONS=' + r.violations.length + ' PASSES=' + r.passes.length);
  await browser.close();
})();
