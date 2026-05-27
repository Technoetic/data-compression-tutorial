# brainstorming-gate.ps1 - superpowers:brainstorming 강제 발동 게이트
# PreToolUse 훅: Step 030 진입 시 Skill(brainstorming) 호출 전까지 다른 도구 차단
param()

# B-P2-20 fix (revised): stdin parse 실패는 fail-open (가용성 우선).
# brainstorming-gate는 enforcedSteps에서만 활성화되므로, 그 외 step에서 stdin 노이즈로 차단하면 손해가 큼.
$ErrorActionPreference = "Continue"
$projectRoot  = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$stepArchive  = Join-Path $projectRoot "step_archive"
$progressFile = Join-Path $stepArchive  "progress.json"
$logFile      = Join-Path $PSScriptRoot "brainstorming-gate.log"
function Write-BSGateLog($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    try { Add-Content -Path $logFile -Value "[$ts] $msg" -Encoding UTF8 } catch {}
}

# 브레인스토밍 강제 대상 Step
$enforcedSteps = @(30)

# 현재 Step 번호 파악
if (-not (Test-Path $progressFile)) { exit 0 }

try {
    $progress = Get-Content $progressFile -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Write-BSGateLog "progress.json parse FAILED: $_ -> exit 0 (fail-open is safe here: no current_step means gate inactive)"
    exit 0
}

$currentStep = [int]$progress.current_step
if ($enforcedSteps -notcontains $currentStep) { exit 0 }

# 이미 brainstorming이 발동된 Step인지 플래그 확인
$flagFile = Join-Path $stepArchive (".brainstorming-fired-{0:D3}" -f $currentStep)
if (Test-Path $flagFile) { exit 0 }

# stdin에서 이벤트 JSON 읽기 (UTF-8 명시) — fail-open
$inputJson = $null
try {
    $stdinStream = [System.IO.StreamReader]::new([Console]::OpenStandardInput(), [System.Text.Encoding]::UTF8)
    $raw = $stdinStream.ReadToEnd()
    $stdinStream.Close()
    if ($raw) { $inputJson = $raw | ConvertFrom-Json }
} catch {
    Write-BSGateLog "stdin parse FAILED on enforced step $currentStep (fail-open): $_"
    exit 0
}

if ($null -eq $inputJson) { exit 0 }

$toolName  = $inputJson.tool_name
$toolInput = $inputJson.tool_input

# Skill 도구로 superpowers:brainstorming을 호출하는 경우 → 플래그 생성 후 통과
if ($toolName -eq "Skill") {
    $skillName = $toolInput.skill
    if ($skillName -match "brainstorming") {
        New-Item -ItemType File -Path $flagFile -Force | Out-Null
        Write-Host "BRAINSTORMING GATE: superpowers:brainstorming fired for step $currentStep"
        exit 0
    }
}

# 그 외 모든 도구 호출 → 차단
$msg = @"
BRAINSTORMING GATE BLOCKED: Step $currentStep requires superpowers:brainstorming first.

You MUST invoke the Skill tool before any other tool:

  Skill(skill="superpowers:brainstorming")

Blocked tool: $toolName
Flag file (auto-created after skill fires): $flagFile
"@

Write-Host $msg
exit 2
