# step-auto-continue.ps1 - Step 미완료 시 Stop을 차단하고 자동 재개 (Stop 훅)
#
# 전략 (공식 스펙 기준, docs.claude.com/en/docs/claude-code/hooks):
#   - JSON decision="block" + exit 0: Claude가 대화를 계속한다 (정식 메커니즘)
#   - 폴백으로 exit 2 + stderr도 함께 작동 (이중 보장)
#   - stop_hook_active=true 시 즉시 exit 0 (무한 루프 방지 - 공식 권장)
#   - 모든 실행을 로그로 기록해 진단 가능하게 함

param()

$ErrorActionPreference = "Continue"
$logFile = Join-Path $PSScriptRoot "step-auto-continue.log"
# 진짜 Stop 이벤트 추적용 별도 파일 (로그 잠금 문제와 무관하게 기록)
try {
    $beaconFile = Join-Path $PSScriptRoot "step-auto-continue.beacon"
    "$(Get-Date -Format 'HH:mm:ss') invoked pid=$PID" | Out-File -FilePath $beaconFile -Append -Encoding UTF8
} catch {}

function Write-HookLog($msg) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "[$timestamp] $msg" -Encoding UTF8
}

Write-HookLog "=== invoked ==="

# stdin JSON 파싱
$inputJson = $null
$rawInput = ""
try {
    # UTF-8 명시 read (PS 5.1 default 코드페이지로 한글 mojibake 방지)
    $stdinStream = [System.IO.StreamReader]::new([Console]::OpenStandardInput(), [System.Text.Encoding]::UTF8)
    $rawInput = $stdinStream.ReadToEnd()
    $stdinStream.Close()
    if ($rawInput) {
        $inputJson = $rawInput | ConvertFrom-Json
        Write-HookLog "stdin parsed: stop_hook_active=$($inputJson.stop_hook_active) has_last_msg=$([bool]$inputJson.last_assistant_message)"
    } else {
        Write-HookLog "stdin EMPTY"
    }
} catch {
    Write-HookLog "stdin parse FAILED: $_"
}

$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$progressFile = Join-Path $projectRoot "step_archive\progress.json"

if (-not (Test-Path $progressFile)) {
    Write-HookLog "progress.json missing -> exit 0"
    exit 0
}

try {
    $progress = Get-Content $progressFile -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Write-HookLog "progress.json parse FAILED: $_ -> exit 0"
    exit 0
}

# NOTE: writer-merge 블록 제거됨 (B-P2-1 fix).
# step-progress-writer.ps1이 progress.json의 단일 writer다.
# 이 hook은 read-only로만 progress를 사용한다.

$total = [int]$progress.total_steps
$current = [int]$progress.current_step
$completedCount = @($progress.completed_steps).Count

# 모든 Step 완료 -> 정상 종료 허용 (진짜 종료 조건)
if ($completedCount -ge $total -or $current -gt $total) {
    Write-HookLog "all $total steps completed ($completedCount/$total, current=$current) -> exit 0 (DONE)"
    exit 0
}

# stop_hook_active=true는 "직전 Stop 훅이 block해서 새 턴이 시작된 뒤 그 턴이 끝났다"는 뜻.
# 이 경우에도 Step이 미완료이면 계속 block해야 한다 (Claude Code 공식 동작).
# 진짜 무한 루프 방지는: progress.json이 진행되지 않으면 추가로 블록 안 함.
$stateFile = Join-Path $PSScriptRoot "step-auto-continue.state"
$prevState = ""
if (Test-Path $stateFile) {
    try { $prevState = (Get-Content $stateFile -Raw -Encoding UTF8).Trim() } catch {}
}
$currState = "completed=$completedCount;current=$current"

if ($inputJson -and $inputJson.stop_hook_active -eq $true -and $prevState -eq $currState) {
    # 진행이 멈춘 상태 + stop_hook_active=true 동시 만족 -> 진짜 진전 없음, 포기
    Write-HookLog "stop_hook_active=true AND no progress since last block ($currState) -> exit 0 (release)"
    Set-Content -Path $stateFile -Value $currState -Encoding UTF8
    exit 0
}

Set-Content -Path $stateFile -Value $currState -Encoding UTF8

# 마지막 assistant 메시지에서 "질문/확인 대기 패턴" 감지
$lastMsg = ""
if ($inputJson -and $inputJson.last_assistant_message) {
    $lastMsg = [string]$inputJson.last_assistant_message
}

