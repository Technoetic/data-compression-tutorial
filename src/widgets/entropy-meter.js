// @MX:NOTE: 정보 엔트로피 미터 — 빈도 상위 8개 막대 + H(X) 수치 + 압축 가능성 게이지.

export function renderEntropyMeter(vizEl, snap, inspectorEl) {
  if (!snap) return;
  const { H, maxH, headroom, freq, length } = snap;
  const topN = freq.slice(0, 8);
  const maxC = topN[0]?.[1] ?? 1;
  vizEl.innerHTML = `
    <div class="entropy-card">
      <dl class="kv">
        <div><dt>길이</dt><dd>${length}</dd></div>
        <div><dt>고유 기호</dt><dd>${freq.length}</dd></div>
        <div><dt>H(X)</dt><dd>${H.toFixed(3)} bit/sym</dd></div>
        <div><dt>최대 가능</dt><dd>${maxH.toFixed(3)} bit/sym</dd></div>
      </dl>
      <div class="hist" role="img" aria-label="빈도 상위 8개 막대">
        ${topN.map(([c, n]) => `
          <div class="hist__row">
            <span class="hist__label" aria-hidden="true">${escape(c)}</span>
            <div class="hist__bar" style="--w: ${((n / maxC) * 100).toFixed(0)}%"></div>
            <span class="hist__n">${n}</span>
          </div>`).join('')}
      </div>
      <div class="gauge" role="img" aria-label="압축 가능성 게이지">
        <div class="gauge__fill" style="--w: ${(headroom * 100).toFixed(0)}%"></div>
        <span class="gauge__cap">압축 여유 = ${(headroom * 100).toFixed(0)}%</span>
      </div>
    </div>`;
  if (inspectorEl) {
    inspectorEl.textContent = `n=${length} · H(X) ≈ ${H.toFixed(2)} bit/sym · 압축 여유 ${(headroom * 100).toFixed(0)}%`;
  }
}
function escape(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
