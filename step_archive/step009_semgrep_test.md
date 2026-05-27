---
step: 009
type: semgrep-env-check
generated: 2026-05-26
---

# Step 009 — Semgrep 정적 분석 검증

## 결과

| 항목 | 상태 |
|:---|:---|
| Python | OK (3.12.7) |
| pip | OK (25.3) |
| semgrep | OK (1.162.0, pip install --quiet 으로 신규 설치) |

## 사용 예시 (참조용)

```bash
semgrep --config=p/javascript src/
semgrep --config=p/security-audit src/
```

## Self-Calibration

- 목표 달성: Y
- 불확실: 없음
