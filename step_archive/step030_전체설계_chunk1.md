---
step: 030
chunk: 1
type: full-architecture
generated: 2026-05-26
---

# Step 030 — 전체 설계 (Class·async·라이프사이클)

## 1. 클래스 다이어그램 (ASCII)

```
                       ┌────────────────┐
                       │  TutorialApp   │ (entry)
                       │  + async init()│
                       │  + start()     │
                       └───────┬────────┘
                               │ owns N
       ┌───────────────────────┼─────────────────────────┐
       │                       │                         │
┌──────▼──────┐         ┌──────▼─────┐            ┌──────▼─────┐
│ProgressMgr  │         │ChapterReg  │            │ThemeMgr    │
│(IObserver)  │         │(map<id,Ch>)│            │(reduced-motion?)
└─────────────┘         └──────┬─────┘            └────────────┘
                               │ instantiates
        ┌──────────┬──────────┬┴──────────┬──────────┐
        ▼          ▼          ▼           ▼          ▼
   ┌─────────┐┌──────────┐┌───────┐┌──────────┐┌────────┐
   │EntropyCh││ RleCh    ││HuffCh ││ Lz77Ch   ││Base64Ch│
   │intro    ││ §1       ││ §2    ││ §3       ││ §4     │
   └────┬────┘└─────┬────┘└───┬───┘└─────┬────┘└────┬───┘
        │ extends Chapter (base class)              │
        ▼                                           ▼
   ┌─────────────────────────────────────────────────┐
   │  Chapter (abstract base)                        │
   │   - inputEl, vizEl, resultEl, ctrlEl, inspEl    │
   │   - snapshots: Step[], cursor: number           │
   │   - async init(), async run(), step(), reset()  │
   │   - abstract async compute(): ChapterResult     │
   │   - abstract async renderSnapshot(s)            │
   └─────────────────────────────────────────────────┘
```

## 2. 클래스 명세 (public API)

### 2.1 TutorialApp

```js
// @MX:ANCHOR: 앱 진입점. fan_in = 1 (main.js에서만 new). 그러나 모든 단원 인스턴스의 부모.
// @MX:REASON: 단일 인스턴스 보장 + 라이프사이클 통일 (생성자 동기, 비동기는 init())
class TutorialApp {
  constructor({ rootEl }) { this.root = rootEl; this.chapters = new Map(); }
  async init() {                       // 비동기 초기화
    this.theme = new ThemeManager();
    this.progress = new ProgressManager(this.root);
    // 단원 5개 인스턴스
    for (const Cls of [EntropyChapter, RleChapter, HuffmanChapter, Lz77Chapter, Base64Chapter]) {
      const ch = new Cls(this.root.querySelector(`#${Cls.id}`));
      await ch.init();
      this.chapters.set(Cls.id, ch);
    }
    await this.progress.observeAll([...this.chapters.values()]);
  }
  start() { /* no-op, init() 후 즉시 사용 가능 */ }
}
```

### 2.2 Chapter (abstract base class)

```js
class Chapter {
  static id = '';   // subclass override
  constructor(sectionEl) {
    this.section = sectionEl;
    this.input = sectionEl.querySelector('[data-role=input]');
    this.viz = sectionEl.querySelector('[data-role=viz]');
    this.result = sectionEl.querySelector('[data-role=result]');
    this.controls = sectionEl.querySelector('[data-role=controls]');
    this.inspector = sectionEl.querySelector('[data-role=inspector]');
    this.snapshots = [];
    this.cursor = 0;
    this._autoTimer = null;
  }
  async init() {
    this.input?.addEventListener('input', this._onInput.bind(this));
    this.controls?.addEventListener('click', this._onAction.bind(this));
    await this._recompute();
  }
  async _onInput() { await this._recompute(); }
  _onAction(ev) {
    const act = ev.target?.dataset?.action;
    if (act === 'reset') this.reset();
    else if (act === 'step') this.step();
    else if (act === 'auto') this.auto();
  }
  async _recompute() {
    const result = await this.compute(this.input?.value ?? '');
    this.snapshots = result.steps;
    this.cursor = this.snapshots.length - 1;
    await this._render();
  }
  step() {
    if (this.cursor < this.snapshots.length - 1) this.cursor++;
    this._render();
  }
  reset() {
    this._stopAuto();
    this.cursor = 0;
    this._render();
  }
  auto() {
    if (this._autoTimer) return this._stopAuto();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { this.cursor = this.snapshots.length - 1; return this._render(); }
    this._autoTimer = setInterval(() => {
      if (this.cursor >= this.snapshots.length - 1) return this._stopAuto();
      this.cursor++; this._render();
    }, 350);
  }
  _stopAuto() { clearInterval(this._autoTimer); this._autoTimer = null; }
  async _render() {
    await this.renderSnapshot(this.snapshots[this.cursor]);
    this._renderResult();
  }
  _renderResult() { /* ChapterResult를 .chapter__result에 출력 */ }
  /* abstract */ async compute(input) { throw new Error('abstract'); }
  /* abstract */ async renderSnapshot(s) { throw new Error('abstract'); }
}
```

### 2.3 단원별 구체 클래스

```js
class RleChapter extends Chapter {
  static id = 'rle';
  async compute(input) {
    const { encodeRLE } = await import('./algorithms/rle.js');
    return encodeRLE(input);   // ChapterResult 형식
  }
  async renderSnapshot(s) {
    const { renderRleGrid } = await import('./widgets/rle-grid.js');
    renderRleGrid(this.viz, s, this.inspector);
  }
}
class HuffmanChapter extends Chapter {
  static id = 'huffman';
  // ...
}
class Lz77Chapter extends Chapter { static id = 'lz77'; /*…*/ }
class Base64Chapter extends Chapter { static id = 'base64'; /*…*/ }
class EntropyChapter extends Chapter { static id = 'intro'; /* compute는 엔트로피, snapshots는 단일 */ }
```

### 2.4 ProgressManager

```js
// @MX:ANCHOR: 단원 진입 감지 → 진행률 바 업데이트. IntersectionObserver 단일 인스턴스.
// @MX:REASON: 5단원 각각의 진입 이벤트를 한 observer로 통합해야 성능 안정 (스크롤 60fps)
class ProgressManager {
  constructor(rootEl) {
    this.rail = rootEl.querySelector('.progress-rail');
    this.io = null;
    this.order = [];
  }
  async observeAll(chapters) {
    this.order = chapters.map(c => c.section);
    this.io = new IntersectionObserver(this._onIntersect.bind(this), { rootMargin: '-50% 0px' });
    this.order.forEach(el => this.io.observe(el));
  }
  _onIntersect(entries) {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const idx = this.order.indexOf(e.target);
      const pct = ((idx + 1) / this.order.length) * 100;
      this.rail.style.setProperty('--progress', `${pct}%`);
      this.rail.setAttribute('aria-valuenow', String(idx + 1));
    }
  }
}
```

### 2.5 ThemeManager

```js
class ThemeManager {
  constructor() {
    // 본 튜토리얼은 다크 OLED 고정. prefers-color-scheme=light 무시.
    document.documentElement.dataset.theme = 'dark';
  }
}
```

## 3. 비동기 흐름 시퀀스 (단원 입력 변경)

```
User types in <textarea id="rle-input">
        │
        ▼
