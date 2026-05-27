---
step: 016
chunk: 2
type: research
topic: "데이터 압축과 부호화"
sources_used:
  - https://en.wikipedia.org/wiki/LZ77_and_LZ78
  - https://en.wikipedia.org/wiki/Base64
collected_at: 2026-05-26
collected_by: Playwright
---

# Step 016 — 조사 결과 (chunk 2: LZ77 + Base64)

## 3. LZ77 (Lempel-Ziv 1977) — 사전식 무손실

### 정의 (raw chunk3 line 44)
> "LZ77 and LZ78 are the two lossless data compression algorithms published in papers by Abraham Lempel and Jacob Ziv in 1977 and 1978 ... formed the basis of several ubiquitous compression schemes, including the one used in GIF and the DEFLATE algorithm used in PNG and ZIP."

2004년 IEEE 마일스톤 지정. 2021년 Jacob Ziv는 IEEE Medal of Honor 수상.

### 핵심 아이디어 (raw line 91)
> "LZ77 algorithms achieve compression by replacing repeated occurrences of data with references to a single copy of that data existing earlier in the uncompressed data stream. A match is encoded by a pair of numbers called a length–distance pair"

`(D, L, c)` 튜플 출력:
- **D** = distance (이전 위치까지 거리, 보통 last 2KB/4KB/32KB sliding window)
- **L** = length (일치 길이)
- **c** = 일치 후 다음 문자

### 의사코드 (raw line 107~117)
```
while input is not empty do
    match := longest repeated occurrence of input that begins in window
    if match exists then
        d := distance to start of match
        l := length of match
        c := char following match in input
    else
        d := 0; l := 0; c := first char of input
    end if
    output (d, l, c)
    advance input by l+1
end while
```

### 직관: "방금 본 거 복사해 붙여넣기"
"abcdeabcde" → `(0,0,a)(0,0,b)(0,0,c)(0,0,d)(0,0,e)(5,5,?)` — 처음 5문자 후 같은 5문자가 5칸 전에 있으므로 길이 5 거리 5로 표현.

### 대중 앱 사례
- **DEFLATE**: ZIP/PNG/gzip/zlib 모두 LZ77 + Huffman 조합 (다음 chunk 참조).
- **GIF**의 LZW도 LZ78 계열 변형.
- **LZSS, LZMA(7z), Brotli**도 LZ77 family.

### 직관적 시각화 후보
- 입력 텍스트 위에 sliding window를 시각적으로 슬라이드 (CSS transform).
- 매칭된 부분과 참조하는 이전 위치를 연결선(SVG line)으로 표시.
- `(D, L, c)` 토큰 스트림을 우측 패널에 누적 표시.

## 4. Base64 — 부호화(인코딩, 압축 아님)

### 정의 (raw chunk4 line 56)
> "Base64 is a binary-to-text encoding that uses 64 printable characters to represent each 6-bit segment of a sequence of byte values."

압축이 아닌 **부호화(encoding)**임. 크기는 오히려 33% **증가**한다 (raw line 58).

### 알파벳 (raw line 91~114, RFC 4648 §4)
- 0~25: A~Z
- 26~51: a~z
- 52~61: 0~9
- 62: `+`
- 63: `/`
- 패딩: `=`

**Base64URL**은 `+→-`, `/→_`로 치환해 URL 안전.

### 변환 절차 (raw line 133~138)
1. 입력 바이트 시퀀스를 6비트 단위로 묶음.
2. 각 6비트(0~63) → 알파벳 1글자.
3. 입력 길이가 3의 배수가 아니면 `=` 패딩.

예: "Man" (77, 97, 110) = `01001101 01100001 01101110` → `010011 010110 000101 101110` → `T W F u` → `TWFu`.

### 대중 앱 사례 (raw line 65~90)
- **웹 페이지**: `data:` URI로 이미지/폰트를 CSS·HTML에 임베드.
- **이메일 첨부**: SMTP는 7비트 ASCII만 전송 가능 → 첨부파일을 Base64로.
- **JWT 토큰**: header.payload.signature 각각 Base64URL.
- **암호화 키 / PGP fingerprint** 표시.
- **QR 코드**: 텍스트 디코딩이 바이너리보다 신뢰성 높음.
- **SVG 안의 JPEG 임베드**.

### 직관적 시각화 후보
- 입력 바이트(텍스트/이미지) → 8비트 비트열 → 6비트 재그루핑 → Base64 문자 매핑 4단계 애니메이션.
- "Man" 같은 짧은 예시로 한 글자씩 색상 매칭.
- 패딩(`=`) 발생 조건 토글 (입력 길이 1·2·3 mod 3 비교).

## CoVe 체크 (chunk 2)
- [x] LZ77의 length-distance 쌍 정의 + 의사코드
- [x] Base64는 "압축이 아닌 부호화" 명시 (33% 증가)
- [x] 각각 대중 앱 사례 4개 이상 + 인터랙티브 위젯 후보
- [x] raw 데이터 line 번호 인용
