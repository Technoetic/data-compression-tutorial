// @MX:NOTE: Base64 (RFC 4648). 압축이 아닌 부호화 — 33% 증가.
// @MX:NOTE: 출처 step016_조사결과_chunk2.md, 사례: 이메일 첨부, data: URI, JWT, QR.

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** UTF-8 bytes from string */
function utf8Bytes(str) {
  return new TextEncoder().encode(str);
}

/** 4단계 시각화 스냅샷 반환 */
export function encodeBase64Step(input) {
  const bytes = utf8Bytes(input);
  // 단계 1: 바이트 시퀀스
  const asciiList = Array.from(bytes);
  // 단계 2: 8비트 비트열
  const bits = asciiList.map(b => b.toString(2).padStart(8, '0')).join('');
  // 단계 3: 6비트 그루핑 — 출력 chars 수 = ceil(bytes/3)*4 가 RFC 4648 표준
  const padCount = (3 - (asciiList.length % 3)) % 3;
  const targetBits = asciiList.length === 0 ? 0 : Math.ceil(asciiList.length / 3) * 4 * 6;
  const padBits = bits + '0'.repeat(Math.max(0, targetBits - bits.length));
  const sextets = [];
  for (let i = 0; i < padBits.length; i += 6) sextets.push(padBits.slice(i, i + 6));
  // 단계 4: 알파벳 매핑
  const chars = sextets.map(s => ALPHABET[parseInt(s, 2)]);
  if (padCount > 0) {
    chars.splice(chars.length - padCount, padCount);
    for (let k = 0; k < padCount; k++) chars.push('=');
  }
  const out = chars.join('');
  // 학습용 5단계 누적 스냅샷
  const steps = [];
  if (asciiList.length > 0) {
    steps.push({ kind: 'b64-bytes',   stage: 1, asciiList, bits: '',   sextets: [],      chars: [],     padCount });
    steps.push({ kind: 'b64-bytes',   stage: 2, asciiList, bits,        sextets: [],      chars: [],     padCount });
    steps.push({ kind: 'b64-bytes',   stage: 3, asciiList, bits,        sextets,           chars: [],     padCount });
    // stage 4: 매핑 직후, 패딩 `=` 적용 전 상태
    const prePadChars = sextets.map(s => ALPHABET[parseInt(s, 2)]);
    steps.push({ kind: 'b64-bytes',   stage: 4, asciiList, bits, sextets, chars: prePadChars, padCount, prePad: true });
    steps.push({ kind: 'b64-bytes',   stage: 5, asciiList, bits,        sextets,           chars,         padCount });
  } else {
    steps.push({ kind: 'b64-bytes', stage: 5, asciiList, bits, sextets, chars, padCount });
  }
  return {
    inputLength: input.length,
    outputLength: out.length,
    ratio: input.length ? out.length / input.length : 0,
    steps,
    asciiList,
    bits,
    sextets,
    chars,
    padding: '='.repeat(padCount),
    encoded: out,
    verdict: out.length > input.length ? 'inflated' : out.length < input.length ? 'compressed' : 'neutral',
  };
}

export function decodeBase64Step(b64) {
  try { return new TextDecoder().decode(_b64ToBytes(b64)); } catch { return ''; }
}
function _b64ToBytes(b64) {
  const clean = b64.replace(/=+$/, '');
  const bits = [...clean].map(c => {
    const idx = ALPHABET.indexOf(c);
    return idx < 0 ? '' : idx.toString(2).padStart(6, '0');
  }).join('');
  const cut = bits.length - (bits.length % 8);
  const bytes = [];
  for (let i = 0; i < cut; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return new Uint8Array(bytes);
}
