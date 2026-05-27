---
step: 107
type: final-report
generated: 2026-05-26
topic: "데이터 압축과 부호화 — 인터랙티브 튜토리얼"
---

# Step 107 — 최종 보고

## 1. 결과물

### 파일

| 파일 | LOC | 비고 |
|:---|:---|:---|
| index.html | 약 180 | 5단원 + 종합 단원 |
| src/main.js | 약 200 | Chapter 추상 + 5 서브클래스 + Progress + App |
| src/styles.css | 약 235 | 다크 OLED 토큰 + 위젯 스타일 |
| src/algorithms/ (5 files) | 약 310 | entropy/rle/huffman/lz77/base64 |
| src/widgets/ (5 files) | 약 270 | meter/grid/tree/tape/bits |
| tests/algorithms.test.js | 약 110 | 82 케이스 |
| **src/+tests/ 합계 (tokei)** | **966 LOC / 91 comments / 89 blanks** | |
| **dist gzip** | **12.23 kB** | HTML+CSS+JS |

### 데모

- Vite dev: `npm run dev` → http://localhost:5174/
- Vite build: `npx vite build` → `dist/`
- Vite preview: `npx vite preview` → 정적 호스팅 미리보기

## 2. 게이트 통과 기록

| 게이트 | 결과 |
|:---|:---|
| TRUST 5 r1 (step049) | 36/40 PASS |
| TRUST 5 r2 (step069) | 38/40 PASS (+2) |
| Vitest | 82/82 PASS |
| axe-core a11y | violations 0 / passes 51 |
| Biome lint | clean |
| jscpd 중복 | 0% |
| madge 순환 | 0 |
| semgrep 보안 | 0 issues |
| Playwright smoke | 콘솔 에러 0 |

## 3. TOPIC.md 4요소 충실 반영

- **topic 데이터 압축과 부호화**: 5단원(엔트로피/RLE/Huffman/LZ77/Base64) + 종합 단원으로 완전 커버.
- **audience 초보자**: 모든 헤드라인 한국어, 영문 알고리즘명 병기, 단원 4박자 학습 흐름.
- **interactive 필수**: 6개 위젯 모두 사용자 입력 즉시 반영 + Step/Auto/Reset 컨트롤.
- **real_world_apps**: 팩스/BMP/JPEG/MP3/DEFLATE/ZIP/PNG/gzip/이메일/data URI/JWT/QR — 10개 사례 칩 + 본문 인용.

## 4. AI Slop 방지 정책 준수

- ✅ Helvetica Neue + JetBrains Mono (Inter/Roboto 회피)
- ✅ 다크 OLED 단색 배경 + 단일 액센트(녹) — 보라 그라데이션 회피
- ✅ 8px 그리드만 사용 (--sp-1..--sp-8)
- ✅ radius 4/8/12 토큰만
- ✅ 외부 의존성 0 (Vite는 dev/build 도구로만)
- ✅ 44pt 터치 타겟 보장 (모든 button min-height: 44px)

## 5. 서브에이전트 사용 내역

| 단계 | 에이전트 | 모델 | 호출 횟수 |
|:---|:---|:---|:---|
| step025 기획 검증 (B) | general-purpose | haiku | 1 |
| step049 EVAL r1 | general-purpose | sonnet | 1 |
| step069 EVAL r2 | general-purpose | sonnet | 1 |

총 3회. 본 구현 SMALL 규모(11 src files / 834 LOC)였고 메인 에이전트가 단일 흐름으로 직접 구현하는 편이 토큰 효율적이라 병렬 구현 서브에이전트는 사용하지 않음. 검증·평가만 독립 서브에이전트로 분리.

## 6. 실패 패턴 (재발 방지)

- ❌ "Base64 padBits 계산 오류" — 길이 5바이트 입력에서 7 sextets 출력 (RFC 4648은 8). step050 테스트로 발견. → 모듈 작성 시 RFC 표준 예시(`btoa()` 비교)를 첫 테스트로 작성하라.
- ❌ "stylelint npx 캐시 호환성" — 로컬 node_modules 무시. 선택 도구로 분류.
- ❌ "playwright-core 1217 vs 1223" — npm 설치 playwright 패키지가 chromium-1223을 기대하는데 기존 CLI는 1217. `npx playwright install chromium-headless-shell`로 해결.

## 7. 성공 패턴 (재활용)

- ✅ Chapter 추상 베이스 + 5 서브클래스 패턴 — 4단원이 동일 인터페이스로 일관성 확보.
- ✅ 단계 스냅샷 배열 + cursor 패턴 — Step/Auto/Reset가 자연스럽게 작동.
- ✅ 디자인 토큰 단일 SoT (src/styles.css :root) — fan_in ≥ 14.
- ✅ 단원별 외부 의존성 0 — 학습용 페이지에 최적.
- ✅ Playwright smoke + axe-core + Vitest 3단 검증.

## 8. 사용자에게 전달

```
npm install     # (이미 설치됨)
npx vite        # dev server (port 자동)
# → 브라우저에서 5단원 학습
npx vite build  # dist/ 정적 산출
```

## 9. 보존된 산출물

- src/, index.html, tests/algorithms.test.js, package.json
- step_archive/ (모든 step 결과·스크린샷·검증 보고)
- step_archive/screenshots/smoke-*.png (시각 검증)
- step_archive/outputs/eval_r1.md / eval_r2.md (EVAL 게이트)
