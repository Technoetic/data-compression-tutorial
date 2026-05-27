---
type: hot-cache
date_last_updated: 2026-05-18
updated_by: squeeze-report-session-6
source_reports:
  - 클로드 코드와 옵시디언 기반의 하네스 엔지니어링 구축 및 자동화 기여를 위한 심층 실무 가이드.md
  - Claude Code CLI 환경의 대규모 마크다운 메타데이터 일괄 처리 및 부하 회피 전략 심층 분석 보고서.md
purpose: 세션 간 맥락 복구용 단기 캐시. SessionStart 훅이 우선 조회 권장.
---

# Hot Cache — 최근 작업 맥락 요약

> 보고서 §8.1 패턴 적용. 다음 세션 시작 시 본 파일을 먼저 조회하면 이전 맥락을 빠르게 복구할 수 있다.

## ★★★★★★★ squeeze (011) — Wiki Linting + INDEX dangling 11건 즉시 발견 (2026-05-18, 11번째)

`PROMPT_wiki-linting-skill.deepresearch.txt` 의뢰 응답 처리 중 **본 보고서 권장 검증을 즉시 실행 → INDEX.md 위키 링크 11건 dangling 발견**.

**즉시 본문화**: INDEX.md "외부 입력 대기" 섹션 → "squeeze-report 매핑" 단순 테이블로 재작성. dangling 11건 모두 제거.

**원인**: 의뢰 완료 후 사용자가 templates/ 정리 → 11개 .deepresearch.txt + 11개 .md 모두 삭제. INDEX 갱신 누락.

**메타 가치 (본 세션 4번째 가치 회수)**:
1. squeeze-006: retired/ 38개 발견
2. squeeze-008: squeeze-006 부분 정정
3. squeeze-010: obsolete 의뢰 → 갭 5건 회수
4. **squeeze-011: 보고서 권장 즉시 실행 → 실 dangling 발견**

→ 분석/판정 분리 패턴 21회 사이클 동안 일관된 가치 회수.

## squeeze (010) — Tooling validator 11개 보고서 (2026-05-18, 10번째)

`PROMPT_tooling-validator-hooks-11.deepresearch.txt` 의뢰 응답 처리. 의뢰 가치 LOW (squeeze-006 retired/ 발견으로 obsolete) but **기존 11개 hook 개선 영역 5건 회수**.

**판정**: REJECT 2 (신규 신설 — 기존 충족) + DEFER 3 (개선 — NEXT_CYCLE)

**5건 개선 영역**:
1. fail-open 정책 (`exit 0` 강제) — U1 사용자 결정
2. UTF8NoBom 인코딩 — mx-tag/lsp-autofix 충돌 점검
3. YAML frontmatter 표준화 — Dataview 쿼리 가능화
4. Self-Calibration 섹션 — 결과 자동 수집
5. 결과 파일 명명 규약 — step_archive/step<NNN>_<tool>_test.md

**메타 가치**: 의뢰 가치 LOW 보고서에서 갭 분석으로 가치 회수 — squeeze 자체의 두 번째 가치 회수 사례 (첫 번째: squeeze-008 BLOCKER 무효화 정정).

## squeeze (009) — 3중 상태 정합성 도구 (2026-05-18 세션 #8, 9번째)

`PROMPT_state-file-consistency.deepresearch.txt` 의뢰 응답. ACCEPT 7 / REJECT 1 / DEFER 2.

**보고서 자체 신뢰도**: 외부 URL 3/3 PASS + 빈 약속 0.

**본문화**: 의사코드 3개(parse-progress-json/extract-git-progress/scan-result-files) + 4분류 매트릭스(12셀) + 백업·원복 패턴 — 모두 squeeze-report-009.md 본문에 영속화. 실 check-state.ps1 신설은 사용자 동의 + 다음 사이클 진입 전.

**DEFER 2건**: C6 UI·C7 SessionStart 통합 → squeeze-008 BLOCKER 의존. **대안 B (CLAUDE.md @ import) 권장**: 수동/cron 호출로 SessionStart 통합 우회 가능.

## ★★★★★★ squeeze (008) — squeeze-006 부분 정정 (2026-05-18 세션 #8)

