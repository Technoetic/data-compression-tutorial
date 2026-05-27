---
step: 016
chunk: 1
type: research
topic: "데이터 압축과 부호화"
sources_used:
  - https://en.wikipedia.org/wiki/Run-length_encoding
  - https://en.wikipedia.org/wiki/Huffman_coding
collected_at: 2026-05-26
collected_by: Playwright (chromium-headless-shell 1223)
---

# Step 016 — 조사 결과 (chunk 1: RLE + 허프만)

## Step-Back 답변

- **핵심 목적**: 4개 핵심 알고리즘(RLE/허프만/LZ77/Base64) 각각의 (a) 정의 (b) 알고리즘 절차 (c) 대중 앱 사례 (d) 직관적 시각화 후보 를 raw 데이터에서 발췌해 초보자 학습용 카드 자료로 정리한다.
- **영향 Step**: step025(기획), step030(통합 설계), step037(구현).
- **핵심 확인 3가지**: ① 알고리즘 절차의 단계 분해 가능성, ② 인터랙티브 위젯으로 시각화 가능한 부분, ③ 대중 앱 사례 1개 이상 확보.

## 1. RLE (Run-Length Encoding) — 무손실

### 정의 (raw chunk1 line 47 인용)
> "Run-length encoding (RLE) is a form of lossless data compression in which runs of data (consecutive occurrences of the same data value) are stored as a single occurrence of that data value and a count of its consecutive occurrences"

### 알고리즘 절차 (raw line 70~74)
1. Traverse the input data.
2. Count the number of consecutive repeating characters (run length).
3. Store the character and its run length.

예: `"AAAABBBCCDAA"` → `"4A3B2C1D2A"` (12바이트 → 10바이트, 압축률 17%)

### 대중 앱 사례 (raw line 55, 57)
- **CompuServe** 초기 흑백 비트맵 (GIF의 전신).
- **JPEG**: 양자화 후 계수에 RLE 적용.
- **팩스(T.45)**: ITU-T 표준. "대부분 흰색 + 가끔 검은 글자" 구조에 효율적.
- **MacPaint PackBits**, **PCX**, **TGA**.
- **Windows 3.x 부팅 화면** (.rle 파일).

### 직관적 시각화 후보
- 픽셀 격자: 같은 색상 픽셀 연속 영역을 막대그래프 + 숫자로 압축.
- 텍스트 입력 → 좌(원본) / 우(`4A3B2C1D2A`) 분할 표시 + 압축률 % 자동 계산.
- "RLE가 역효과를 내는 경우" 위젯: 모든 문자가 다른 입력 → 2배로 부풀어남.

## 2. Huffman Coding — 무손실 가변 길이 부호화

### 정의 (raw line 80)
> "a Huffman code is a particular type of optimal prefix code that is commonly used for lossless data compression"

David A. Huffman, MIT 1952년 논문 "A Method for the Construction of Minimum-Redundancy Codes".

### 작동 원리 (raw line 82)
- 빈도가 높은 심볼 → 짧은 비트열, 빈도가 낮은 심볼 → 긴 비트열.
- **Prefix-free**: 한 심볼의 비트열이 다른 심볼의 prefix가 될 수 없음 → 구분자 불필요.
- 시간 복잡도: 정렬된 입력 가중치 기준 선형.

### 예시 트리 (raw line 61~78, "this is an example of a huffman tree")

| Char | Freq | Code |
|:---|:---|:---|
| space | 7 | 111 |
| a | 4 | 010 |
| e | 4 | 000 |
| f | 3 | 1101 |
| h | 2 | 1010 |
| i | 2 | 1000 |
| m | 2 | 0111 |
| n | 2 | 0010 |
| s | 2 | 1011 |
| t | 2 | 0110 |
| l | 1 | 11001 |
| o | 1 | 00110 |
| p | 1 | 10011 |
| r | 1 | 11000 |
| u | 1 | 00111 |
| x | 1 | 10010 |

ASCII 8비트 = 288비트 → 허프만 135비트(약 53% 절감).

### 알고리즘 절차 (Bottom-up tree build)
1. 각 심볼을 빈도수 노드로 만든 우선순위 큐 구성.
2. 가장 빈도 낮은 두 노드를 부모로 합침 (부모 빈도 = 자식 합).
3. 큐가 1개 노드만 남을 때까지 반복.
4. 루트→좌측=0, 루트→우측=1 (관행)로 코드 할당.

### 대중 앱 사례
- **DEFLATE 알고리즘의 2단계**: ZIP, PNG, HTTP gzip, .docx, .xlsx (Office Open XML).
- **JPEG / MP3** 엔트로피 코딩 단계.
- **fax modified Huffman code**.

### 직관적 시각화 후보
- 사용자 텍스트 입력 → 자동 빈도 히스토그램 → 트리 구성 애니메이션 (canvas).
- 트리의 각 노드 hover → 해당 심볼의 코드 비트열 강조.
- 원본 ASCII 비트열 vs 허프만 비트열 길이 비교 막대 + 절감률 %.

## CoVe 체크 (chunk 1)
- [x] 알고리즘 절차 단계 분해 (RLE 3단계, 허프만 4단계)
- [x] 인터랙티브 위젯 후보 명시
- [x] 대중 앱 사례 각 알고리즘 3개 이상
- [x] raw 데이터 line 번호 인용으로 출처 추적성 확보
