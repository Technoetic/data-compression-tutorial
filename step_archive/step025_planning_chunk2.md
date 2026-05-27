---
step: 025
chunk: 2
type: planning
author: agent-A
generated: 2026-05-26
---

# Step 025 — 튜토리얼 기획 (chunk 2: 모듈 구조·상태·접근성)

## 7. 모듈 구조 (단일 HTML 우선 + src/ 분리 옵션)

### 7.1 최우선 안: 단일 HTML

- `index.html` (200~400줄, head + body + 인라인 link)
- `src/styles.css` (토큰 + 단원 카드 + 컨트롤 200~400줄)
- `src/main.js` (entry, DOM 바인딩 100~200줄)
- `src/algorithms/rle.js` (40~80줄)
- `src/algorithms/huffman.js` (120~200줄)
- `src/algorithms/lz77.js` (100~150줄)
- `src/algorithms/base64.js` (60~100줄)
- `src/algorithms/entropy.js` (30~60줄)
- `src/widgets/controls.js` (Reset/Step/Auto 공통 컴포넌트 80~120줄)
- `src/widgets/rle-grid.js`, `huffman-tree.js`, `lz77-tape.js`, `base64-bits.js`

총 LOC 예상: ~1800~2400줄 (단원당 400~500줄).

### 7.2 빌드

- Vite dev server (`npm run dev`).
- `npm run build` → `dist/` 정적 호스팅 가능.
- 단일 HTML로 압축 빌드(Vite의 `build.rollupOptions.output.inlineDynamicImports`) — 보너스.

## 8. 상태 관리 (단순화)

- 전역 단일 store 없이, 단원별 closure로 관리.
- 4개 단원 인스턴스 객체:
  ```js
  // @MX:ANCHOR: 단원 객체 공통 인터페이스. fan_in = 4 (RLE/Huffman/LZ77/Base64).
  // @MX:REASON: 단원 카드의 컨트롤 바가 동일 메서드(.step(), .auto(), .reset())를 호출
  Chapter = {
    input: string,          // 사용자 입력
    snapshots: Step[],      // 단계별 스냅샷
    cursor: number,         // 현재 단계 위치
    step(),                 // cursor++ → 시각화 갱신
    auto(),                 // setInterval로 step 반복
    reset(),                // cursor=0, snapshots 재생성
    render(container),      // DOM 업데이트
  }
  ```

## 9. 상호작용 명세 (Step/Auto/Reset)

| 동작 | 기대 결과 |
|:---|:---|
| 입력 변경 | snapshots 재생성, cursor=마지막 (전체 결과 즉시 표시) |
| Reset 클릭 | cursor=0 (시작 상태로) |
| Step 클릭 | cursor++ (다음 단계) |
| Auto 클릭 | 200~400ms 간격으로 step 자동 호출, 끝까지 도달하면 정지 |
| Auto 중 Reset | 즉시 정지 + cursor=0 |

## 10. 접근성 (a11y — TOPIC.md 명시 외 본 vault AI Slop 방지 정책)

- 모든 버튼 최소 44×44pt 터치 타겟.
- 모든 입력에 `<label>` 명시.
- 트리/테이프 시각화에 `aria-label` + `role="img"` 적절히 부착.
- `prefers-reduced-motion: reduce` 대응: Auto 재생 즉시 마지막 상태로 점프.
- 콘트라스트 비율 4.5:1 이상 (다크 OLED 토큰 검증 필요 — step040+에서 axe-core 자동 검증).
- 키보드 내비: Tab 순서 (입력 → Reset → Step → Auto), Space/Enter로 활성.

## 11. 반응형 (TOPIC.md "단일 페이지 웹" + 모바일 친화)

- 데스크톱(>=1024px): 좌 30% 텍스트 + 우 70% 위젯 2분할.
- 태블릿(>=768px): 좌 40% + 우 60%.
- 모바일(<768px): 세로 스택. 텍스트 → 입력 → 시각화 → 결과 → 컨트롤.

## 12. 한국어 + 영문 알고리즘명 병기 정책

- 헤드라인: "RLE — 런-길이 부호화"
- 본문: "**런-길이 부호화(Run-Length Encoding, RLE)**는 ..."
- 코드/토큰: 영문 그대로 (LZ77, Huffman, Base64, sliding window 등).
- 한국어 우선이되, 알고리즘 표준 용어는 영문 병기.

## 13. 데이터 흐름 (input → ChapterResult)

```
사용자 입력 (textarea / file)
  ↓
algorithms/{rle|huffman|lz77|base64|entropy}.js
  ↓
ChapterResult { inputLength, outputLength, ratio, steps[], verdict }
  ↓
widgets/{rle-grid|huffman-tree|lz77-tape|base64-bits}.js
  ↓
DOM 업데이트
```

## 14. 결정 사유 (NEW-WORK-규칙 3번 — 모호 항목 1~2줄 기록)

- **단일 HTML 우선이되 src/ 모듈 분리 채택**: 가독성·테스트 가능성·LOC 1500+ 예상. Vite로 단일 HTML 빌드 가능.
- **상태 관리 라이브러리 미사용**: 단원당 closure 객체로 충분, 외부 의존성 0 정책.
- **Canvas는 Huffman 트리 + LZ77 테이프만**: 나머지 단원은 DOM div로 충분 (학습 가시성과 접근성 모두 유리).
- **JWT를 대중 앱 사례에 추가**: 본 시대 가장 흔한 Base64 사용처. TOPIC.md 본 의도 보강.

## CoVe (chunk 2)
- [x] 모듈 구조 LOC 추정 명시
- [x] 단원 객체 공통 인터페이스 정의 (@MX:ANCHOR)
- [x] 접근성 6항목 명시
- [x] 반응형 3구간 + 한영 병기 정책
- [x] 결정 사유 4건 기록
