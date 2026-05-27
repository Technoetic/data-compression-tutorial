---
step: 025+027+028+029
chunk: 4
type: planning-augmented
source: step018 (API계약) + step019 (레포코드) + step023/024 (Awwwards UX) 반영
generated: 2026-05-26
---

# 기획 보강 통합 — step027/028/029 결과

## A. step018 API 계약 반영 (step027)

step018 chunk1의 다음 항목을 본 기획에 그대로 채택:

```js
// @MX:ANCHOR: 단원 모듈 공통 시그니처. fan_in = 4
// @MX:REASON: 4단원 모두 동일 ChapterResult 형태 반환 → UI 컴포넌트 일관성
const ChapterResult = {
  inputLength: Number,
  outputLength: Number,
  ratio: Number,
  steps: Array<StepRecord>,
  verdict: 'compressed' | 'inflated' | 'neutral',
};
```

### 단원별 함수 시그니처 (최종 채택)

| 단원 | 인코드 | 디코드 |
|:---|:---|:---|
| RLE | `encodeRLE(input)` | `decodeRLE(encoded)` |
| Huffman | `encodeHuffman(input)` | `decodeHuffman(bits, codeTable)` |
| LZ77 | `encodeLZ77(input, windowSize=32)` | `decodeLZ77(tokens)` |
| Base64 | `encodeBase64Step(input)` | `decodeBase64Step(b64)` |

### 에러 모드

- 빈 입력 → `ratio=0, tokens=[]` 반환, 예외 던지지 않음.
- 입력 길이 >10000자 → UI에서 제한 (학습용 sweet spot 100~500).
- 비ASCII → UTF-8 인코딩으로 처리, Base64 정상.

## B. step019 참고 레포 코드 분석 반영 (step028)

step019 chunk1의 결정 사항을 본 기획에 그대로 채택:

- **단일 HTML + vanilla JS** (lz77-demo가 입증).
- **단원별 카드 4개 + 종합 1개**.
- **Step/Auto/Reset 표준 컨트롤** (lz77-demo 차용).
- **Canvas는 Huffman 트리 + LZ77 슬라이딩만**.
- **단계 스냅샷 배열 + 스크러버** (huffman-visualization 차용).
- **인스펙터 패널** (lz77-demo 차용 — 현재 상태 텍스트 표시).

## C. step023 Awwwards UX 반영 (step029)

step023 chunk1·2의 다음 결정을 본 기획에 통합:

### C-1. 디자인 토큰 (step023 chunk1)

이미 step025 chunk1·2에 그대로 채택. 추가 없음.

### C-2. 단원 4박자 (step023 chunk2 B축)

- 개념 텍스트 (좌·상단)
- 입력 영역
- 시각화 캔버스/DOM
- 결과 패널

### C-3. 컨트롤 표준 (step023 chunk2 C축)

`[← Reset] [Step ▶] [Auto ▶▶]` + 단원별 인스펙터.

### C-4. 페이지 스크롤 구조 (step023 chunk2 D축)

```
헤더 + 단원 앵커 네비
§0 인트로 (정보 엔트로피)
§1 RLE
§2 Huffman
§3 LZ77
§4 Base64
§5 종합 (PNG/ZIP 파이프라인)
푸터
```

이미 step025 chunk1과 일치.

### C-5. 11가지 미학 축 최종 확정

- **Dark OLED Luxury** (linear.app) + **Swiss Minimalism** (vercel.com) 하이브리드.
- 다크 OLED 배경 + 단일 액센트(녹) + 8px 그리드 + 절제된 시각화.

## D. 보강 후 단원별 모듈 책임 매트릭스

| 단원 | algorithms/ | widgets/ | 시각화 방식 |
|:---|:---|:---|:---|
| §0 인트로 | entropy.js | entropy-meter.js | DOM 막대 + 숫자 |
| §1 RLE | rle.js | rle-grid.js | DOM 픽셀 격자 |
| §2 Huffman | huffman.js | huffman-tree.js | DOM 히스토그램 + Canvas 트리 |
| §3 LZ77 | lz77.js | lz77-tape.js | DOM 테이프 + 색상 토글 |
| §4 Base64 | base64.js | base64-bits.js | DOM 비트열 + 알파벳 매핑 |
| §5 종합 | (정적) | (정적 다이어그램) | 정적 SVG/HTML |

## CoVe (chunk 4)

- [x] step018 함수 시그니처 채택
- [x] step019 단일 HTML + vanilla JS + 컨트롤 표준 채택
- [x] step023 토큰·단원 4박자·미학 축 채택
- [x] 11가지 미학 축 최종 (Dark OLED + Swiss)
- [x] 단원별 모듈 책임 매트릭스 명시
