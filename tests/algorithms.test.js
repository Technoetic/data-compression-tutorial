// @MX:NOTE: 알고리즘 모듈 round-trip + 형태 검증.
import { describe, it, expect } from 'vitest';
import { encodeRLE, decodeRLE } from '../src/algorithms/rle.js';
import { encodeHuffman, decodeHuffman } from '../src/algorithms/huffman.js';
import { encodeLZ77, decodeLZ77 } from '../src/algorithms/lz77.js';
import { encodeBase64Step, decodeBase64Step } from '../src/algorithms/base64.js';
import { encodeEntropy, shannonEntropy } from '../src/algorithms/entropy.js';

describe('RLE', () => {
  it('AAAABBBCCDAA → 4A3B2C1D2A', () => {
    const r = encodeRLE('AAAABBBCCDAA');
    expect(r.encoded).toBe('4A3B2C1D2A');
    expect(r.inputLength).toBe(12);
    expect(r.outputLength).toBe(10);
    expect(r.verdict).toBe('compressed');
  });
  it('round-trip', () => {
    for (const s of ['AAAABBBCCDAA', 'abc', 'aaaa', '', 'A']) {
      expect(decodeRLE(encodeRLE(s).encoded)).toBe(s);
    }
  });
  it('빈 입력은 예외 없이 빈 결과', () => {
    const r = encodeRLE('');
    expect(r.inputLength).toBe(0);
    expect(r.tokens).toEqual([]);
    expect(r.steps).toEqual([]);
  });
  it('snapshot 개수 = run 개수', () => {
    const r = encodeRLE('AAAABBBCCDAA');
    expect(r.steps.length).toBe(5); // 4A,3B,2C,1D,2A
  });
});

describe('Huffman', () => {
  it('Wikipedia 예시 — 부호 사전이 prefix-free', () => {
    const r = encodeHuffman('this is an example of a huffman tree');
    expect(r.codeTable.size).toBeGreaterThan(0);
    // prefix-free 검증
    const codes = [...r.codeTable.values()];
    for (const a of codes) for (const b of codes) {
      if (a !== b) expect(a.startsWith(b)).toBe(false);
    }
  });
  it('round-trip', () => {
    for (const s of ['this is an example of a huffman tree', 'hello world', 'aaaa', 'ab']) {
      const r = encodeHuffman(s);
      expect(decodeHuffman(r.encodedBits, r.codeTable)).toBe(s);
    }
  });
  it('압축 효율 — 빈도 편향이 있을 때 ratio < 1', () => {
    const r = encodeHuffman('aaaaaaaabbcc');
    expect(r.ratio).toBeLessThan(1);
  });
  it('snapshot kind 3종 모두 발생', () => {
    const r = encodeHuffman('abc');
    const kinds = new Set(r.steps.map(s => s.kind));
    expect(kinds.has('huffman-init')).toBe(true);
    expect(kinds.has('huffman-merge')).toBe(true);
    expect(kinds.has('huffman-done')).toBe(true);
  });
});

describe('LZ77', () => {
  it('round-trip', () => {
    for (const s of ['abracadabraabracadabra', 'aaaaa', 'abcdef', 'a']) {
      const r = encodeLZ77(s, 32);
      expect(decodeLZ77(r.tokens)).toBe(s);
    }
  });
  it('반복 패턴은 매치 발견', () => {
    const r = encodeLZ77('abcabcabc', 32);
    const hasMatch = r.tokens.some(t => t.l > 0);
    expect(hasMatch).toBe(true);
  });
  it('빈 입력 처리', () => {
    const r = encodeLZ77('', 32);
    expect(r.tokens).toEqual([]);
    expect(r.outputLength).toBe(0);
  });
});

describe('Base64', () => {
  it('"Many hands make light work." → TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcmsu', () => {
    const r = encodeBase64Step('Many hands make light work.');
    expect(r.encoded).toBe('TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcmsu');
  });
  it('Man → TWFu (패딩 없음)', () => {
    const r = encodeBase64Step('Man');
    expect(r.encoded).toBe('TWFu');
    expect(r.padding).toBe('');
  });
  it('Ma → TWE= (1 패딩)', () => {
    const r = encodeBase64Step('Ma');
    expect(r.encoded).toBe('TWE=');
    expect(r.padding).toBe('=');
  });
  it('M → TQ== (2 패딩)', () => {
    const r = encodeBase64Step('M');
    expect(r.encoded).toBe('TQ==');
    expect(r.padding).toBe('==');
  });
  it('round-trip via decodeBase64Step', () => {
    for (const s of ['Man', 'Ma', 'M', 'Many hands make light work.', 'a']) {
      const r = encodeBase64Step(s);
      expect(decodeBase64Step(r.encoded)).toBe(s);
    }
  });
  it('33% 증가 (verdict=inflated)', () => {
    const r = encodeBase64Step('Many hands make light work.');
    expect(r.verdict).toBe('inflated');
  });
  it('Browser btoa()와 일치', () => {
    for (const s of ['Man', 'hello', 'abcdef']) {
      expect(encodeBase64Step(s).encoded).toBe(btoa(s));
    }
  });
});

describe('Entropy', () => {
  it('모든 글자 같으면 H ≈ 0', () => {
    expect(shannonEntropy('AAAA')).toBe(0);
  });
  it('빈도 균등하면 H = log2(n)', () => {
    expect(shannonEntropy('AB')).toBeCloseTo(1, 5);
    expect(shannonEntropy('ABCD')).toBeCloseTo(2, 5);
  });
  it('encodeEntropy 형식', () => {
    const r = encodeEntropy('AAAAABBCD');
    expect(r.inputLength).toBe(9);
    expect(r.steps.length).toBeGreaterThanOrEqual(1);
    expect(r.steps[0].kind).toBe('entropy');
    expect(r.steps[r.steps.length - 1].length).toBe(9);
  });
  it('빈 입력', () => {
    const r = encodeEntropy('');
    expect(r.steps.length).toBe(1);
    expect(r.steps[0].H).toBe(0);
  });
});
