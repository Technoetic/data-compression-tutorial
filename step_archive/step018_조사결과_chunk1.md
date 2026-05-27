---
step: 018
chunk: 1
type: api-contract-research
topic: "데이터 압축과 부호화 — 내부 모듈 계약 조사"
collected_at: 2026-05-26
---

# Step 018 — API 계약 문서 조사

## Step-Back 답변

- **핵심 목적**: 본 튜토리얼은 외부 API를 호출하지 않는 단일 페이지 웹앱이지만, 단원별 알고리즘 함수의 **순수 함수 계약**(입력 타입/출력 타입/예외 케이스)을 표준화해 step037 구현 시 단원 간 일관성을 확보한다.
- **영향 Step**: step025(기획 - 단원 카드 구조), step030(통합 설계), step037(구현 - 4개 알고리즘 모듈 시그니처).
- **핵심 확인 3가지**: ① 각 알고리즘 함수의 입력/출력 타입 ② 압축률 계산 공통 인터페이스 ③ 에러 모드(빈 입력, 비ASCII, 매우 긴 입력).

## 1. 외부 API 사용 여부

- 사용 안 함. 모든 알고리즘이 **클라이언트 순수 JavaScript**로 구현된다.
- TextEncoder/TextDecoder (Web 표준, IE 외 모든 브라우저 지원) 활용.
- Browser-native `btoa()`/`atob()`은 Base64 단원의 "정답" 비교용으로 부수 활용.

## 2. 단원별 함수 계약 (목표)

### 2.1 RLE 모듈

```js
// @MX:ANCHOR: 단원 모듈 공통 시그니처. fan_in ≥ 4 (4개 단원이 동일 패턴)
// @MX:REASON: 단원 간 UI 컴포넌트(입력 박스 → 결과 패널 → 압축률 막대)가 동일 함수 계약을 가정
export function encodeRLE(input /* string */) /* { tokens: Array<{char,count}>, encoded: string, ratio: number } */;
export function decodeRLE(encoded /* string */) /* string */;
```

- 입력: 문자열(임의 길이, UTF-8). 0~10000자.
- 출력: 토큰 배열 + 직렬화된 문자열 + 압축률(0~1).
- 압축률 = `encoded.length / input.length` (1 미만이면 압축, 1 초과면 부풀음).

### 2.2 Huffman 모듈

```js
export function buildHuffmanTree(input /* string */) /* TreeNode */;
export function encodeHuffman(input) /* { codeTable: Map<char,string>, encodedBits: string, ratio: number } */;
export function decodeHuffman(encodedBits, codeTable) /* string */;
```

- TreeNode: `{ char, freq, left, right }`.
- 비트열은 string of '0'/'1' (학습 가시성 우선, 실제 bitpack은 보너스).
- 압축률 = `encodedBits.length / (input.length * 8)`.

### 2.3 LZ77 모듈

```js
export function encodeLZ77(input /* string */, windowSize = 32 /* small for visualization */)
  /* { tokens: Array<[D,L,c]>, ratio: number } */;
export function decodeLZ77(tokens) /* string */;
```

- 학습용 sliding window는 32(또는 64) 바이트로 축소 → 시각화 가능.
- 토큰 출력은 학습 가시성을 위해 plain array, bitpack은 보너스.

### 2.4 Base64 모듈

```js
export function encodeBase64Step(input /* string */)
  /* { ascii: number[], bits: string, sextets: string[], chars: string[], padding: '=='|'='|'' } */;
export function decodeBase64Step(b64 /* string */) /* string */;
```

- 학습용으로 **단계 객체**를 반환 (각 단계 시각화).
- 정답 비교는 `btoa(input) === chars.join('') + padding`로 검증.

## 3. 공통 인터페이스 — 단원 카드 패턴

```js
// @MX:ANCHOR: 4개 단원 카드의 공통 인터페이스. fan_in = 4 (RLE/Huffman/LZ77/Base64)
// @MX:REASON: 단원별 UI를 같은 컨테이너로 렌더하려면 동일 형태의 결과 객체가 필요
const ChapterResult = {
  inputLength: Number,      // 입력 바이트/문자 길이
  outputLength: Number,     // 출력 비트/문자 길이
  ratio: Number,            // 압축률 (Base64는 >1, 나머지 ≤1 기대)
  steps: Array<StepRecord>, // 단계별 시각화 데이터
  verdict: 'compressed' | 'inflated' | 'neutral',
};
```

## 4. 에러 모드 (계약)

| 입력 | 동작 |
|:---|:---|
| 빈 문자열 `""` | 모든 함수: `ratio=0`, `tokens=[]` 반환 (예외 던지지 않음) |
| 매우 긴 입력 (>10000자) | UI에서 입력 길이 제한 (학습용 sweet spot 100~500자) |
| 비ASCII (한글 등) | UTF-8 인코딩으로 바이트 시퀀스 처리. Base64는 정상, RLE/Huffman은 코드포인트 단위로 작동 |
| 입력에 공백/탭/줄바꿈 | 모두 보존. RLE 시각화에서 공백도 1색 픽셀로 표시 |

## 5. SPEC 자동 생성 hook 연계

- Stop hook의 `spec-generator.ps1`이 `step_archive/specs/SPEC-018.md` 자동 생성.
- Acceptance 기준(예상):
  - **WHAT**: 단원별 함수 계약 명세
  - **WHY**: 4단원 UI 일관성
  - **WHEN**: step037 구현 단계
  - **ACCEPTANCE**: 4개 모듈이 동일 `ChapterResult` 형태 반환

## CoVe 체크

- [x] 단원별 함수 시그니처 4종 명시
- [x] 공통 `ChapterResult` 인터페이스 정의
- [x] 에러 모드 4가지 케이스 명시
- [x] @MX:ANCHOR 부착 (fan_in 근거 명시)
