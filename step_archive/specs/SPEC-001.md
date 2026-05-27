# SPEC-001 — Step 1 - 하네스 프리플라이트 체크

자동 생성: 2026-05-12 22:41:35
원본: step_archive/archived/step001.md

---

## WHAT (무엇을 만드는가)

Step 1 - 하네스 프리플라이트 체크

## WHY (왜 필요한가)

step001 의 본문 추출 — 다음 Step 진행에 필요한 결과물을 산출하기 위함.

## WHEN (전제 조건)

- 이전 Step (000) 완료
- progress.json.current_step == 1

## ACCEPTANCE (수락 기준)

- 해당 Step의 자체 Self-Calibration 통과
- 결과 파일 step_archive/step001_*.md 생성
- 평가 라운드 Step (49/69/104) 도달 시 TRUST 5 게이트 통과

## REFERENCE (원본 본문 발췌)

```
## 실행 내용

### 1. 도구 설치 일괄 검증

다음 도구가 설치되어 있는지 확인한다. 미설치 시 자동 설치를 시도한다 (최대 3회 재시도).

| 도구 | 확인 명령 | 설치 명령 | 필수/선택 |
|:---|:---|:---|:---|
| Node.js | node --version | - | 필수 |
| npm | npm --version | - | 필수 |
| Playwright | npx playwright --version | npx playwright install chromium | 필수 |
| Biome | npx biome --version | npm i -D @biomejs/biome | 필수 |
| Stylelint | npx stylelint --version | npm i -D stylelint | 필수 |
| Vitest | npx vitest --version | npm i -D vitest | 필수 |
| c8 | npx c8 --version | npm i -D c8 | 선택 |
| jscpd | npx jscpd --version | npm i -D jscpd | 선택 |
| madge | npx madge --version | npm i -D madge | 선택 |
| tokei | tokei --version | scoop install tokei | 선택 |
| semgrep | semgrep --version | pip install semgrep | 선택 |

### 2. 실패 처리 정책

- **필수 도구 실패**: 3회 재시도 후에도 실패하면 사용자 개입 요청 (치명적 오류)
- **선택 도구 실패**: 경고 기록 후 계속 진행. 해당 도구가 필요한 Step에서 스킵 처리

### 3. progress.json 초기화 확인

step_archive/progress.json이 존재하면 로드하여 이전 진행 상태를 확인한다.
존재하지 않으면 step-progress-loader.ps1이 SessionStart 훅에서 자동 생성한다.

```

## RUN-COMMAND

Read step_archive/archived/step001.md → 본문 실행