본 squeeze는 `PROMPT_sessionstart-context-injection.deepresearch.txt` 의뢰 응답 처리 중 **squeeze-006의 결론 부분 오류 자체 발견**.

**정정 핵심**:
- `[STEP HARNESS AUTO-RESUME]` 메시지 출처 = `step-auto-continue.ps1 라인 197` (Stop 훅 Write-Host) ← grep 확정
- step-context-injector.ps1 = **호출되지 않음** (settings.json 미바인딩 + retired/ 보존)
- squeeze-004 BLOCKER U1 = **active 재확정** (SessionStart 사양 여전히 미검증)
- propose-005 M3 정정(priority LOW)도 부분 오류 → MEDIUM 복원 필요

**메타 가치**: 본 세션 13회 사이클 만에 분석/판정 분리 패턴이 **자기 누적 정정마저 회수** (두 번째 사례, 첫 번째는 squeeze-006의 retired/ 발견).

**대안 B (CLAUDE.md @ import)**: U2 사용자 동의 시 즉시 본문화 가능 — `@step_archive/wiki/hot.md` 디렉티브로 SessionStart 미검증 사양 우회.

## squeeze (007) — MoAI-ADK 갭 매트릭스 (2026-05-18, 7번째 squeeze)

본 squeeze는 `PROMPT_moai-adk-beyond-5-hooks.deepresearch.txt` 의뢰 응답 처리. ACCEPT 7 / REJECT 2 / DEFER 9 (의도적 단순화 충돌 5건).

**보고서 자체 신뢰도**: 외부 URL 다수 PASS + 빈 약속 0 + 27/26/47 전체 목록 완비.

**본문화 적음 사유**: CLAUDE.md MoAI-ADK 보강 섹션이 5 hook 명시 채택 + 나머지 의도적 미채택을 명시. EARS·AST-grep·Conventional commits 모두 의도적 단순화 결정과 충돌. **사용자 결정 영역(U1/U2/U3) 명시**.

## ★★★★★ 옵션 C 하이브리드 자동 진행 완료 (2026-05-18)

**활성화 결과** (사용자 "합리적으로 알아서" 동의):
- 핵심 validator 19개 retired/ → 활성 디렉토리 복사 완료 (playwright, axe-core, c8, jscpd, semgrep, knip, tokei, lhci, stylelint, biome, madge, research, research-chunk, dependency-checker, html-bundler, refactoring, formatting, linting, type-safety)
- 메타 hook 4개 추가 활성화: evaluator-trigger, token-budget-guard, harness-logger, pre-compact
- **settings.json 갱신**: PostToolUse(Write|Edit)에 token-budget-guard 추가 + PostToolUse(Read)에 evaluator-trigger 신규 바인딩
- **활성 .ps1 총수: 11 → 34** (settings.json 바인딩은 11→14)

**활성화 이후 변화**:
- step001~014 도구 검증 hook 11개 모두 호출 가능 (다음 사이클부터 fail-fast 없이 실행)
- step015~069 research·impl hook 8개 모두 호출 가능
- step 본문이 `& .claude\hooks\<name>-validator.ps1` 직접 호출 시 즉시 발견
- Read 도구마다 evaluator-trigger 발화 → `# EVAL` 마커 자동 감지
- Write/Edit마다 token-budget-guard 발화 → 75%/90% 경고 자동 출력

