// @MX:NOTE: 앱 진입점. Chapter 추상 베이스 + 5개 서브클래스로 단원 일관성 유지.
// @MX:ANCHOR: TutorialApp = 단일 인스턴스 라이프사이클 SoT. fan_in = 1 (index.html script 진입).
// @MX:REASON: 생성자는 동기, 비동기는 async init(). 단원 모듈은 dynamic import로 페이지 초기 표시 시간 최소화.

import { encodeEntropy } from './algorithms/entropy.js';
import { encodeRLE } from './algorithms/rle.js';
import { encodeHuffman } from './algorithms/huffman.js';
import { encodeLZ77 } from './algorithms/lz77.js';
import { encodeBase64Step } from './algorithms/base64.js';

import { renderEntropyMeter } from './widgets/entropy-meter.js';
import { renderRleGrid, setRleInput } from './widgets/rle-grid.js';
import { renderHuffmanTree } from './widgets/huffman-tree.js';
import { renderLz77Tape, setLz77Input } from './widgets/lz77-tape.js';
import { renderBase64Bits, setB64Input } from './widgets/base64-bits.js';

/* ────────────────────────────────────────────────────────────
   Chapter 추상 베이스
   ──────────────────────────────────────────────────────────── */
class Chapter {
  static id = '';
  constructor(sectionEl) {
    this.section = sectionEl;
    this.input = sectionEl.querySelector('[data-role=input]');
    this.viz = sectionEl.querySelector('[data-role=viz]');
    this.result = sectionEl.querySelector('[data-role=result]');
    this.controls = sectionEl.querySelector('[data-role=controls]');
    this.inspector = sectionEl.querySelector('[data-role=inspector]');
    this.snapshots = [];
    this.cursor = 0;
    this.lastResult = null;
    this._autoTimer = null;
  }

  async init() {
    if (this.input) {
      this.input.addEventListener('input', () => this._onInput(), { passive: true });
    }
    if (this.controls) {
      this.controls.addEventListener('click', (e) => this._onAction(e));
    }
    await this._recompute();
  }

  async _onInput() {
    this._stopAuto();
    await this._recompute();
  }

  _onAction(ev) {
    const btn = ev.target.closest('button');
    if (!btn) return;
    const act = btn.dataset.action;
    if (act === 'reset') this.reset();
    else if (act === 'step') this.step();
    else if (act === 'auto') this.auto();
  }

  async _recompute() {
    const value = this.input?.value ?? '';
    try {
      const result = this.compute(value);
      this.lastResult = result;
      this.snapshots = result.steps?.length ? result.steps : [];
      this.cursor = Math.max(0, this.snapshots.length - 1);
      this._renderAll();
    } catch (e) {
      console.warn(`[${this.constructor.name}] compute error`, e);
      if (this.inspector) this.inspector.textContent = `오류: ${e.message}`;
    }
  }

  step() {
    if (this.cursor < this.snapshots.length - 1) this.cursor++;
    this._renderAll();
  }

  reset() {
    this._stopAuto();
    this.cursor = 0;
    this._renderAll();
  }

  auto() {
    if (this._autoTimer) return this._stopAuto();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { this.cursor = this.snapshots.length - 1; this._renderAll(); return; }
    this.cursor = 0;
    this._renderAll();
    this._autoTimer = setInterval(() => {
      if (this.cursor >= this.snapshots.length - 1) return this._stopAuto();
      this.cursor++;
      this._renderAll();
    }, 380);
  }

  _stopAuto() { clearInterval(this._autoTimer); this._autoTimer = null; }

  _renderAll() {
    const snap = this.snapshots[this.cursor] ?? null;
    this.renderSnapshot(snap);
    this._renderResult();
    this._renderProgress();
  }

