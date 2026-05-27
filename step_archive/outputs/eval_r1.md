# EVAL r1 (sonnet)

- 기능 완성도: 9/10  — §0 엔트로피(IntersectionObserver 진행률), §1 RLE(격자+토큰), §2 Huffman(Canvas 트리+부호사전), §3 LZ77(테이프+D,L,c 토큰), §4 Base64(4단계 보드), §5 종합(DEFLATE 파이프라인 설명) 6단원 모두 렌더. Step/Auto/Reset 컨트롤이 모든 단원(step-meter 포함)에 구현됨. 압축률·판정·비율바 패널 정확 (Huffman 47%, LZ77 76%, Base64 133% 시각 확인). 스크린샷 상 콘솔 에러 0. Base64의 Step 스냅샷이 1개뿐이라 Step 버튼 효과가 사실상 0→완료 1회뿐인 점이 미미한 감점 요인.

- 디자인 충실도: 9/10  — 다크 OLED(#0A0B0E) + 단일 액센트(#66E6A4) + 경고색(#F4B453) 60-30-10 토큰 정확 적용. 8px 그리드(--sp-1~8), 버튼 min-height:44px, 폰트 Helvetica Neue + JetBrains Mono 준수. AI Slop 5대 금지 패턴(Inter/Roboto, 보라 그라데이션, 중앙정렬 카드 남발, 과도한 border-radius, 무작위 픽셀) 회피 확인. Awwwards 5개 사이트 반영: linear(다크 sticky 헤더 + blur), vercel(8px 그리드), ciechanow/distill(절제된 단계별 시각화), visualgo(단원 카드). hover/focus-visible ring/transition duration-150~250 모두 명시. anchor-nav를 모바일에서 숨기는 점은 접근성 상 아쉬우나 레이아웃 붕괴 없음.

- 코드 품질: 9/10  — Chapter 추상 베이스(compute/renderSnapshot 추상 메서드) + 5 서브클래스(Intro/RLE/Huffman/LZ77/Base64) 패턴 명확. async init() / prefers-reduced-motion 존중 auto() 구현. src/algorithms/ 5파일 + src/widgets/ 5파일 단일 책임 분리. @MX:NOTE/@MX:ANCHOR/@MX:WARN/@MX:REASON 4종 태그 주요 파일에 부착 (entropy.js에 fan_in=5 ANCHOR, styles.css에 fan_in≥14 ANCHOR). 외부 의존성 0(Vite devDep만). Biome lint clean, jscpd 중복 0, knip 미사용 0, semgrep 이슈 0, 주석비율 9.6%. huffman.js의 모듈 수준 _nid 가변 전역 상태(@MX:WARN 미부착)가 미미한 결함.

- 성능: 9/10  — 프로덕션 gzip 총합 약 12kB(HTML 3.39+CSS 2.63+JS 6.10) — 단일 페이지 학습 자료로 최적. IntersectionObserver 단일 인스턴스(ProgressManager)로 단원 진행률 처리. prefers-reduced-motion 체크 후 즉시 마지막 스냅샷으로 점프. Vite dev/build 안정 가동, 순환 의존성 0. madge 11파일 순환 없음. 잠재적 단점: 대형 입력(>500자) Huffman canvas overflow 가능(@MX:WARN 존재하나 UI 입력 길이 제한 없음).

- 총점: 36/40  → PASS(≥32)

- 개선 권고:
  1. **Base64 Step 스냅샷 세분화** — 현재 1단계 스냅샷만 있어 Step 버튼이 거의 무의미. bytes→bits→sextets→chars 각 단계를 별도 스냅샷으로 분리하면 학습 효과 향상.
  2. **huffman.js 전역 _nid 상태 @MX:WARN 부착 + 캡슐화** — encodeHuffman() 호출마다 _nid=0 리셋되지만 병렬 호출 시 race 가능. 함수 내부 클로저로 격리 권장.
  3. **모바일 anchor-nav 대체 수단** — max-width:767px에서 anchor-nav:none인데 대체 탐색 수단 없음. 드로어 토글 또는 bottom-sheet 방식으로 접근성 보완.
