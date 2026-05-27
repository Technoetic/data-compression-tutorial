---
type: reference
date_created: 2026-05-17
source_report: 클로드 코드와 옵시디언 기반의 하네스 엔지니어링 구축 및 자동화 기여를 위한 심층 실무 가이드.md
section_origin: §6.1
verified_against: https://code.claude.com/docs/en/cli-reference
applies_to_main_claude_md: false
tags: [reference, claude-code, cli, harness]
---

# Claude Code CLI 명령어 레퍼런스 — 하네스 step 진행 시 선택 활용

> 보고서 §6.1 적용. 본 프로젝트는 **자동 실행** 우선이므로 모든 명령어는 **선택적 도구**이다. step 자동 흐름을 깨는 명령어 호출(`/clear` 등)은 금지.

## 토큰 예산 관리

| 명령어 | 용도 | 본 프로젝트에서의 적용 |
|:---|:---|:---|
| `/context` | 컨텍스트 점유율 확인 | step 5개 처리 후 점검 권장 (50% 도달 시 `/compact`) |
| `/cost` | API 누적 과금 모니터링 | 세션 종료 시 1회 확인 (월 정기 점검 충분) |
| `/compact` | 대화 요약 압축 + 모든 CLAUDE.md 재로드 | **권장**: 컨텍스트 70% 초과 시. step 자동 흐름 유지됨 |
| `/clear` | 세션 완전 초기화 | ❌ **금지**: step 자동 재개 흐름 파괴 가능 |

## 모델 전환

| 명령어 | 용도 | 본 프로젝트 정책 |
|:---|:---|:---|
| `/model haiku` | Haiku로 전환 (저비용) | 단순 도구 호출·검증 step에 권장 |
| `/model sonnet` | Sonnet으로 전환 (균형) | 평가 게이트(step 49/69/104)만 강제 |
| `/model opus` | Opus로 전환 (최고 추론) | 디버깅·복잡 의존성 step에서만 |
| `Alt+P` | 텍스트 유지하며 모델 전환 | 입력 중 모델 변경 시 |

> 본 프로젝트 모델 매트릭스(CLAUDE.md 71-79줄)와 일관성 유지 필수. 서브에이전트는 항상 haiku.

## 변경 검토

| 명령어 | 용도 | 본 프로젝트에서의 적용 |
|:---|:---|:---|
| `/diff` | 세션 중 모든 변경 인터랙티브 검토 | step 완료 후 commit 직전 권장 |

## 심층 추론

| 단축키 | 용도 | 본 프로젝트에서의 적용 |
|:---|:---|:---|
| `Alt+T` | Extended Thinking 모드 토글 | 평가 게이트·디버깅 step 한정. 일반 step에는 불필요 |

> 사전 요구: `/terminal-setup` 1회 실행 (멀티라인 + 단축키 활성화)

## 파일 참조

| 심볼 | 용도 | 본 프로젝트에서의 적용 |
|:---|:---|:---|
| `@<경로>` | 자동완성 파일 첨부 | step 본문 인용 시 `@step_archive/archived/stepNNN.md` 형태로 |

## 스케줄링

| 명령어 | 용도 | 본 프로젝트 정책 |
|:---|:---|:---|
| `/schedule` | 크론 기반 원격 에이전트 | 야간 progress.json↔git 동기화 점검 등에 활용 가능 |
| `/loop <간격> <프롬프트>` | 정주기 반복 | step 평가 게이트 모니터링에 활용 가능 |

> 사용자 명시 요청 시에만 활성화 (자동 시작 금지).

## 본 프로젝트 자동화 흐름과의 충돌 주의

다음 명령어는 step 하네스의 Stop 훅 자동 재개와 충돌할 수 있어 **자동 호출 금지**:
- `/clear` — 세션 메모리 전체 폭파
- `/resume` 외부 세션 — 다른 progress.json 로드 위험
- `/exit` — 사용자가 명시 종료 시에만

## 권장 단계별 활용 패턴

```
세션 시작
  └─ SessionStart 훅이 progress.json 로드
  └─ 본 wiki/hot.md 조회 (수동 또는 SessionStart 훅 확장)

Step N 실행
  └─ 5개 진행 후 /context 점검
  └─ 70% 초과 시 /compact

평가 게이트 (49/69/104) 도달
  └─ /model sonnet (CLAUDE.md 강제)
  └─ Alt+T (Extended Thinking 활성)
  └─ 통과 후 /model haiku 복귀

세션 종료 전
  └─ /diff로 전체 변경 검토
  └─ /cost로 비용 확인
  └─ wiki/hot.md 갱신 (수동 트리거)
```

## 출처 검증

- 본 레퍼런스의 모든 명령어는 [code.claude.com CLI reference](https://code.claude.com/docs/en/cli-reference)에서 검증됨
- 보고서 §6.1 표는 일부 검증되지 않은 명령어(`/extra-usage`)를 포함하여 본 문서에서는 제외
