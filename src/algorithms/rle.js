// @MX:NOTE: Run-Length Encoding. 학습용 가시성 우선 — "4A3B2C1D2A" 형태로 직렬화.
// @MX:NOTE: 출처 step016_조사결과_chunk1.md (Wikipedia RLE), 사례: 팩스, BMP/RLE, JPEG 후처리.

/** 학습용 RLE 인코딩. 단계 스냅샷 반환. */
export function encodeRLE(input) {
  const arr = [...input];
  const tokens = [];
  const steps = [];
  let i = 0;
  while (i < arr.length) {
    const ch = arr[i];
    let count = 1;
    while (i + count < arr.length && arr[i + count] === ch) count++;
    tokens.push({ char: ch, count, start: i });
    steps.push({
      kind: 'rle-run',
      cursor: i,
      runChar: ch,
      runLength: count,
      tokensSoFar: tokens.slice(),
    });
    i += count;
  }
  const encoded = tokens.map(t => `${t.count}${t.char}`).join('');
  return {
    inputLength: input.length,
    outputLength: encoded.length,
    ratio: input.length ? encoded.length / input.length : 0,
    steps,
    encoded,
    tokens,
    verdict: encoded.length < input.length ? 'compressed'
      : encoded.length > input.length ? 'inflated' : 'neutral',
  };
}

/** 디코딩. 정답성 검증용. */
export function decodeRLE(encoded) {
  let out = '';
  let i = 0;
  while (i < encoded.length) {
    let n = '';
    while (i < encoded.length && /[0-9]/.test(encoded[i])) { n += encoded[i++]; }
    const ch = encoded[i++] ?? '';
    out += ch.repeat(Number(n) || 0);
  }
  return out;
}
