// @MX:NOTE: LZ77 sliding-window. 학습용 windowSize=32 기본.
// @MX:NOTE: 출처 step016_조사결과_chunk2.md (Wikipedia LZ77), 사례: DEFLATE/GIF/7z.

/**
 * 학습용 LZ77 인코더. (D, L, c) 토큰 스트림 반환.
 * D = 매치 시작 거리 (0이면 미매치)
 * L = 매치 길이
 * c = 매치 다음 문자
 */
export function encodeLZ77(input, windowSize = 32) {
  const tokens = [];
  const steps = [];
  const n = input.length;
  let i = 0;
  while (i < n) {
    const winStart = Math.max(0, i - windowSize);
    let bestD = 0, bestL = 0;
    // 가장 긴 매치 탐색 (왼쪽에서 오른쪽)
    for (let j = winStart; j < i; j++) {
      let k = 0;
      while (i + k < n && input[j + k] === input[i + k]) k++;
      if (k > bestL) { bestL = k; bestD = i - j; }
    }
    const c = input[i + bestL] ?? '';
    tokens.push({ d: bestD, l: bestL, c });
    steps.push({
      kind: 'lz77-token',
      cursor: i,
      windowStart: winStart,
      windowEnd: i,
      matchStart: bestD ? i - bestD : -1,
      matchLength: bestL,
      nextChar: c,
      tokensSoFar: tokens.slice(),
    });
    i += bestL + 1;
  }
  // 단순 비트수 추정: 토큰당 (window log + len log + 1byte) ≈ 14bit (window 32) + 5bit(len 0..31) + 8bit
  const estBitsPerTok = Math.ceil(Math.log2(windowSize + 1)) + 5 + 8;
  const outBits = tokens.length * estBitsPerTok;
  const inBits = input.length * 8;
  return {
    inputLength: input.length,
    outputLength: Math.ceil(outBits / 8),
    inputBits: inBits,
    outputBits: outBits,
    ratio: inBits ? outBits / inBits : 0,
    steps,
    tokens,
    windowSize,
    verdict: outBits < inBits ? 'compressed' : outBits > inBits ? 'inflated' : 'neutral',
  };
}

export function decodeLZ77(tokens) {
  let out = '';
  for (const t of tokens) {
    if (t.l > 0 && t.d > 0) {
      const start = out.length - t.d;
      for (let k = 0; k < t.l; k++) out += out[start + k];
    }
    if (t.c) out += t.c;
  }
  return out;
}
