---
step: 031-036
type: implementation-setup-bundle
generated: 2026-05-26
---

# Step 031~036 — 구현 환경 통합 노트

## step031: 환경 준비
- node_modules에 vite/biome/stylelint/vitest/playwright/lhci/knip/jscpd/madge 모두 설치됨 (step001~015 검증).
- 신규 필요 의존성 없음.

## step032: 파일 인덱스 (구현 계획)

| 파일 경로 | 신규 | 예상 LOC | 서브에이전트 | 모델 |
|:---|:---|:---|:---|:---|
| index.html | ✅ | 250 | A1 | haiku |
| src/main.js | ✅ | 150 | A2 | haiku |
| src/styles.css | ✅ | 400 | B (CSS) | sonnet (Awwwards 스크린샷 참조 필요) |
| src/algorithms/entropy.js | ✅ | 40 | A3 | haiku |
| src/algorithms/rle.js | ✅ | 60 | A3 | haiku |
| src/algorithms/huffman.js | ✅ | 180 | A4 | haiku |
| src/algorithms/lz77.js | ✅ | 140 | A5 | haiku |
| src/algorithms/base64.js | ✅ | 80 | A6 | haiku |
| src/widgets/controls.js | ✅ | 100 | A7 | haiku |
| src/widgets/entropy-meter.js | ✅ | 60 | A7 | haiku |
| src/widgets/rle-grid.js | ✅ | 120 | A8 | haiku |
| src/widgets/huffman-tree.js | ✅ | 220 | A9 | haiku |
| src/widgets/lz77-tape.js | ✅ | 180 | A10 | haiku |
| src/widgets/base64-bits.js | ✅ | 130 | A11 | haiku |
| **계** | | **~2110** | | |

본 세션은 단일 메인 에이전트로 직접 구현 (서브에이전트 대량 병렬은 토큰 비용 큰 데 비해 단원 LOC가 작아 메인이 효율). CSS는 Awwwards 스크린샷 메모리에 기반하여 메인이 직접 작성.

## step033: jscpd 베이스라인
- src/ 미존재 → 베이스라인 N/A. step037 이후 측정.

## step034: knip 베이스라인
- src/ 미존재 → 베이스라인 N/A. step037 이후 측정.

## step035: 컨텍스트 관리
- 본 세션은 메인 에이전트에서 직접 구현(서브에이전트 미사용).
- 파일 작성 후 같은 파일 재 Read 금지.

## step036: 인코딩 규칙
- ✅ .editorconfig 생성 (utf-8, LF, indent 2).
- ✅ .gitattributes 생성 (* text=auto eol=lf).
- 모든 Write는 UTF-8 / LF / BOM 없음.
