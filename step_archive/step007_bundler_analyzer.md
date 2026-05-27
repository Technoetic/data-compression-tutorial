---
step: 007
type: bundler-analyzer-check
generated: 2026-05-26
---

# Step 007 — 번들 분석 도구 검증

## 판단

- package.json 없음 → "판단 불가" 분기 → **source-map-explorer** 채택 (범용, 단일 HTML/번들 둘 다 가능).
- 본 튜토리얼은 단일 HTML 우선이라 실제 사용은 선택적이지만, 번들 분기 시 대비.

## 결과

| 항목 | 상태 |
|:---|:---|
| source-map-explorer | OK (npm install -D 후 node_modules에 존재) |

## Self-Calibration

- 목표 달성: Y
- 불확실: 단일 HTML이면 본 도구가 실제로 호출되지 않을 가능성. 다만 부재 시 step의 통과 조건을 못 충족하므로 사전 설치.