  _renderResult() {
    if (!this.result || !this.lastResult) return;
    const r = this.lastResult;
    const pct = (r.ratio * 100).toFixed(0);
    const verb = r.verdict === 'compressed' ? '압축' : r.verdict === 'inflated' ? '부풀림' : '동일';
    this.result.innerHTML = `
      <dl class="kv">
        <div><dt>원본</dt><dd>${r.inputLength}</dd></div>
        <div><dt>출력</dt><dd>${r.outputLength}</dd></div>
        <div><dt>비율</dt><dd>${pct}%</dd></div>
        <div><dt>판정</dt><dd class="verdict verdict--${r.verdict}">${verb}</dd></div>
      </dl>
      <div class="ratio-bar" role="meter" aria-label="압축률" aria-valuemin="0" aria-valuemax="150" aria-valuenow="${Number(pct)}" aria-valuetext="${pct}퍼센트, ${verb}">
        <span class="ratio-bar__fill ratio-bar__fill--${r.verdict}" style="--w: ${Math.min(150, Number(pct))}%"></span>
        <span class="ratio-bar__mark" aria-hidden="true">100%</span>
      </div>`;
  }

  _renderProgress() {
    if (!this.controls) return;
    const meter = this.controls.querySelector('.step-meter');
    if (meter) {
      meter.textContent = `${this.cursor + (this.snapshots.length ? 1 : 0)} / ${this.snapshots.length}`;
    }
  }

  /* abstract */ compute(_input) { throw new Error('abstract'); }
  /* abstract */ renderSnapshot(_snap) { throw new Error('abstract'); }
}

/* ────────────────────────────────────────────────────────────
   구체 단원
   ──────────────────────────────────────────────────────────── */
class IntroChapter extends Chapter {
  static id = 'intro';
  compute(input) { return encodeEntropy(input); }
  renderSnapshot(s) { renderEntropyMeter(this.viz, s, this.inspector); }
}
class RleChapter extends Chapter {
  static id = 'rle';
  compute(input) { setRleInput(this.viz, input); return encodeRLE(input); }
  renderSnapshot(s) { renderRleGrid(this.viz, s, this.inspector); }
}
class HuffmanChapter extends Chapter {
  static id = 'huffman';
  compute(input) { return encodeHuffman(input); }
  renderSnapshot(s) { renderHuffmanTree(this.viz, s, this.inspector, this.lastResult); }
}
class Lz77Chapter extends Chapter {
  static id = 'lz77';
  compute(input) { setLz77Input(this.viz, input); return encodeLZ77(input, 32); }
  renderSnapshot(s) { renderLz77Tape(this.viz, s, this.inspector); }
}
class Base64Chapter extends Chapter {
  static id = 'base64';
  compute(input) { setB64Input(this.viz, input); return encodeBase64Step(input); }
  renderSnapshot(s) { renderBase64Bits(this.viz, s, this.inspector); }
}

/* ────────────────────────────────────────────────────────────
   ProgressManager
   ──────────────────────────────────────────────────────────── */
class ProgressManager {
  constructor(rootEl) {
    this.rail = rootEl.querySelector('.progress-rail');
    this.io = null;
    this.order = [];
  }
  observeAll(chapters) {
    this.order = chapters.map(c => c.section);
    this.io = new IntersectionObserver((entries) => this._onIntersect(entries), { rootMargin: '-40% 0px -50% 0px' });
    this.order.forEach(el => this.io.observe(el));
  }
  _onIntersect(entries) {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const idx = this.order.indexOf(e.target);
      if (idx < 0) continue;
      const pct = ((idx + 1) / this.order.length) * 100;
      this.rail?.style.setProperty('--progress', `${pct}%`);
      this.rail?.setAttribute('aria-valuenow', String(idx + 1));
    }
  }
}

/* ────────────────────────────────────────────────────────────
   TutorialApp
   ──────────────────────────────────────────────────────────── */
class TutorialApp {
  constructor({ rootEl }) { this.root = rootEl; this.chapters = []; }
  async init() {
    document.documentElement.dataset.theme = 'dark';
    const Classes = [IntroChapter, RleChapter, HuffmanChapter, Lz77Chapter, Base64Chapter];
    for (const Cls of Classes) {
      const sec = this.root.querySelector(`#${Cls.id}`);
      if (!sec) continue;
      const ch = new Cls(sec);
      await ch.init();
      this.chapters.push(ch);
    }
    this.progress = new ProgressManager(this.root);
    this.progress.observeAll(this.chapters);
  }
}

/* 부팅 */
window.addEventListener('DOMContentLoaded', async () => {
  const app = new TutorialApp({ rootEl: document.body });
  await app.init();
  window.__tutorial = app;
});
