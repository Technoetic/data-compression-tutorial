---
step: 030
chunk: 1
type: layout-design
selected: 대안 C
generated: 2026-05-26
---

# Step 030 — 레이아웃 설계 (대안 C 최종)

## 1. 페이지 골격 (semantic HTML)

```html
<body>
  <header class="app-header" role="banner">
    <h1 class="logo">데이터 압축과 부호화</h1>
    <nav class="anchor-nav" aria-label="단원 네비게이션">
      <a href="#intro">§0</a>
      <a href="#rle">§1 RLE</a>
      <a href="#huffman">§2 Huffman</a>
      <a href="#lz77">§3 LZ77</a>
      <a href="#base64">§4 Base64</a>
      <a href="#sum">§5 종합</a>
    </nav>
    <div class="progress-rail" role="progressbar" aria-valuemin="0" aria-valuemax="5"></div>
  </header>

  <main role="main">
    <section id="intro"   class="chapter chapter--intro">…</section>
    <section id="rle"     class="chapter chapter--rle">…</section>
    <section id="huffman" class="chapter chapter--huffman">…</section>
    <section id="lz77"    class="chapter chapter--lz77">…</section>
    <section id="base64"  class="chapter chapter--base64">…</section>
    <section id="sum"     class="chapter chapter--sum">…</section>
  </main>

  <footer class="app-footer">
    <small>출처: Wikipedia, lz77-demo, huffman-visualization, linear.app, distill.pub.</small>
  </footer>
</body>
```

## 2. 단원 카드 골격 (4단원 공통)

```html
<section id="rle" class="chapter chapter--rle" aria-labelledby="rle-title">
  <header class="chapter__head">
    <h2 id="rle-title">§1 런-길이 부호화 (Run-Length Encoding)</h2>
    <p class="chapter__lead">반복 데이터를 "값 + 연속 횟수"로 줄이는 가장 단순한 무손실 압축.</p>
    <ul class="chip-list" aria-label="대중 앱 사례">
      <li class="chip">팩스(T.45)</li>
      <li class="chip">BMP/RLE</li>
      <li class="chip">JPEG 후처리</li>
    </ul>
  </header>

  <div class="chapter__body grid-2">
    <div class="chapter__input">
      <label for="rle-input">입력 텍스트</label>
      <textarea id="rle-input">AAAABBBCCDAA</textarea>
    </div>
    <div class="chapter__viz">
      <!-- DOM 픽셀 격자 -->
    </div>
    <div class="chapter__result">
      <dl>
        <dt>원본</dt><dd>12 chars</dd>
        <dt>인코딩</dt><dd>10 chars</dd>
        <dt>압축률</dt><dd>83%</dd>
      </dl>
      <div class="ratio-bar"><span style="width: 83%"></span></div>
    </div>
    <div class="chapter__controls">
      <button class="btn btn--ghost" data-action="reset">↺ Reset</button>
      <button class="btn btn--primary" data-action="step">Step ▶</button>
      <button class="btn btn--ghost" data-action="auto">Auto ▶▶</button>
    </div>
    <output class="chapter__inspector" aria-live="polite">
      Run-char: A · Run-length: 4
    </output>
  </div>
</section>
```

## 3. CSS 그리드 (chapter__body)

```css
/* @MX:NOTE: 8px 그리드 + 패딩 ≤ 마진 정책. 4분할 카드 그리드의 SoT. */
.chapter__body.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "input  viz"
    "ctrl   viz"
    "insp   result";
  gap: var(--sp-4); /* 24px */
}
.chapter__input    { grid-area: input; }
.chapter__viz      { grid-area: viz; min-height: 320px; }
.chapter__result   { grid-area: result; }
.chapter__controls { grid-area: ctrl; }
.chapter__inspector{ grid-area: insp; }

@media (max-width: 767px) {
  .chapter__body.grid-2 {
    grid-template-columns: 1fr;
    grid-template-areas:
      "input"
      "ctrl"
      "viz"
      "insp"
      "result";
  }
}
```

## 4. 반응형 브레이크포인트

- ≥1024px: 2col (좌 입력+컨트롤, 우 시각화). 컨테이너 max-width 1120px.
- 768~1023px: 동일 2col이나 시각화 폭 좁아짐. 폰트 1단계 축소.
- <768px: 1col 세로 스택. 시각화 min-height 240px로 축소.

## 5. sticky 진행률 바

```css
.app-header {
  position: sticky; top: 0;
  background: var(--bg-primary);
  z-index: 50;
  padding: var(--sp-2) var(--sp-4);
  border-bottom: 1px solid var(--border-1);
}
.progress-rail {
  position: absolute; left: 0; bottom: 0; right: 0;
  height: 2px;
  background: var(--border-1);
}
.progress-rail::before {
  content: "";
  display: block; height: 100%;
  width: var(--progress, 0%);
  background: var(--accent);
  transition: width 200ms ease-out;
}
```

`var(--progress)`는 메인 JS의 IntersectionObserver가 단원 진입에 따라 갱신.

## 6. AI Slop 방지 — 토큰 외 값 사용 금지

- 모든 색상: `var(--bg-*|--text-*|--accent*|--border-*)` 만 사용. 임의 헥스 금지.
- 모든 간격: `var(--sp-1..--sp-7)` 만 사용. 임의 px 금지.
- 모든 radius: `var(--r-1|--r-2|--r-3)` 만 사용.
- 모든 그림자: (없음, 다크 OLED는 그림자 미사용. 카드 경계는 border-1로).

## 7. 키보드/접근성

- 앵커 네비: Tab로 순회 가능, focus 시 `outline: 2px solid var(--accent); outline-offset: 2px`.
- 모든 button 44×44 최소. focus 가시.
- chapter__inspector는 `aria-live="polite"`로 변경 알림.
- viz 캔버스는 `role="img"` + `aria-label`. canvas 정보는 시각화 후 텍스트 결과로도 제공.
