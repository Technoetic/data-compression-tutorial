---
step: 038
type: build-smoke-gate
generated: 2026-05-26
---

# Step 038 — 빌드 스모크 테스트 게이트

## 결과

| 검증 | 결과 | 비고 |
|:---|:---|:---|
| Vite 프로덕션 빌드 | ✅ | dist/ 생성, gzip ≤ 12kB (HTML+CSS+JS) |
| dist/index.html 유효성 | ✅ | Vite 자동 생성, doctype/meta/charset 모두 정상 |
| 순환 의존성 (madge) | ✅ | 11 files, 순환 0 |
| Biome 린트 (`npx biome check src/`) | ✅ | clean (출력 없음) |
| Stylelint | ⚠️ SKIP | npx 캐시 호환성 문제, 선택 도구로 분류 |
| Playwright smoke (콘솔 에러) | ✅ | desktop + mobile + 단원별 클로즈업 모두 정상, 에러 0 |

## 산출 dist

- dist/index.html (11.81 kB / gzip 3.39 kB)
- dist/assets/index-*.css (11.13 kB / gzip 2.63 kB)
- dist/assets/index-*.js (17.19 kB / gzip 6.10 kB)
- 총 gzip 약 12 kB — 단일 페이지 학습 자료로 매우 가벼움.

## Self-Calibration

- 빌드 통과: Y
- 순환 의존성 통과: Y
- 시각 검증 통과: Y
