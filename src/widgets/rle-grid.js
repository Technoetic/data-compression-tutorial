// @MX:NOTE: RLE 시각화 — 문자 격자에서 현재 run을 강조하고, 토큰 스트림을 우측에 표시.

export function renderRleGrid(vizEl, snap, inspectorEl) {
  if (!snap) { vizEl.innerHTML = '<p class="muted">입력을 채우세요.</p>'; return; }
  const { cursor, runChar, runLength, tokensSoFar } = snap;
  // 입력 격자 재구성
  const fullInput = (vizEl.dataset.input ?? '');
  const cells = [...fullInput].map((ch, idx) => {
    const isInRun = idx >= cursor && idx < cursor + runLength;
    const cls = ['cell', isInRun ? 'cell--active' : ''].filter(Boolean).join(' ');
    return `<span class="${cls}" data-idx="${idx}">${escape(ch)}</span>`;
  }).join('');
  const tokenChips = tokensSoFar.map(t => `<span class="tok">${t.count}${escape(t.char)}</span>`).join('');
  vizEl.innerHTML = `
    <div class="rle-card">
      <div class="rle-grid" role="img" aria-label="RLE 입력 격자">${cells || '<span class="muted">…</span>'}</div>
      <div class="rle-tokens" aria-label="누적 토큰">${tokenChips || '<span class="muted">아직 토큰 없음</span>'}</div>
    </div>`;
  if (inspectorEl) {
    inspectorEl.textContent = runChar
      ? `Run-char: ${runChar} · Run-length: ${runLength} (cursor=${cursor})`
      : '대기 중';
  }
}

/** main.js가 입력 텍스트를 viz에 sticky로 전달하기 위한 헬퍼 */
export function setRleInput(vizEl, input) { vizEl.dataset.input = input; }

function escape(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
