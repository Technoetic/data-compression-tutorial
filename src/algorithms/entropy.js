// @MX:NOTE: 정보 엔트로피 계산. 압축 가능성의 이론적 하한.
// @MX:ANCHOR: ChapterResult 인터페이스 SoT (fan_in = 5: entropy/rle/huffman/lz77/base64 모두 동일 형태 반환)
// @MX:REASON: 4단원 + 인트로가 단원 카드 UI를 공유하므로 동일 결과 형태가 계약.

/** 빈도 카운트 */
function freqMap(str) {
  const m = new Map();
  for (const ch of str) m.set(ch, (m.get(ch) ?? 0) + 1);
  return m;
}

/** Shannon entropy in bits/symbol */
export function shannonEntropy(str) {
  if (!str) return 0;
  const n = str.length;
  const f = freqMap(str);
  let h = 0;
  for (const [, c] of f) {
    const p = c / n;
    h -= p * Math.log2(p);
  }
  return h;
}

/** Returns ChapterResult-like object */
export function encodeEntropy(input) {
  const len = input.length;
  const H = shannonEntropy(input);
  const f = freqMap(input);
  const sorted = [...f.entries()].sort((a, b) => b[1] - a[1]);
  const maxH = Math.log2(Math.max(1, f.size));
  const headroom = maxH > 0 ? 1 - H / maxH : 0;
  // 학습용 누적 스냅샷: 입력을 한 글자씩 추가하며 H가 어떻게 변하는지 보여준다
  const steps = [];
  let acc = '';
  const stride = Math.max(1, Math.ceil(len / 8)); // 입력이 길면 8단계 정도로 나눠 표시
  for (let i = stride; i <= len; i += stride) {
    acc = input.slice(0, i);
    const subH = shannonEntropy(acc);
    const subF = [...freqMap(acc).entries()].sort((a, b) => b[1] - a[1]);
    const subMax = Math.log2(Math.max(1, subF.length));
    const subHead = subMax > 0 ? 1 - subH / subMax : 0;
    steps.push({ kind: 'entropy', H: subH, maxH: subMax, headroom: subHead, freq: subF, length: i });
  }
  if (steps.length === 0) {
    steps.push({ kind: 'entropy', H, maxH, headroom, freq: sorted, length: len });
  } else if (steps[steps.length - 1].length !== len) {
    steps.push({ kind: 'entropy', H, maxH, headroom, freq: sorted, length: len });
  }
  return {
    inputLength: len,
    outputLength: Math.ceil(H * len / 8),
    ratio: maxH > 0 ? H / maxH : 0,
    steps,
    verdict: headroom > 0.2 ? 'compressed' : headroom > 0.05 ? 'neutral' : 'inflated',
  };
}