**보존된 retired/**: 35개 (활성화 안 한 기타 메타·UI 검증·외부 도구)

**즉시 사용 가능 상태** — 다음 사이클(progress.json 초기화 + step001 재실행)에서 P0/P1 환경(npm init·src) 충족 시 정상 가동.

**핵심 영구 기록**: [session-cumulative-correction-2026-05-18.md](../reports/session-cumulative-correction-2026-05-18.md)

## ★★★ 최신 squeeze (006) — 본 세션 누적 가정 정정 (2026-05-18)

본 squeeze는 `PROMPT_research-impl-validator-hooks-8.deepresearch.txt` 의뢰 응답 처리 중 **`.claude/hooks/retired/` 폴더에 38개 hook 존재 발견** — 본 세션 5회 squeeze + 4회 propose-research 누적 가정(`hook 부재`)이 부분 오류였음.

**핵심 정정**:
- ❌ "step001~014 11개 hook 부재" → retired/에 playwright/axe-core/c8/jscpd/semgrep/knip/tokei/lhci/stylelint/biome/madge-validator 모두 존재
- ❌ "step015~069 8개 hook 부재" → retired/에 research/dependency-checker/html-bundler/refactoring/formatting/linting/type-safety-validator 존재
- ❌ "P1 hook 19개 신설 필요" → retired/ 재활성화만으로 다수 해결 가능

**영향 평가**:
- propose-002 PROMPT 3건 의뢰 가치 LOW로 재평가
- squeeze-002/005 영향 재평가 필요
- step107 최종 보고서 P0/P1 표 부분 오류

**사용자 결정 U_critical**: retired/ 처리 옵션 A(직접 재활성화) / B(보고서 의사코드 재작성) / C(하이브리드). 권장: C.

## 최신 squeeze (005) 결과 (2026-05-18 세션 #6)

본 squeeze는 `PROMPT_env-bootstrap-checklist.deepresearch.txt` 의뢰 응답 처리. ACCEPT 6 / REJECT 2 / DEFER 5.

**핵심 발견**:
- 분석 에이전트가 보고서의 ConvertTo-Json Depth=2 단정을 MS Learn 미언급 추론으로 자체 식별 (R1 REJECT)
- 판정 에이전트가 squeeze-004 BLOCKER U1 의존 후보 5건 자체 식별 → DEFER
- 본 사이클 본문화 0 — 모두 신규 hook 신설 필요 (다음 사이클 진입 전)
- C1·C2·C3·C10 PowerShell 기술 사실 의사코드 영속화
- C4 15개 검증 항목 매트릭스 영속화

**다음 권장**: squeeze-004 BLOCKER 해소(PROMPT_sessionstart-context-injection 의뢰) → squeeze-005 DEFER 5건 재평가

## 최신 squeeze (004) 결과 (2026-05-18 세션 #6)

본 squeeze는 `PROMPT_hot-cache-automation.deepresearch.txt` 의뢰 응답 처리. ACCEPT 8 / REJECT 1 / DEFER 4.

**핵심 발견**:
- 분석 에이전트가 보고서 §4.1 SessionStart `hookSpecificOutput.additionalContext` 사양을 **공식 문서 미검증**으로 자체 식별
- → C6 자동 로더 hook REJECT (가짜 인용 답습 차단)
- → 자동 작성 hook (Stop 측)만 다음 사이클 가이드로 영속화
- **U1 사용자 결정 BLOCKER**: SessionStart 컨텍스트 주입 사양 공식 재검증 필요

**대안**: CLAUDE.md `@step_archive/wiki/hot.md` import 디렉티브 (자동 로더 우회)

## squeeze (003) 결과 (2026-05-18 세션 #6)

본 squeeze는 `PROMPT_eval-gate-spec-trigger.deepresearch.txt` 의뢰 응답 처리. ACCEPT 4 / 조건부 2 / REJECT 2 / 기각 1. **모든 ACCEPT가 NEXT_CYCLE_ONLY** — step001~107 1회 사이클 종료 직후라 현 사이클 영향 0. 다음 재실행 사이클 진입 전 spec-generator.ps1 + trust5-validator.ps1 패치 권장.

**보고서 영구 정정 기록**:
- "Stop 훅 120초 타임아웃" → 공식 600초
- "9개 SPEC" → 실제 12개
- "32/40 기준" → 실제 40/50

## squeeze (002) 결과 (2026-05-18 세션 #6)

본 squeeze는 본 프로젝트가 직접 작성한 `PROMPT_frontmatter-bulk-strategy.deepresearch.txt` 의뢰 응답을 처리. ACCEPT 7 / REJECT 3 / DEFER 3 / 사용자 결정 3.

**핵심 영속화**:
- 외부 URL 검증 3/3 PASS (code.claude.com hooks, Dataview API, Obsidian 공식)
- 4가지 전략 비교 (A REJECT / B 차순위 / C 차순위 / D DEFER 사용자 동의 대기)
- 자동 추론 가능 키 (next, mx_tag_count) 정책 영속화
- 자동 추론 불가 키 (depends_on, phase, trust5_status) 보일러플레이트 패턴 영속화

**107개 파일 일괄 처리는 본문화하지 않음** — U1 사용자 동의 + 프로토타입 검증 필수.

## 직전(001) squeeze 진행 상태 (2026-05-17 23:25)

### Step 진행
- **progress.json**: current_step=1, completed_steps=[] (초기화 상태)
- **git 실측**: step031-107까지 통합 검증 + EVAL r3 PASS (commit 0606af41)
- **불일치 인지**: 진행파일은 비어있으나 코드는 완료됨. 사용자 의도(재실행 vs 동기화) 미확정.

### 이번 세션(#4)에서 한 일
1. **Obsidian Vault 결합** — `step_archive/`를 Vault로 등록(harness0517000000), 코어 17개 + 커뮤니티 4개(Dataview, Templater, Git, Tag Wrangler) 활성. 폰트 Helvetica Neue / JetBrains Mono(AI Slop 룰셋 준수).
2. **graph.json 색상 분류** — 도구(회색) / 평가 게이트(빨강) / SPEC(파랑) 3색.
3. **INDEX.md 신설** — 빠른 이동, 평가 게이트표, Dataview 쿼리 예제 포함.
4. **/squeeze-report 처리** — Harness.io 보고서 정독 → 분석/판정 분리 → 메타 패턴만 본 프로젝트에 이식.

