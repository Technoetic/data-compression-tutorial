---
step: 004
type: axe-core-env-check
generated: 2026-05-26
---

# Step 004 — @axe-core/playwright 환경 검증

## 결과

| 항목 | 상태 |
|:---|:---|
| @axe-core/playwright | OK (node_modules에 설치됨, AxeBuilder import 성공) |
| Playwright 의존성 | OK (step003에서 검증) |

## 사용 예시 (참조용)

```js
const { AxeBuilder } = require('@axe-core/playwright');
const { chromium } = require('playwright');
// ...
const results = await new AxeBuilder({ page }).analyze();
```

## Self-Calibration

- 목표 달성: Y
- 불확실: 없음
