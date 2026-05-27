---
step: 023
chunk: 2
type: awwwards-pattern-analysis
collected_at: 2026-05-26
---

# Step 023 — Awwwards 디자인 패턴 분석 (chunk 2: B·C·D 축)

## B축. 학습형 시각화 메타포

### B-1. ciechanow.ski 분석
- 본문(serif/sans) + 인라인 인터랙티브 박스가 글의 흐름을 끊지 않게 자연 임베드.
- 드래그/슬라이더 → 즉시 결과 갱신 (transition 200~300ms).
- 시각화 자체는 매우 절제: 단색 + 라벨 + 최소 데코.
- 어두운 모드 기본.

### B-2. distill.pub 분석
- 학술 톤. 흰 배경 + 진한 텍스트.
- 다이어그램·노트북형 위젯이 인라인 배치.
- 어두운 헤더(#0F4D78 추정) + 흰 본문 → 우리 다크 OLED와 직접 일치하지 않으나 **위젯 인라인 배치 메타포**는 차용 가치.

### B-3. 적용 메타포 (본 튜토리얼)
- 각 단원은 다음 4분할:
  1. **개념 텍스트 블록** (좌 또는 상단 — 본문 흐름)
  2. **입력 영역** (사용자 텍스트/픽셀)
  3. **시각화 캔버스** (트리/슬라이딩 윈도우/비트열 매핑)
  4. **결과 패널** (압축률, 토큰 리스트, 부호 사전)
- 시각화는 ciechanow.ski 처럼 **절제된 색상 + 라벨 위주**.

### B-4. 대안 비교
- 대안 1: 좌(텍스트) + 우(위젯) 2열 — distill 스타일.
- 대안 2: 상(텍스트) + 하(위젯) — ciechanow 스타일, 좁은 화면 friendly.
- 대안 3 (자체 추천): **상(텍스트 1줄 + 입력)** + **하(시각화 + 결과 2열)** → 모바일에서 자연 reflow.

## C축. 알고리즘 컨트롤 UI

### C-1. visualgo.net 분석 (스크린샷 기반)
- 단원이 거대한 그리드 (5x5+) — 알고리즘 카탈로그.
- 각 카드: 단색 배경 + 흰 라인 다이어그램 + 카드 상단에 "RECENT" 등 칩.
- 색상 다양 (8가지+) → 우리는 **단일 액센트 정책**과 충돌. 색상 다양성은 차용 안 함.
- **Step/Auto/Reset 컨트롤 패턴**: visualgo 내부 페이지에서 표준 (지금 home 스크린샷에는 없음).

### C-2. lz77-demo의 컨트롤 (이미 step019에서 분석)
- Step / Auto / Reset 3버튼.
- 인스펙터 패널: "Acción / Buffer / Window".

### C-3. 적용 (본 튜토리얼)
- 4개 단원 모두에 **표준 컨트롤 바**: `[← Reset] [Step ▶] [Auto ▶▶]`.
- 인스펙터 패널: 단원별 다음 항목 표시
  - RLE: 현재 run-char, run-length.
  - Huffman: 현재 합치는 두 노드.
  - LZ77: 현재 window/search/match 좌표.
  - Base64: 현재 6비트 그룹 + 매핑 알파벳.

## D축. 단원 카드형 스크롤

### D-1. linear.app 분석
- 큰 섹션이 수직으로 스택. 각 섹션은 **거대한 헤드라인 + 우측 데모 이미지**.
- 섹션 간 강한 padding(96px).

### D-2. vercel.com 분석
- 섹션 헤드라인 좌측 정렬 + 본문 다단(2-3 col).
- 카드 그리드는 4개 정렬.

### D-3. 적용 (본 튜토리얼)
- 페이지 구조:
  ```
  [헤더: 제목 + 단원 네비게이션 (앵커 5개)]
  [인트로 섹션: 정보 엔트로피 미니 데모]
  [단원 1: RLE 카드]
  [단원 2: 허프만 카드]
  [단원 3: LZ77 카드]
  [단원 4: Base64 카드]
  [종합 단원: PNG/ZIP 파이프라인]
  [푸터: 출처 + GitHub]
  ```
- 각 단원 = 화면 최소 1개 분량(min-height: 100vh 미만, 자연 reflow).
- 스크롤 진입 시 단원 헤드라인 fade-in (`@MX:WARN: prefers-reduced-motion 존중`).

## 11가지 미학 축 매핑

| 사이트 | 매핑 | 적용 |
|:---|:---|:---|
| linear.app | Dark OLED Luxury | 색상/간격 토큰 |
| vercel.com | Swiss Minimalism | 그리드/타이포 |
| ciechanow.ski | Dark + Educational | 위젯 메타포 |
| distill.pub | Academic Minimal | 인라인 위젯 |
| visualgo.net | Tile-grid Pedagogical | 단원 카탈로그 컨셉만 |

## CoVe (chunk 2)
- [x] B/C/D 3축 모두 적용 메타포 결정
- [x] 대안 비교 제공 (선택은 step030)
- [x] 11가지 미학 축 매핑 완료
- [x] AI Slop 회피 (visualgo의 8색 다양성을 채택하지 않음)
