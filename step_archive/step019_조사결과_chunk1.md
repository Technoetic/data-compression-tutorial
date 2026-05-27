---
step: 019
chunk: 1
type: clone-analysis
collected_at: 2026-05-26
---

# Step 019 — 참고 레포 코드 분석

## Step-Back 답변

- **핵심 목적**: 참고 레포의 실제 구현 패턴(컴포넌트 구조, 상태관리, 시각화 메타포)을 코드 단위로 확인해 우리 단일 HTML 구현에 차용·반면교사로 삼는다.
- **영향 Step**: step030(통합 설계 — 단원 카드 레이아웃), step037(구현 — 캔버스/DOM 선택).
- **핵심 확인 3가지**: ① 단원별 UI 분할 패턴, ② 시각화 방식(canvas vs DOM), ③ 상태관리(전역 vs 단원별).

## 클론 현황

| 레포 | 경로 | 상태 |
|:---|:---|:---|
| 190n/huffman-visualization | step_archive/references/huffman-visualization/ | ✅ |
| valentinbarral/lz77-demo | step_archive/references/lz77-demo/ | ✅ |
| surfsurfmasurf/ziplike | step_archive/references/ziplike/ | ✅ |
| SamirPaulb/txt-compressor | step_archive/references/SamirPaulb_txt-compressor/ | ✅ (참고용, 이미 클론됨) |
| xUser5000/huffman-coding | step_archive/references/xUser5000_huffman-coding/ | ✅ |

## 레포별 분석

### 1. 190n/huffman-visualization (★27)

- **디렉토리 구조**: `index.html` + `src/` (TypeScript) + Vite 빌드.
  - `src/main.ts` (124줄), `huffman.ts` (223줄), `histogram.ts` (52줄), `node.ts` (17줄).
- **기술 스택**: TypeScript + Vite + Canvas API + SCSS.
- **핵심 패턴**:
  - `buildTree(hist)` → `snapshots: Node[][]` 형태로 **단계별 스냅샷 배열** 반환 (스크러버로 트리 구축 과정 재생).
  - `redrawTrees(highlightSymbol?)` — 캔버스를 `devicePixelRatio` 고려하여 다시 그림.
  - 히스토그램(`<table>` DOM) + 트리(canvas) 분할 레이아웃.
  - 입력(`textarea`) 이벤트로 즉시 재계산.
- **우리 프로젝트에 적용할 점**:
  - ✅ "단계 스냅샷 배열 + 스크러버" 패턴은 Huffman 단원에 차용.
  - ✅ Canvas + `devicePixelRatio` 처리 패턴.
  - ⚠️ TypeScript/Vite는 도입하지 않음. 단일 HTML + vanilla JS로 동일 효과 구현.
  - ⚠️ SCSS는 사용하지 않음. CSS 변수 + 토큰 디자인으로 대체.

### 2. valentinbarral/lz77-demo (★0, 그러나 컨셉 강력)

- **디렉토리 구조**: 단일 HTML + `script.js`(480줄) + `styles.css` + `translations.js` + `DESIGN.md`.
- **기술 스택**: Vanilla JS, **단일 페이지**, i18n(es/en/gl).
- **핵심 패턴**:
  - "Encoder / Decoder" 두 패널.
  - **인스펙터(Inspector)**: "Acción / Buffer / Window" 상태를 실시간 텍스트로 표시.
  - **테이프(Tape)**: 문자열을 `<div>` 박스 시퀀스로 표시, CSS class로 (window/checking/found/fail) 색상 토글.
  - 색상 범례(Legend) 4종: window(파랑) / checking(테두리) / found(녹색) / fail(빨강).
  - 자동재생(Auto) / 단계실행(Step) / 리셋 버튼 3종.
- **우리 프로젝트에 적용할 점**:
  - ✅ **단일 HTML + vanilla JS** 구조 → 우리 정책과 동일. **가장 강한 참고 레포**.
  - ✅ "테이프 + 색상 범례" 메타포 → LZ77 단원에 직접 차용.
  - ✅ Step/Auto/Reset 3버튼 → 4개 단원 모두에 표준 컨트롤로 적용.
  - ⚠️ i18n 미적용 (우리 튜토리얼은 한국어 단일).
  - ⚠️ 햄버거 메뉴는 제거 (단일 페이지 스크롤 우선).

### 3. surfsurfmasurf/ziplike (★0)

- **디렉토리 구조**: `static/index.html` (1324줄 monolithic) + Flask `app.py` + Vercel 배포 설정.
- **기술 스택**: Python Flask 백엔드 + 단일 HTML 프론트엔드.
- **핵심 패턴**:
  - 1324줄짜리 monolithic HTML — 인라인 CSS + 인라인 JS.
  - 4개 알고리즘(LZ77, Huffman, Entropy 등) 통합 뷰.
- **우리 프로젝트에 적용할 점**:
  - ⚠️ Flask 백엔드 불필요 (우리는 클라이언트 전용).
  - ⚠️ 1300줄 monolithic은 가독성 낮음 → 우리는 단일 HTML이라도 단원별 모듈을 명확히 분리.
  - ✅ "통합 뷰" 컨셉은 종합 비교 단원에 차용.

## 종합: 우리 구현 결정

| 결정 | 이유 |
|:---|:---|
| **단일 HTML + vanilla JS** | lz77-demo가 입증한 패턴, 외부 의존성 0 정책 일치 |
| **단원별 카드 4개 + 종합 1개** | 4개 알고리즘 + 종합 비교 단원 |
| **Step/Auto/Reset 표준 컨트롤** | lz77-demo 차용, 4단원 일관성 |
| **Canvas는 Huffman 트리 + LZ77 슬라이딩만** | 그 외 단원은 DOM div로 충분 |
| **단계 스냅샷 배열** | huffman-visualization 차용. 스크러버 재생 |
| **인스펙터 패널** | lz77-demo 차용. 현재 상태 텍스트로 표시 |

## CoVe 체크

- [x] 단원별 UI 분할 패턴 확인 (lz77-demo의 Encoder/Decoder/Inspector/Tape)
- [x] 시각화 방식(canvas vs DOM) 결정 (Canvas는 트리/슬라이딩만, 나머지 DOM)
- [x] 상태관리(전역 단순 객체 사용 결정)
- [x] @MX:NOTE 부착할 결정 사유 명시
