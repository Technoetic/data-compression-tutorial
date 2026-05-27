---
step: 017
chunk: 1
type: github-research
topic: "데이터 압축과 부호화 — 참고 가능한 오픈소스 시각화 레포"
collected_at: 2026-05-26
source: GitHub Search API (api.github.com/search/repositories)
---

# Step 017 — GitHub 조사 결과

## Step-Back 답변

- **핵심 목적**: 압축·부호화 알고리즘을 인터랙티브로 보여주는 기존 오픈소스 레포를 식별해 (a) UI 구조 (b) 시각화 메타포 (c) 사용한 라이브러리 를 본 튜토리얼 기획에 차용할 후보로 정리한다.
- **영향 Step**: step025(기획), step030(통합 설계), step037(구현 — 단원별 위젯 라이브러리 결정).
- **핵심 확인 3가지**: ① 단원별(RLE/허프만/LZ77/Base64)로 참고 가능 레포 최소 1개씩, ② 스크린샷/데모 링크 존재 여부, ③ 외부 의존성 수준(우리는 외부 무거운 의존성 0).

## 1. Huffman Coding 시각화 — `huffman+coding+visualizer` (108 hits)

| 레포 | ★ | 설명 |
|:---|:---|:---|
| `190n/huffman-visualization` | 27 | Visualization of Huffman coding |
| `SPIN0ZAi/Data-Structures-Visualizer` | 7 | An interactive web application for learning and visualizing data structures and algorithms |
| `assaabriiii/Huffman-coding` | 5 | The Huffman graphical tree is a visualization of the Huffman coding algorithm |
| `MrFr0g-X/adaptive-huffman-coding` | 3 | Implementation of the Adaptive Huffman (FGK) in Java with visualization |
| `finnegantdewitt/compression-visualizer` | 3 | Visualization of the Huffman Coding algorithm written in React (cse-115a) |

**시사점**:
- 별 27의 1위 레포가 시각화 베스트 프랙티스 참고 가능.
- React 기반 학습용 시각화 다수 → 우리는 vanilla JS로 단일 HTML 구현하므로 메타포만 차용.

## 2. LZ77 시각화 — `lz77+visualization` (6 hits, 희소 분야)

| 레포 | ★ | 설명 |
|:---|:---|:---|
| `Sharukesh3/GUI-Driven-Text-Compression` | 3 | GUI-Driven Text Compression application |
| `valentinbarral/lz77-demo` | 0 | **An interactive, step-by-step visualization of the LZ77 compression algorithm** |
| `surfsurfmasurf/ziplike` | 0 | Compression algorithm visualizer — interactive LZ77, Huffman, entropy analysis |
| `jannikw/lempel-ziv` | 0 | Lempel-Ziv playground for LZ77 and variants, visualizing |
| `HussainQadri/EncodeEd` | 0 | PyQt desktop app for visualizing lossless compression algorithms |

**시사점**:
- LZ77 시각화는 희소 → 본 튜토리얼이 차별화 가능.
- `valentinbarral/lz77-demo`의 "step-by-step" 컨셉 + `surfsurfmasurf/ziplike`의 통합 비교 컨셉을 합치는 방향이 유리.

## 3. Base64 인코드 데모 — `base64+encode+demo` (33 hits)

| 레포 | ★ | 설명 |
|:---|:---|:---|
| `zhangxu0307/face-id-backend` | 55 | (관련성 낮음, 얼굴인식 백엔드) |
| `elye/demo_android_base64_image` | 6 | Demo encode and decode base64 to and from image file |
| `thodinh/Innoria.Demo.Base64` | 1 | Demo Base64 Encode And Decode |

**시사점**:
- Base64 시각화 전용 레포는 적음. 대신 우리가 직접 "텍스트/이미지 → 6비트 그루핑 → 알파벳 매핑" 4단 애니메이션으로 만드는 편이 깔끔.

## 4. 압축 알고리즘 시각화 종합 — `compression+algorithm+visualizer` (80 hits)

| 레포 | ★ | 설명 |
|:---|:---|:---|
| `mavam/compbench` | 24 | **Benchmark and visualization of various compression algorithms** |
| `assaabriiii/Huffman-coding` | 5 | (위와 동일) |
| `DungLai/Image-Compression-Segmentation` | 4 | K-Means + Image Compression/Segmentation |
| `finnegantdewitt/compression-visualizer` | 3 | (위와 동일) |
| `Sharukesh3/GUI-Driven-Text-Compression` | 3 | (위와 동일) |

**시사점**:
- `mavam/compbench`의 벤치마크 그래프 컨셉(다양한 알고리즘 압축률/속도) → "종합 비교" 마지막 단원에 참고.

## 5. RLE 관련 — 별도 검색 결과 미수집 (이유 + 결정)

- RLE는 알고리즘 단순도가 매우 높아 단독 시각화 레포가 거의 없음.
- 결정: 본 튜토리얼이 자체 위젯(픽셀 격자 + 빈도 카운트)으로 직접 구현. step016 raw 데이터 + Wikipedia PackBits/TGA 사례를 직접 인용.

## 6. 본 튜토리얼이 참고할 핵심 메타포 (정리)

| 단원 | 참고 메타포 | 출처 |
|:---|:---|:---|
| RLE | 픽셀 격자 + 숫자 라벨 | 자체 설계 (단순함) |
| Huffman | 빈도 히스토그램 → 트리 빌드 애니메이션 → 비트열 매핑 | `190n/huffman-visualization`, `finnegantdewitt` |
| LZ77 | 슬라이딩 윈도우 시각화 + 매칭 화살표 + 토큰 스트림 | `valentinbarral/lz77-demo`, `surfsurfmasurf/ziplike` |
| Base64 | 입력 비트열 → 6비트 그루핑 → 알파벳 매핑 4단 애니메이션 | 자체 설계 |

## 7. 외부 의존성 정책 재확인

- 우리는 **외부 무거운 의존성 0** 정책.
- React/PyQt 기반 레포의 코드 패턴은 차용 금지, **메타포/구조만** 참고.
- DOM + canvas + vanilla JS로 동일 효과 구현 (단일 HTML 우선).

## CoVe 체크

- [x] 4개 단원 모두 참고 레포 또는 자체 설계 결정 명시
- [x] GitHub API 호출 결과 raw json 저장 (step_archive/research-raw-gh-*.json)
- [x] 스타 수·설명 1줄 정리로 향후 Step 참조 가능
- [x] 외부 의존성 정책 재확인
