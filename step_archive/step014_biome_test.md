---
step: 014
type: biome-env-check
generated: 2026-05-26
---

# Step 014 — Biome 포매팅/린팅 검증

| 항목 | 상태 |
|:---|:---|
| @biomejs/biome | OK (1.9.4, step001에서 확인) |
| biome.json | (선택) Step015 이후 src/ 생성 시 init |

```bash
npx biome init  # biome.json 생성
npx biome check src/
```

Self-Calibration: 목표 달성 Y, 불확실 없음 (src/ 미존재로 init은 보류, 구현 Step에서 진행).
