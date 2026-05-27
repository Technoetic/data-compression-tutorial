---
step: 005
type: c8-env-check
generated: 2026-05-26
---

# Step 005 — c8 코드 커버리지 환경 검증

## 결과

| 항목 | 상태 |
|:---|:---|
| c8 | OK (v11.0.0, step001에서 확인) |
| Node.js V8 inspector | OK (v22.20.0 내장) |

## 사용 예시 (참조용)

```bash
npx c8 --reporter=html --reporter=text vitest run
# 결과: coverage/ 디렉터리에 HTML 리포트, 콘솔에 summary
```

## Self-Calibration

- 목표 달성: Y
- 불확실: 없음
