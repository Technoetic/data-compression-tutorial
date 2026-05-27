// @MX:NOTE: LZ77 슬라이딩 윈도우 시각화 — 입력 테이프 + 색상 토글 + 토큰 스트림.
// @MX:NOTE: 메타포 출처 step019_조사결과_chunk1.md (valentinbarral/lz77-demo 차용).

export function renderLz77Tape(vizEl, snap, inspectorEl) {
  if (!snap) { vizEl.innerHTML = '<p class="muted">입력을 채우세요.</p>'; return; }
  const fullInput = (vizEl.dataset.input ?? '');
  const { cursor, windowStart, windowEnd, matchStart, matchLength, nextChar, tokensSoFar } = snap;
  const matchEnd = matchStart >= 0 ? matchStart + matchLength : -1;
  const cells = [...fullInput].map((ch, idx) => {
    const cls = ['cell'];
    if (idx >= windowStart && idx < windowEnd) cls.push('cell--win');
    if (idx >= matchStart && idx < matchEnd && matchStart >= 0) cls.push('cell--match');
    if (idx >= cursor && idx < cursor + matchLength) cls.push('cell--checking');
    if (idx === cursor + matchLength) cls.push('cell--next');
    return `<span class="${cls.join(' ')}" data-idx="${idx}">${escape(ch)}</span>`;
  }).join('');
  const tokenChips = tokensSoFar.map(t => `<span class="tok tok--lz77">(${t.d}, ${t.l}, ${escape(t.c) || '∅'})</span>`).join('');
  vizEl.innerHTML = `
    <div class="lz77-card">
      <ol class="legend">
        <li><span class="dot dot--win"></span>윈도우(히스토리)</li>
        <li><span class="dot dot--match"></span>매치</li>
        <li><span class="dot dot--checking"></span>검사 중</li>
        <li><span class="dot dot--next"></span>다음 문자</li>
      </ol>
      <div class="lz77-tape" role="img" aria-label="LZ77 슬라이딩 윈도우 테이프">${cells || '<span class="muted">…</span>'}</div>
      <div class="lz77-tokens" aria-label="누적 토큰">${tokenChips || '<span class="muted">아직 토큰 없음</span>'}</div>
    </div>`;
  if (inspectorEl) {
    inspectorEl.textContent = matchLength > 0
      ? `Window [${windowStart},${windowEnd}) · Match @${matchStart} len=${matchLength} · next='${nextChar}'`
      : `Window [${windowStart},${windowEnd}) · 매치 없음 · 다음 문자='${nextChar}'`;
  }
}

export function setLz77Input(vizEl, input) { vizEl.dataset.input = input; }

function escape(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
