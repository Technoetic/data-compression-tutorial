---
step: 025+026
chunk: 3
type: planning-augmented
source: step017 (GitHub 조사) 반영
generated: 2026-05-26
---

# Step 026 — 기획 보강 (GitHub 조사 반영)

## 1. step017 결과 요약

- Huffman 시각화: 108 hits, 1위 `190n/huffman-visualization` ★27 (TS+Vite+Canvas).
- LZ77 시각화: 6 hits — 희소. `valentinbarral/lz77-demo` (vanilla JS 단일 HTML).
- Base64 데모: 33 hits — 시각화 전용 거의 없음.
- 종합 시각화: 80 hits — `mavam/compbench` ★24 (벤치마크 그래프).

## 2. 기획 반영

### 2.1 §2 Huffman 단원 — `190n/huffman-visualization` 메타포 차용

- **단계 스냅샷 배열 + 스크러버**: 트리 빌드 과정을 N개 스냅샷으로 저장, 스크러버(`<input type=range>`)로 재생.
- **Canvas + devicePixelRatio**: 트리는 canvas로 그리되 디스플레이 해상도 대응.
- **빈도 히스토그램은 DOM table**: 행 hover 시 해당 심볼 코드 강조 (canvas redraw 이벤트).

### 2.2 §3 LZ77 단원 — `valentinbarral/lz77-demo` 직접 차용

- **단일 HTML + vanilla JS** 구조 (우리 정책과 정확히 일치).
- **테이프 메타포**: 입력 문자를 `<div>` 박스 시퀀스로 표시.
- **색상 범례 4종**: window(파랑) / checking(테두리) / found(녹색) / fail(빨강).
- **Step/Auto/Reset 3버튼** + **인스펙터** ("Action / Buffer / Window" 텍스트 표시).
- 단, lz77-demo의 spaghetti 480줄 monolithic script.js는 모듈로 분리.
- i18n은 미적용(한국어 단일).

### 2.3 §1 RLE / §4 Base64 — 자체 설계 (참고 레포 없음)

- RLE: 픽셀 격자 위젯 자체 설계.
- Base64: 4단(ASCII → 8비트 → 6비트 그루핑 → 알파벳) 애니메이션 자체 설계.

### 2.4 §5 종합 — `mavam/compbench` 벤치마크 차용

- 4개 알고리즘의 (a) 압축률 (b) 인코딩 시간 (c) 디코딩 시간 비교 막대 차트.
- 단, 학습용이므로 정확한 벤치마크보다 **개념 비교** 우선.
- 예제 문자열 3종("repeated AAAA", "natural English", "random base64") 고정 + 각 알고리즘 처리 결과 표.

## 3. 외부 의존성 정책 재확인

- React/TS/Vite-template은 채용하지 않음 (구조만 차용).
- vanilla JS + 단일 HTML + Vite dev/build (Vite는 dev/build 도구로만 사용, 런타임 의존 0).

## 4. 단원별 라이브러리 결정

| 단원 | 외부 의존성 |
|:---|:---|
| §0 인트로 (엔트로피) | 없음 (vanilla JS) |
| §1 RLE | 없음 |
| §2 Huffman | 없음 (canvas 직접 그리기) |
| §3 LZ77 | 없음 |
| §4 Base64 | `btoa()` (브라우저 내장, 정답 검증용) |
| §5 종합 | 없음 |

## 5. 학습 진행 (시계열)

- 사용자가 §0 인트로 → §1 → §2 → §3 → §4 → §5 순으로 스크롤.
- 각 단원에서 5~10분 학습 가정.
- 총 학습 시간: 30~60분.

## 6. 최종 단원별 LOC 재추정 (보강 후)

| 모듈 | 예상 LOC |
|:---|:---|
| index.html | 250~350 |
| styles.css | 300~400 |
| main.js (DOM 바인딩) | 150~200 |
| algorithms/entropy.js | 40 |
| algorithms/rle.js | 60 |
| algorithms/huffman.js | 180 |
| algorithms/lz77.js | 140 |
| algorithms/base64.js | 80 |
| widgets/controls.js | 100 |
| widgets/rle-grid.js | 120 |
| widgets/huffman-tree.js | 220 (canvas 그리기) |
| widgets/lz77-tape.js | 180 |
| widgets/base64-bits.js | 130 |
| widgets/entropy-meter.js | 60 |
| **합계** | **~2010~2360 LOC** |

## CoVe

- [x] step017 4개 분야(Huffman/LZ77/Base64/종합) 모두 반영 결정 명시
- [x] vanilla JS + 단일 HTML 채택 (참고 레포 lz77-demo와 일치)
- [x] 단원별 외부 의존성 0 확인
- [x] LOC 재추정 (총 2000~2400)
