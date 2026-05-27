---
step: 002
chunk: 2
type: context-strategy
generated: 2026-05-26
---

# Step 002 — Context 최적화 전략 (chunk 2: 파일 읽기·토큰 예산)

## 5. 파일 읽기 전략

- 500줄 이상 파일: Grep + offset/limit만 사용. 전체 읽기 금지.
- 동일 파일 재읽기 금지 → 기억 의존.
- step_archive/screenshots/는 평가/디버깅 시에만 Read.
- node_modules/ 진입 금지 (Glob 패턴 제외).

## 6. 청크 분할 임계점

- 모든 산출물 문서 500줄 이하.
- 조사·구현·평가 결과는 청크 단위로 저장 (`stepNNN_<주제>_chunkM.md`).
- `.claude/hooks/research-validator.ps1`가 BOM/CRLF/줄수/파일크기 검증.

## 7. 토큰 예산 가드레일

- 메인 에이전트 컨텍스트 90% 도달 시 → 남은 작업 서브에이전트 위임.
- Bash output 5만 토큰/턴 초과 우려 시 즉시 `| head -N` / `grep` 필터.
- 서브에이전트 결과는 1~2줄 receipt만 수용(memory: feedback_step_harness_chunking.md).

## 8. 응답 길이 정책

- Step 완료 보고: 1줄 ("Step NNN/107 완료").
- 사용자 질문/확인 금지 (HARNESS-규칙 1·3).
- 자기 종료 멘트 금지 ("이번 턴 한도" 등).

## 9. 핵심 원칙 요약 (이후 모든 Step 상속)

1. 500줄 이상 전체 읽기 금지 → Grep/offset/limit
2. 같은 파일 재읽기 금지 → 기억 의존
3. 동시 서브에이전트 ≤10
4. 조사 → 종합 → 구현 (병렬 금지: 의존성 단계)
5. .claude/ 외 산출물 모두 step_archive/ 저장

## 10. CoVe 체크

- [x] 규모 파악(SMALL <100) → 서브에이전트 5~10개
- [x] 단원별 분할(RLE/허프만/LZ77/Base64)
- [x] 청크 임계점(500줄) 명시
- [x] 의존성 순서 확정
- [x] 토큰 가드레일 명시

미완료 항목 없음.
