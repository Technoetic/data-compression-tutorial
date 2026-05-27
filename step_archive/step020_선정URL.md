---
step: 020
type: awwwards-site-selection
collected_at: 2026-05-26
---

# Step 020 — Awwwards 디자인 조사 사이트 선정

## 프로젝트 특성 추출 (step016 + TOPIC.md 기준)

- 유형: **학습용 인터랙티브 웹앱** (튜토리얼)
- 기능: **데이터 시각화** (트리, 빈도 히스토그램, 슬라이딩 윈도우, 비트 매핑)
- 대상: **초보자** (직관적 이해 우선)
- UI: **다크 OLED + 단일 액센트**, 단일 페이지 스크롤, 단원 카드형
- 인터랙션: 입력 → 즉시 계산 → 시각화 패널 → Step/Auto/Reset 컨트롤

## 특성별 질문 → 선정 URL

### Q1. "데이터 시각화 + 인터랙티브 학습"을 잘 구현한 사이트?

- **https://distill.pub/** — 머신러닝/통계 시각화 학습 사이트. 인라인 인터랙티브 위젯, 스크롤 기반 학습 흐름.
- **https://ciechanow.ski/** — Bartosz Ciechanowski 개인 사이트. 광학·물리·역학을 스크롤·드래그 가능한 인터랙티브 시각화로 설명. 학습용 시각화의 사실상 표준.

### Q2. "다크 OLED + 단일 액센트"가 깔끔한 사이트?

- **https://linear.app/** — 다크 모드 기본. 단일 액센트(보라/파랑). 폰트·간격 토큰 매우 엄격. 우리 색상 시스템 참고.
- **https://vercel.com/** — 검정 배경 + 흰색 텍스트 + 단일 액센트(파랑). 8px 그리드 엄격.

### Q3. "코드/알고리즘 학습 사이트" 컨셉?

- **https://visualgo.net/** — 자료구조·알고리즘 시각화. 단계 컨트롤, 인스펙터 패널의 표준.
- **https://www.algorithm-archive.org/** — 학습용 알고리즘 아카이브.

### Q4. "단일 페이지 + 단원 카드 스크롤" 구조?

- **https://github.com/about** — 단원별 카드형 스크롤. 슬롯 기반 컴포넌트 구조.

## 최종 선정 5개 URL (조사 대상)

| URL | 선정 이유 | 조사할 뷰포트 |
|:---|:---|:---|
| **https://ciechanow.ski/** | 인터랙티브 학습 시각화의 사실상 표준. 드래그/슬라이더로 즉시 결과를 보여주는 메타포 차용. | desktop, mobile |
| **https://distill.pub/** | 학습용 다이어그램 + 인라인 인터랙티브. 본문과 위젯의 자연스러운 결합. | desktop, tablet |
| **https://linear.app/** | 다크 OLED + 단일 액센트 + 토큰 디자인의 모범. 색상·타이포·간격 시스템 참고. | desktop, mobile |
| **https://vercel.com/** | 8px 그리드 + 검정 배경 + 미니멀. 우리 디자인 제약과 일치. | desktop |
| **https://visualgo.net/en** | 알고리즘 시각화 컨트롤 패턴 (Step/Auto/Reset)의 원형. | desktop |

## 선정 이유 종합

- ciechanow.ski + distill.pub: **인터랙티브 학습 시각화 메타포**.
- linear.app + vercel.com: **다크 디자인 토큰 시스템**.
- visualgo.net: **알고리즘 컨트롤 표준 (Step/Auto/Reset)**.

## Self-Calibration

- 이전 실패 패턴 회피: ✅ (이전 세션에서 "하이브리드 암호 튜토리얼" 진행 시 디자인 조사가 늦어진 실수가 있었으므로 step020에 명확한 5개 선정).
- ⚠️ memory의 `feedback_no_hybrid_crypto_ref.md` 준수: 이전 튜토리얼 구조·선례를 본 단계 결과에 박지 않음.

## 다음 Step (step021~024)

- step021/022/023/024가 Playwright로 각 URL을 방문해 스크린샷 + 텍스트 수집.