RleChapter._onInput (debounce 80ms는 보류, 첫 구현에서는 매 input)
        │
        ▼
_recompute  ──── await compute(value)
                 ├─ dynamic import('./algorithms/rle.js') (1회만 캐시)
                 └─ encodeRLE(input) → ChapterResult
        │
        ▼
snapshots = result.steps; cursor = last
        │
        ▼
_render ─── await renderSnapshot(s) (widgets 모듈 dynamic import)
       └── _renderResult()
        │
        ▼
DOM 업데이트 (CSS transition 200ms 동안 부드럽게)
```

## 4. 라이프사이클

```
1. <body> 파싱 완료 → DOMContentLoaded
2. main.js: app = new TutorialApp({ rootEl: document.body });
3. await app.init();
   - 각 Chapter 인스턴스 생성, await ch.init() 직렬 실행 (LOC 비용 적어 직렬 충분)
   - ProgressManager 단일 observer
4. app.start();  // 본 설계에서는 no-op, 향후 확장 여지
```

## 5. 에러 처리

- `compute()`/`renderSnapshot()` 내부 try/catch.
- 실패 시 inspector에 1줄 표시 + 콘솔 warn.
- 사용자 인터랙션 중단 금지(빈 입력은 빈 결과로 반환).

## 6. 외부 의존성 0 검증

| 의존 후보 | 채택 | 사유 |
|:---|:---|:---|
| React | ❌ | 외부 의존성 0 정책 |
| D3 | ❌ | 토큰 시각화는 vanilla 가능 |
| Vue/Svelte | ❌ | 동일 |
| Tailwind 런타임 | ❌ | CSS 토큰만 사용 |
| 빌드: Vite | ✅ (dev 도구) | 런타임 의존 0, 정적 빌드만 |

## 7. SPEC 자동 생성 hook 연계

- Stop hook의 `spec-generator.ps1`이 `step_archive/specs/SPEC-030.md` 생성.
- WHAT: 대안 C 레이아웃 + Chapter abstract base 클래스 구조.
- WHY: 4단원 일관성 + 학습 진행률 시각화.
- WHEN: step037 구현 단계.
- ACCEPTANCE: 4개 Chapter 서브클래스 모두 compute/renderSnapshot 구현 + ProgressManager 작동.
