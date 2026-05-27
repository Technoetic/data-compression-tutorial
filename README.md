# 데이터 압축과 부호화 — 인터랙티브 학습 튜토리얼

5단원(엔트로피 / RLE / Huffman / LZ77 / Base64) + 종합 단원으로 구성된 단일 페이지 학습 자료. 모든 알고리즘이 클라이언트 측에서 즉시 계산되며 Step / Auto / Reset 컨트롤로 한 단계씩 시각화한다.

## 단원 구성

| 단원 | 주제 | 시각화 |
|:---|:---|:---|
| §0 | 정보 엔트로피 (Shannon) | 빈도 히스토그램 + 압축 여유 게이지 |
| §1 | RLE (Run-Length Encoding) | 격자 + 토큰 칩 |
| §2 | Huffman 부호화 | Canvas 트리 + 부호 사전 |
| §3 | LZ77 슬라이딩 윈도우 | 테이프 + 매치 화살표 + (D,L,c) 토큰 |
| §4 | Base64 부호화 | ASCII → 8비트 → 6비트 → 알파벳 5단계 보드 |
| §5 | DEFLATE 종합 | LZ77 + Huffman 파이프라인 |

## 실행

```bash
npm install
npx vite           # dev server (http://localhost:5173/)
npx vite build     # dist/ 정적 빌드
npx vite preview   # 빌드 미리보기
npx vitest run     # 테스트 (82 cases)
```

## 기술

- 빌드: Vite + ESM
- 외부 런타임 의존성 0 (vanilla JS + Canvas API)
- 테스트: Vitest (82/82 PASS)
- 접근성: axe-core 위반 0 / WCAG 2 AA 색상 대비
- 다크 OLED + 단일 액센트 디자인 토큰
- gzip 약 12 KB (HTML + CSS + JS 합계)

## 호스팅

`main` 브랜치 푸시 시 GitHub Pages Actions가 자동 빌드·배포한다.

## 라이선스

MIT
