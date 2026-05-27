// @MX:NOTE: Base64 시각화 — ASCII → 8비트 → 6비트 그루핑 → 알파벳 4단계 보드.

export function renderBase64Bits(vizEl, snap, inspectorEl) {
  if (!snap) { vizEl.innerHTML = '<p class="muted">입력을 채우세요.</p>'; return; }
  const { asciiList, bits, sextets, chars, padCount, stage = 5, prePad = false } = snap;
  const stageLabels = {
    1: '1/5 · ASCII 바이트',
    2: '2/5 · 8비트 비트열',
    3: '3/5 · 6비트 그루핑',
    4: '4/5 · 알파벳 매핑 (패딩 전)',
    5: '5/5 · 패딩 `=` 적용 (완료)',
  };
  // 입력 글자
  const fullInput = (vizEl.dataset.input ?? '');
  const headerRow = [...fullInput].map(ch => `<span class="b64-ch">${escape(ch)}</span>`).join('');
  const asciiRow = asciiList.map(n => `<span class="b64-ascii">${n}</span>`).join('');
  // 8비트 행 (8씩 끊음)
  const bits8 = bits.match(/.{1,8}/g) ?? [];
  const bits8Row = bits8.map(b => `<span class="b64-bits8">${b}</span>`).join('');
  // 6비트 행
  const bits6Row = sextets.map(s => `<span class="b64-bits6">${s}</span>`).join('');
  // 알파벳 행
  const charsRow = chars.map(c => {
    const cls = c === '=' ? 'b64-out b64-out--pad' : 'b64-out';
    return `<span class="${cls}">${escape(c)}</span>`;
  }).join('');
  // 단계가 낮으면 해당 행만 활성화하고 이후 행은 흐리게(.b64-step--pending) 표시
  const cls = (s) => stage >= s ? 'b64-step' : 'b64-step b64-step--pending';
  vizEl.innerHTML = `
    <div class="b64-card">
      <div class="b64-stage-tag" aria-hidden="true">${stageLabels[stage]}</div>
      <div class="${cls(1)}"><span class="b64-step__lbl">① 입력</span><div class="b64-step__row">${headerRow || '<span class="muted">…</span>'}</div></div>
      <div class="${cls(1)}"><span class="b64-step__lbl">② ASCII (10진)</span><div class="b64-step__row">${asciiRow}</div></div>
      <div class="${cls(2)}"><span class="b64-step__lbl">③ 8비트 ×n</span><div class="b64-step__row b64-step__row--mono">${bits8Row}</div></div>
      <div class="${cls(3)}"><span class="b64-step__lbl">④ 6비트 그루핑</span><div class="b64-step__row b64-step__row--mono">${bits6Row}</div></div>
      <div class="${cls(4)}"><span class="b64-step__lbl">⑤ 알파벳 매핑${prePad ? ' (패딩 전)' : ''}</span><div class="b64-step__row">${charsRow}</div></div>
    </div>`;
  if (inspectorEl) {
    inspectorEl.textContent = `${stageLabels[stage]} · ${asciiList.length} bytes → ${chars.length} chars (padding ${padCount})`;
  }
}

export function setB64Input(vizEl, input) { vizEl.dataset.input = input; }

function escape(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