### 보고서 적용 결과 (squeeze 결과)
| 후보 | 판정 | 결과 |
|:---|:---|:---|
| C1 3계층 폴더 | ACCEPT | `wiki/`, `reports/`, `done/`, `decisions/` 4개 폴더 생성 + 본 hot.md |
| C4 5대 섹션 정합성 | ACCEPT | CLAUDE.md는 이미 5섹션 포함. patterns 문서로 보완 |
| C6 CLI 명령어 가이드 | ACCEPT | `wiki/claude-commands-reference.md` 신설 |
| C2, C3, C8, C9, C11 | DEFER | step 평가 게이트 완료 후 재평가 |
| C5, C7, C10 | REJECT | 도메인 불일치(Harness.io) 또는 가상 스킬(claude-canvas) |

## 직전 활성 작업 영역

- `step_archive/.obsidian/` — Vault 설정 완료
- `step_archive/INDEX.md` — 진입점 (Dataview 쿼리 시범)
- `step_archive/wiki/` — **이 폴더** (hot.md, claude-commands-reference.md)
- `step_archive/reports/` — squeeze 분석 결과 영속화 예정
- `step_archive/squeeze_analysis.yaml`, `squeeze_verdicts.yaml` — 본 squeeze 처리 산출물

## 즉시 다음 작업 후보 (DEFER 해제 우선순위, 2026-05-18 갱신)

1. **squeeze-002 U1 결정** — 전략 D 프로토타입 동의 시 step001~010 PowerShell 스크립트 작성 → 실측 → 107개 본격 적용
2. **squeeze-002 U2** — 현재 git status D/M 다수 파일 정리 (feature 브랜치 권장)
3. **squeeze-002 U3** — Dataview 시각화 필수성 결정 → C8/C11 활성화 여부
4. **PROMPT_hot-cache-automation 딥리서치 의뢰** — Hot Cache 자동 갱신 hook 설계 (사용자 의뢰 → 보고서 → squeeze-003)
5. **PROMPT_eval-gate-spec-trigger 딥리서치 의뢰** — SPEC 049/069/104 누락 진단

## 영구 금지 사항 (재발견 차단)

- ❌ Harness.io CI/CD YAML 작성 — 도메인 무관
- ❌ claude-canvas 스킬 호출 — 실존하지 않음
- ❌ `.claude/` 디렉토리에 파일 생성 — CLAUDE.md 절대 규칙

## 부록: 본 캐시 갱신 규약

세션 종료 시 또는 큰 마일스톤(Step 평가 게이트 통과) 시 다음 정보를 갱신한다:
- 진행 상태 (current_step, 완료/실패 step)
- 이번 세션에서 한 일 (3~5줄)
- 직전 활성 작업 영역 (파일 경로)
- 다음 작업 후보

수동 갱신 트리거: 사용자가 "hot cache 갱신" 또는 `/save` 입력 시.
