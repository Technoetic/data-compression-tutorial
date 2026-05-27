# SPEC-015 — Step 15 - madge 순환 의존성 탐지 환경 설치

자동 생성: 2026-05-18 00:27:58
원본: step_archive/archived/step015.md

---

## WHAT (무엇을 만드는가)

Step 15 - madge 순환 의존성 탐지 환경 설치

## WHY (왜 필요한가)

step015 의 본문 추출 — 다음 Step 진행에 필요한 결과물을 산출하기 위함.

## WHEN (전제 조건)

- 이전 Step (014) 완료
- progress.json.current_step == 15

## ACCEPTANCE (수락 기준)

- 해당 Step의 자체 Self-Calibration 통과
- 결과 파일 step_archive/step015_*.md 생성
- 평가 라운드 Step (49/69/104) 도달 시 TRUST 5 게이트 통과

## REFERENCE (원본 본문 발췌)

```
## 검증

Hook 실행 후 다음을 확인:
- `step_archive/step015_madge_test.md` 파일 생성 확인
- `.claude/hooks/madge-validator.log` 로그 확인
- Hook exit code 확인 (0: 성공, 1: 실패)

**검증 실패 시:**
1. 로그 파일 분석
2. 에러 원인 파악 (npm 설치 실패, Node.js 버전 문제 등)
3. 필요한 조치 수행 (npm install -D madge 등)
4. Hook 재실행
5. 검증 통과할 때까지 반복

서브에이전트는 항상 haiku를 사용한다.


```

## RUN-COMMAND

Read step_archive/archived/step015.md → 본문 실행
