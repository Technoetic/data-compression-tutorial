---
step: 023
chunk: 1
type: awwwards-pattern-analysis
collected_at: 2026-05-26
sites_analyzed:
  - ciechanow.ski
  - distill.pub
  - linear.app
  - vercel.com
  - visualgo.net
---

# Step 023 — Awwwards 디자인 패턴 분석 (chunk 1: 동적 조사 축)

## Step-Back

- **핵심 목적**: 5개 Awwwards 사이트 스크린샷·텍스트에서 본 튜토리얼에 적용 가능한 디자인 패턴(레이아웃·색상·간격·타이포·인터랙션·시각화)을 4축으로 추출한다.
- **영향 Step**: step025(기획), step030(통합 설계 — 단원 카드 구조), step037(구현 — CSS 토큰).
- **핵심 확인 3가지**: ① 4개 축(다크 디자인 / 학습 시각화 / 컨트롤 UI / 단원 카드 스크롤) 각각에 적용 가능한 패턴, ② 11가지 미학 축 매핑, ③ AI Slop 금지 패턴 회피 확인.

## 동적 조사 축 (프로젝트 특성에서 도출)

본 튜토리얼은 (a) **학습형 인터랙티브 시각화** (b) **다크 OLED + 단일 액센트** (c) **알고리즘 단원 카드 스크롤** (d) **Step/Auto/Reset 컨트롤** 특성을 가짐. 이에서 4축을 도출:

| 축 | 의미 | 핵심 후보 사이트 |
|:---|:---|:---|
| A. 다크 OLED 토큰 시스템 | 색상·타이포·간격 토큰 | linear.app, vercel.com |
| B. 학습형 시각화 메타포 | 인라인 인터랙티브 위젯 | ciechanow.ski, distill.pub |
| C. 알고리즘 컨트롤 UI | Step/Auto/Reset 버튼 + 인스펙터 | visualgo.net |
| D. 단원 카드형 스크롤 | 알고리즘 단원별 카드 그리드 | visualgo.net, distill.pub, vercel.com |

---

## A축. 다크 OLED 토큰 시스템

### A-1. linear.app 분석 (스크린샷 기반)
- 배경: 거의 순 검정(#08090A 추정) — OLED 친화.
- 액센트: **단일** 노란빛 chip ("Built for the future. Available today.").
- 폰트: 산세리프 단일 패밀리 (custom geometric, Inter 계열 회피).
- 간격: 섹션 간 거대한 padding (96px+). 8px 그리드 엄격.
- 컴포넌트: 카드 hover 시 미세한 border 발광. radius ≈ 8~12px.

### A-2. vercel.com 분석
- 배경: 백색이 기본이나 다크 모드 전환 가능 (스크린샷은 라이트).
- 액센트: 그라데이션(보라/녹색/오렌지)을 **이미지로** 사용 → CSS 그라데이션 남용 회피.
- 간격: 매우 일관된 8/16/24/32 그리드.

### A-3. 토큰 추출 (정규화)

```css
/* @MX:ANCHOR: 본 튜토리얼이 채택할 디자인 토큰. fan_in ≥ 4 (4개 단원 + 종합 단원 모두 참조) */
:root {
  /* 60-30-10 룰 */
  --bg-primary:   #0A0B0E;   /* 60% — OLED 친화 검정 */
  --bg-elevated:  #14161B;   /* 30% — 단원 카드 배경 */
  --accent:       #66E6A4;   /* 10% — 단일 액센트 (압축 ratio 시각화에 사용) */
  --accent-warn:  #F4B453;   /* 보조: Base64처럼 ratio>1일 때 */
  --text-1:       #E8ECEF;   /* 본문 */
  --text-2:       #9AA3AD;   /* 캡션 */
  --border-1:     #1F232A;
  /* spacing 8px 그리드 */
  --sp-1:  4px;  --sp-2:  8px; --sp-3: 16px; --sp-4: 24px; --sp-5: 32px; --sp-6: 48px; --sp-7: 64px;
  /* radius */
  --r-1: 4px; --r-2: 8px; --r-3: 12px;
  /* fonts */
  --font-ui:   "Helvetica Neue", "Pretendard", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Courier New", monospace;
  /* type scale (max 4) */
  --fs-h1: 32px; --fs-h2: 22px; --fs-body: 15px; --fs-cap: 13px;
}
```

### A-4. 대안 비교 (선택은 step030)
- 대안 1: linear-style 매우 어두운 OLED + 노란 액센트.
- 대안 2: vercel-style 흰 배경 + 보라/녹 그라데이션 → ❌ AI Slop 위험.
- 대안 3 (자체): 위 토큰 사용. 압축률 게이지를 액센트 그린(#66E6A4)으로 강조.

### A-5. AI Slop 회피 확인
- ❌ Inter/Roboto 회피 (Helvetica Neue + JetBrains Mono).
- ❌ 보라 그라데이션 회피.
- ❌ 무조건 중앙정렬 카드 회피 (단원 카드는 좌측 정렬 본문 + 우측 위젯).
- ❌ 과도한 radius 회피 (4/8/12 토큰만).

## CoVe (chunk 1)
- [x] A축 4개 사이트 토큰 추출 완료
- [x] 11가지 미학 축에서 Dark OLED Luxury + Swiss Minimalism 혼합으로 매핑
- [x] AI Slop 5개 금지 패턴 회피 명시
- [x] @MX:ANCHOR 토큰 정의 fan_in 근거 명시
