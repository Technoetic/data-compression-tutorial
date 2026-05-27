---
step: 016
chunk: 3
type: research
topic: "데이터 압축과 부호화"
sources_used:
  - https://en.wikipedia.org/wiki/Entropy_(information_theory)
  - https://en.wikipedia.org/wiki/Deflate
collected_at: 2026-05-26
collected_by: Playwright
---

# Step 016 — 조사 결과 (chunk 3: 정보 엔트로피 + DEFLATE + 종합)

## 5. 정보 엔트로피 (Shannon Entropy) — 압축의 이론적 하한

### 정의 (raw chunk5 발췌)
- 정보의 "예측 불가능성"을 측정한 값.
- $H(X) = -\sum_i p(x_i) \log_2 p(x_i)$ (단위: 비트/심볼).
- 모든 심볼이 동일 확률이면 엔트로피 최대(= $\log_2 N$ 비트).
- 한 심볼만 거의 나오면 엔트로피 거의 0 → 압축 가능성 거대.

### 직관
- "AAAAA...A" (1종) → 엔트로피 ≈ 0 → 압축률 거의 100%.
- "abcdefghij..." (랜덤) → 엔트로피 ≈ $\log_2 26$ → 압축 사실상 불가능.
- **압축 알고리즘이 만들어낼 수 있는 최저 비트수의 이론적 하한이 엔트로피**.

### 직관적 시각화 후보
- 사용자 입력 → 문자 빈도 히스토그램 → 옆에 $H(X)$ 실시간 계산.
- 압축 알고리즘 결과 길이를 엔트로피 하한과 비교 (얼마나 이상적인가).

## 6. DEFLATE — LZ77 + Huffman의 결합 (실세계 압축의 사실상 표준)

### 정의 (raw chunk6 line 64)
> "Deflate ... is a lossless data compression algorithm that uses a combination of LZ77 and Huffman coding. It was designed by Phil Katz, for version 2 of his PKZIP archiving tool."

RFC 1951 (1996). 특허 만료 → 광범위 채택.

### 적용 형식 (raw line 66)
- **zlib** 데이터 포맷
- **gzip** 파일 포맷 (HTTP `Content-Encoding: gzip`)
- **PNG** 이미지
- **ZIP** 파일

### 2단계 압축 (raw line 85~88)
1. **Matching/replacing duplicate strings with pointers** (LZ77)
2. **Replacing symbols with new, weighted symbols based on use frequency** (Huffman)

### 블록 구조 (raw line 74~83)
- 3비트 헤더: BFINAL(1bit) + BTYPE(2bit)
- BTYPE 00: 비압축 (예: 이미 압축된 데이터)
- BTYPE 01: 정적 Huffman (RFC 사전 정의 트리)
- BTYPE 10: 동적 Huffman (블록마다 최적 트리 생성)
- match length: 3~258 bytes, 거리: 1~32,768 bytes (32 KiB sliding window)

### 직관적 시각화 후보
- "RLE/허프만/LZ77/Base64"를 다 본 후 마지막 챕터에서 "PNG/ZIP은 어떻게 만들어지나" 흐름 다이어그램.
- "당신이 만든 텍스트 → LZ77 토큰 → Huffman 부호 → 비트열" 3단 파이프라인 시각화.

## 7. 4개 알고리즘 종합 비교표 (튜토리얼 메인 테이블)

| 알고리즘 | 유형 | 압축 효율 | 시각화 난이도 | 대표 사용처 | 학습 순서 |
|:---|:---|:---|:---|:---|:---:|
| **RLE** | 무손실 | 반복 데이터에만 효과 | ⭐ 매우 쉬움 | 팩스, BMP/RLE, JPEG 후처리 | 1 |
| **Huffman** | 무손실(엔트로피) | 빈도 편향에 유리 | ⭐⭐ 트리 그리기 필요 | DEFLATE 2단계, MP3, JPEG | 2 |
| **LZ77** | 무손실(사전식) | 반복 패턴에 강함 | ⭐⭐⭐ 슬라이딩 윈도우 | DEFLATE 1단계, GIF, 7z | 3 |
| **Base64** | 부호화(인코딩) | 33% **증가** | ⭐ 매우 쉬움 | 이메일, data URI, JWT, QR | 4 |

## 8. 튜토리얼 단원 구성 권고 (step025/030 입력)

1. **인트로**: "압축은 왜 가능한가?" → 정보 엔트로피 미니 설명 + 인터랙티브 엔트로피 미터.
2. **RLE 단원**: 가장 쉬운 사례. 색상 픽셀 격자 위젯.
3. **Huffman 단원**: 빈도 → 트리 → 비트열 3단 위젯.
4. **LZ77 단원**: 슬라이딩 윈도우 + 매칭 시각화.
5. **Base64 단원**: 압축 아닌 부호화. 이메일/JWT 사례.
6. **종합**: PNG/ZIP은 LZ77+Huffman 조합임을 보여주는 파이프라인 다이어그램.

## 9. 디자인 제약 재확인 (TOPIC.md + CLAUDE.md AI Slop 방지)

- 다크 OLED 배경, 단일 액센트 컬러 1개.
- 폰트: Helvetica Neue (본문) + JetBrains Mono (코드/비트열).
- 8px 그리드, 패딩 ≤ 마진, 44pt 터치 타겟.
- 폼 디자인 발명 금지, 토큰 조립만.
- 외부 무거운 의존성 0 (Tailwind/Shadcn 토큰 수준에만).

## CoVe 체크 (chunk 3)
- [x] 정보 엔트로피의 압축 하한 의미 명시
- [x] DEFLATE = LZ77 + Huffman 결합 명시 (PNG/ZIP/gzip 통일 설명)
- [x] 4개 알고리즘 종합 비교표 (튜토리얼 메인 표 활용)
- [x] 단원 구성 권고 + 디자인 제약 재확인