$questionPatterns = @(
    '\?\s*$',
    '할까요',
    '하시겠',
    '선택해\s*주',
    '알려\s*주',
    '옵션\s*[0-9①-⑩]',
    '어느\s*방향',
    '어떻게\s*할',
    '진행할지',
    '확인\s*부탁',
    '어떤\s*것',
    '원하시',
    '먼저\s*.+\s*할까',
    'Would you like',
    'Should I',
    'Let me know',
    'Please confirm',
    'Please choose',
    'Do you want',
    # 턴 종료 예고/마감 인사 패턴 (이것이 자연 종료를 유발함 — 진짜 원인)
    '다음\s*턴에서',
    '다음\s*턴에',
    '자동\s*재개',
    '자연스러운\s*종료',
    '종료점',
    '이번\s*턴은\s*여기',
    '이번\s*턴\s*마무리',
    '이번\s*턴\s*(요약|정리|성과|누적)',
    '컨텍스트\s*(여유|압박|한계)',
    'Stop\s*훅이',
    '재개할\s*것',
    '재개합니다',
    # 자기 제한 문구 — 의미 없는 인위적 중단 유발
    '한\s*턴\s*한도',
    '한도\s*도달',
    '한도에\s*근접',
    '(3\s*[-~]\s*5|3~5)\s*Step\s*(한도|제한|도달)',
    '종료합니다\s*$',
    '종료합니다\.$',
    '한\s*턴\s*규칙',
    '턴\s*한계'
)

$hasQuestion = $false
foreach ($p in $questionPatterns) {
    if ($lastMsg -match $p) {
        $hasQuestion = $true
        Write-HookLog "QUESTION PATTERN matched: $p"
        break
    }
}

$nextStep = $current
$nextStepStr = "{0:D3}" -f $nextStep
$totalStr = "{0:D3}" -f $total
$stepFile = "step_archive/step$nextStepStr.md"

if ($hasQuestion) {
    $reason = @"
[STEP HARNESS AUTO-RESUME - VIOLATION DETECTED]

CLAUDE.md RULE VIOLATION: Your last message contained a user-facing question or confirmation request.
This breaks the mandatory auto-execution contract (Step 001~$totalStr must run without user confirmation).

RULE: Never ask the user to choose, confirm, approve, or redirect.
      If you hit a fatal error, log it in the step result file and move on.
      Only stop after Step $total completes.

Progress: $completedCount/$total completed.
Next step (MUST execute immediately, no questions): step$nextStepStr ($stepFile)

DO:
1. Read $stepFile.
2. Execute its instructions.
3. Report "Step $nextStepStr/$total 완료".
4. Move to step$('{0:D3}' -f ($nextStep + 1)) without confirmation.

DO NOT:
- Ask "진행할까요?" / "계속할까요?" / "어떻게 할까요?" / anything similar.
- Offer options or alternatives to the user.
- Pause for approval.
- End turn with "다음 턴에서 자동 재개합니다" or similar - just proceed inline.

Resume Step $nextStepStr NOW.
"@
} else {
    # MoAI-ADK 벤치마킹: SPEC 존재 시 Plan→Run→Sync 안내 포함
    $specPath = "step_archive/specs/SPEC-$nextStepStr.md"
    $specHint = ""
    $specFullPath = Join-Path $projectRoot "step_archive\specs\SPEC-$nextStepStr.md"
    if (Test-Path $specFullPath) {
        $specHint = "`n📐 Plan: Read $specPath first to confirm Acceptance criteria."
    }
    $mxHint = ""
    if ($nextStep -ge 15) {
        $mxHint = "`n🔖 @MX tags required on all new sources (Step 015+)."
    }
    $reason = @"
[STEP HARNESS AUTO-RESUME]
Progress: $completedCount/$total completed.
Next step to execute: step$nextStepStr ($stepFile)$specHint$mxHint

CLAUDE.md MANDATORY RULE:
1. Read $stepFile (Read tool, single file).
2. Execute its instructions immediately.
3. On completion, report "Step $nextStepStr/$total 완료" then auto-advance.
4. Continue without user confirmation through step$totalStr.

Never ask the user questions. Only stop after Step $total completes.
Do NOT end a turn with "다음 턴에서 자동 재개" - keep executing in the current turn until you run out of immediate work, then let the Stop hook decide.
Begin step$nextStepStr NOW unless the user explicitly redirected.
"@
}

# B-P2-2 fix: 공식 스펙은 단일 채널만 허용.
# stdout JSON + exit 0 (decision=block) 방식으로 통일한다.
# 이중 출력은 Claude Code가 exit 0을 "no block"으로 해석할 위험을 만든다.
$jsonOut = @{
    decision = "block"
    reason   = $reason
} | ConvertTo-Json -Compress -Depth 3

Write-HookLog "emitting decision=block for step$nextStepStr (question=$hasQuestion)"

[Console]::Out.WriteLine($jsonOut)
exit 0
