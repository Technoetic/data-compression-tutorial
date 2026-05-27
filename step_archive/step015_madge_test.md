---
step: 015
type: madge-env-check
generated: 2026-05-26
---

# Step 015 — madge 순환 의존성 검증

| 항목 | 상태 |
|:---|:---|
| madge | OK (8.0.0, step001에서 확인) |

```bash
npx madge --circular src/
npx madge --image step_archive/depgraph.svg src/
```

@MX 태그 의무화 진입점 도달. step015 이후 모든 신규 소스(.js/.ts/.html/.css 등)는 최소 `@MX:NOTE` 1개 부착.

Self-Calibration: 목표 달성 Y, 불확실 없음.
