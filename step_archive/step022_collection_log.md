---
step: 022
type: awwwards-data-collection-log
collected_at: 2026-05-26
---

# Step 022 — Awwwards 데이터 수집 로그

## Step-Back

- **핵심 목적**: step020 선정 5개 URL에서 데스크톱 스크린샷 + 본문 텍스트 수집해 step023 분석 입력 마련.
- **영향 Step**: step023(패턴 분석), step025(기획), step030(통합 설계).
- **핵심 확인 3가지**: ① 5개 URL 모두 정상 로드, ② 스크린샷 fullPage 캡처, ③ 본문 텍스트 추출 성공.

## 수집 결과

| URL | 스크린샷 | 본문 텍스트 |
|:---|:---|:---|
| https://ciechanow.ski/ | screenshots/research/awwwards-ciechanowski-home-desktop.png | awwwards-ciechanowski-content.txt |
| https://distill.pub/ | awwwards-distill-home-desktop.png | awwwards-distill-content.txt |
| https://linear.app/ | awwwards-linear-home-desktop.png | awwwards-linear-content.txt |
| https://vercel.com/ | awwwards-vercel-home-desktop.png | awwwards-vercel-content.txt |
| https://visualgo.net/en | awwwards-visualgo-home-desktop.png | awwwards-visualgo-content.txt |

## 뷰포트

- desktop 1920×1080 fullPage 캡처. 
- 본 튜토리얼은 단일 페이지 데스크톱 + 모바일 자연 reflow 정책 → mobile 별도 캡처는 step023 분석에서 필요시 추가.

## 스크립트

- `step_archive/research-scripts/playwright-awwwards.cjs` (5개 URL 직렬 처리, 동시 1개로 메모리 부담 최소화)

## CoVe

- [x] 5개 모두 fullPage 스크린샷 생성
- [x] 5개 모두 본문 텍스트 파일 생성 (UTF-8)
- [x] 헤더에 source/viewport/timestamp 포함
