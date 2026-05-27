# SPEC-086 — Step 86 - Playwright 스크린샷 기반 상세 E2E 테스트

자동 생성: 2026-05-15 11:22:16
원본: step_archive/archived/step086.md

---

## WHAT (무엇을 만드는가)

Step 86 - Playwright 스크린샷 기반 상세 E2E 테스트

## WHY (왜 필요한가)

step086 의 본문 추출 — 다음 Step 진행에 필요한 결과물을 산출하기 위함.

## WHEN (전제 조건)

- 이전 Step (085) 완료
- progress.json.current_step == 86

## ACCEPTANCE (수락 기준)

- 해당 Step의 자체 Self-Calibration 통과
- 결과 파일 step_archive/step086_*.md 생성
- 평가 라운드 Step (49/69/104) 도달 시 TRUST 5 게이트 통과

## REFERENCE (원본 본문 발췌)

```
## Step-Back

실행 전에 먼저 답하라:
- 이 테스트의 핵심 목적은? (한 문장)
- 테스트 실패 시 어느 Step으로 돌아가야 하는가?
- 반드시 확인해야 할 엣지 케이스 2가지는?

프로젝트 특성을 분석하여 테스트 범위와 검증 항목을 동적으로 결정한다.

Playwright를 사용하여 스크린샷을 촬영하며 상세한 E2E 테스트를 수행한다.
"웹 앱"이 아니면 프로젝트 유형에 적합한 스크린샷 기반 테스트를 수행한다.

합리적인 선에서 최대한 많은 서브에이전트를 병렬로 사용한다 (동시 실행 최대 10개).

**스크린샷 E2E 테스트 단계에서 절대로 superpowers:brainstorming을 사용하지 않는다.**

서브에이전트는 항상 haiku를 사용한다.


```

## RUN-COMMAND

Read step_archive/archived/step086.md → 본문 실행
