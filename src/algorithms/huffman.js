// @MX:NOTE: Huffman coding. 빈도 정렬 → 트리 빌드 → prefix-free 부호 할당.
// @MX:NOTE: 출처 step016_조사결과_chunk1.md (Wikipedia Huffman), 사례: MP3/JPEG, DEFLATE 2단계.

/** 빈도 카운트 */
function freqMap(str) {
  const m = new Map();
  for (const ch of str) m.set(ch, (m.get(ch) ?? 0) + 1);
  return m;
}

let _nid = 0;
function leaf(char, freq) { return { id: ++_nid, char, freq, left: null, right: null }; }
function intern(left, right) { return { id: ++_nid, char: null, freq: left.freq + right.freq, left, right }; }

/** Bottom-up tree build. 단계 스냅샷 배열을 반환. */
function buildTree(freq) {
  _nid = 0;
  const q = [...freq.entries()].map(([c, f]) => leaf(c, f));
  q.sort((a, b) => a.freq - b.freq);
  const snapshots = [];
  snapshots.push({ kind: 'huffman-init', nodes: q.map(cloneNode) });
  while (q.length > 1) {
    q.sort((a, b) => a.freq - b.freq);
    const a = q.shift();
    const b = q.shift();
    const p = intern(a, b);
    snapshots.push({ kind: 'huffman-merge', left: cloneNode(a), right: cloneNode(b), parent: cloneNode(p), remaining: q.map(cloneNode) });
    q.push(p);
  }
  const root = q[0] ?? null;
  snapshots.push({ kind: 'huffman-done', root: cloneNode(root) });
  return { root, snapshots };
}

function cloneNode(n) {
  if (!n) return null;
  return { id: n.id, char: n.char, freq: n.freq, left: cloneNode(n.left), right: cloneNode(n.right) };
}

/** 트리에서 부호 사전 추출 */
function codes(root) {
  const map = new Map();
  if (!root) return map;
  if (!root.left && !root.right) { map.set(root.char, '0'); return map; }
  (function dfs(n, code) {
    if (!n.left && !n.right) { map.set(n.char, code || '0'); return; }
    if (n.left) dfs(n.left, code + '0');
    if (n.right) dfs(n.right, code + '1');
  })(root, '');
  return map;
}

export function encodeHuffman(input) {
  if (!input) {
    return { inputLength: 0, outputLength: 0, ratio: 0, steps: [], tree: null, codeTable: new Map(), encodedBits: '', verdict: 'neutral' };
  }
  const f = freqMap(input);
  const { root, snapshots } = buildTree(f);
  const table = codes(root);
  let bits = '';
  for (const ch of input) bits += table.get(ch) ?? '';
  const inBits = input.length * 8;
  const outBits = bits.length;
  return {
    inputLength: input.length,
    outputLength: Math.ceil(outBits / 8),
    inputBits: inBits,
    outputBits: outBits,
    ratio: inBits ? outBits / inBits : 0,
    steps: snapshots,
    tree: root,
    codeTable: table,
    encodedBits: bits,
    verdict: outBits < inBits ? 'compressed' : outBits > inBits ? 'inflated' : 'neutral',
  };
}

export function decodeHuffman(bits, codeTable) {
  if (!bits || !codeTable || codeTable.size === 0) return '';
  const inv = new Map([...codeTable].map(([c, b]) => [b, c]));
  let buf = '', out = '';
  for (const b of bits) {
    buf += b;
    if (inv.has(buf)) { out += inv.get(buf); buf = ''; }
  }
  return out;
}
