// @MX:NOTE: Huffman 트리 시각화 — Canvas 그리기 + devicePixelRatio 대응 + 부호 사전 테이블.
// @MX:WARN: 큰 입력(>500자)은 트리 깊이가 커져 canvas overflow 가능.
// @MX:REASON: 학습용 windowSize·input 길이는 UI에서 자체 제한 권장.

export function renderHuffmanTree(vizEl, snap, inspectorEl, ctx) {
  const root = pickRoot(snap);
  ensureCanvas(vizEl);
  const canvas = vizEl.querySelector('canvas');
  const dpr = window.devicePixelRatio || 1;
  const w = vizEl.clientWidth, h = Math.max(280, vizEl.clientHeight || 320);
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
  const c = canvas.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);
  // 다크 OLED 토큰을 직접 사용 (CSS getComputedStyle)
  const styles = getComputedStyle(document.documentElement);
  const colNode = styles.getPropertyValue('--text-1').trim() || '#E8ECEF';
  const colEdge = styles.getPropertyValue('--border-1').trim() || '#1F232A';
  const colAcc = styles.getPropertyValue('--accent').trim() || '#66E6A4';

  if (!root) {
    c.fillStyle = colEdge; c.font = '14px var(--font-mono, monospace)';
    c.fillText('입력을 채우세요', 12, 28);
  } else {
    layout(root, 16, w - 16, 28, h - 28);
    drawTree(c, root, colNode, colEdge, colAcc, snap);
  }

  // 부호 사전 (있으면)
  const dictEl = vizEl.querySelector('.huff-dict');
  if (dictEl && ctx?.codeTable) {
    dictEl.innerHTML = [...ctx.codeTable.entries()]
      .sort((a, b) => a[1].length - b[1].length)
      .map(([ch, code]) => `<tr><td>${escape(ch)}</td><td class="mono">${code}</td></tr>`).join('');
  }

  if (inspectorEl) {
    if (snap?.kind === 'huffman-merge') {
      inspectorEl.textContent = `Merge: freq ${snap.left.freq} + ${snap.right.freq} → ${snap.parent.freq}`;
    } else if (snap?.kind === 'huffman-done') {
      inspectorEl.textContent = `완료 (root freq = ${snap.root?.freq ?? 0})`;
    } else if (snap?.kind === 'huffman-init') {
      inspectorEl.textContent = `초기 노드 ${snap.nodes.length}개`;
    } else {
      inspectorEl.textContent = '대기 중';
    }
  }
}

function pickRoot(snap) {
  if (!snap) return null;
  if (snap.kind === 'huffman-done') return snap.root;
  if (snap.kind === 'huffman-merge') return snap.parent;
  if (snap.kind === 'huffman-init') return snap.nodes?.[0] ?? null;
  return null;
}

function ensureCanvas(vizEl) {
  if (vizEl.querySelector('canvas')) {
    if (!vizEl.querySelector('.huff-dict-wrap')) vizEl.insertAdjacentHTML('beforeend', dictTpl());
    return;
  }
  vizEl.innerHTML = `<canvas aria-label="Huffman 트리" role="img"></canvas>${dictTpl()}`;
}
function dictTpl() {
  return `<div class="huff-dict-wrap" tabindex="0" role="region" aria-label="허프만 부호 사전"><table class="huff-dict-table"><thead><tr><th>심볼</th><th>코드</th></tr></thead><tbody class="huff-dict"></tbody></table></div>`;
}

function layout(node, x0, x1, y0, y1) {
  const leaves = [];
  (function collect(n) { if (!n.left && !n.right) leaves.push(n); else { if (n.left) collect(n.left); if (n.right) collect(n.right); } })(node);
  if (leaves.length === 0) return;
  const step = (x1 - x0) / Math.max(1, leaves.length - 1 || 1);
  leaves.forEach((lf, i) => { lf._x = leaves.length === 1 ? (x0 + x1) / 2 : x0 + i * step; lf._y = y1 - 14; });
  // depth-up
  (function setY(n, d) {
    if (!n.left && !n.right) { n._d = d; return; }
    if (n.left) setY(n.left, d + 1);
    if (n.right) setY(n.right, d + 1);
    n._d = d;
    n._x = (n.left?._x ?? 0 + (n.right?._x ?? 0)) / (n.right ? 2 : 1);
    if (n.left && n.right) n._x = (n.left._x + n.right._x) / 2;
    else n._x = n.left?._x ?? n.right?._x ?? (x0 + x1) / 2;
  })(node, 0);
  const maxD = (function maxDepth(n) { if (!n) return 0; return 1 + Math.max(maxDepth(n.left), maxDepth(n.right)); })(node);
  (function setYAbs(n) {
    n._y = y0 + (n._d / Math.max(1, maxD - 1)) * (y1 - y0 - 14);
    if (n.left) setYAbs(n.left);
    if (n.right) setYAbs(n.right);
  })(node);
}

function drawTree(c, n, colNode, colEdge, colAcc, snap) {
  if (!n) return;
  if (n.left) {
    c.strokeStyle = colEdge; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(n._x, n._y); c.lineTo(n.left._x, n.left._y); c.stroke();
    c.fillStyle = colEdge; c.font = '11px var(--font-mono, monospace)';
    c.fillText('0', (n._x + n.left._x) / 2 - 6, (n._y + n.left._y) / 2);
    drawTree(c, n.left, colNode, colEdge, colAcc, snap);
  }
  if (n.right) {
    c.strokeStyle = colEdge;
    c.beginPath(); c.moveTo(n._x, n._y); c.lineTo(n.right._x, n.right._y); c.stroke();
    c.fillStyle = colEdge; c.font = '11px var(--font-mono, monospace)';
    c.fillText('1', (n._x + n.right._x) / 2 + 2, (n._y + n.right._y) / 2);
    drawTree(c, n.right, colNode, colEdge, colAcc, snap);
  }
  const r = 14;
  const isMergedNow = snap?.kind === 'huffman-merge' && [snap.left?.id, snap.right?.id, snap.parent?.id].includes(n.id);
  c.fillStyle = isMergedNow ? colAcc : colNode;
  c.beginPath(); c.arc(n._x, n._y, r, 0, Math.PI * 2); c.fill();
  c.fillStyle = isMergedNow ? '#000' : '#0A0B0E';
  c.font = '11px var(--font-mono, monospace)';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(n.char ? `${n.char}:${n.freq}` : String(n.freq), n._x, n._y);
}

function escape(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
