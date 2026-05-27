---
step: 008
type: jscpd-env-check
generated: 2026-05-26
---

# Step 008 — jscpd 코드 중복 탐지 환경 검증

## 결과

| 항목 | 상태 |
|:---|:---|
| jscpd | OK (4.2.4, step001에서 확인) |

## 사용 예시 (참조용)

```bash
npx jscpd src/ --reporters=html,console --output=step_archive/dup-report --min-lines=10
```

## Self-Calibration

- 목표 달성: Y
- 불확실: 없음
