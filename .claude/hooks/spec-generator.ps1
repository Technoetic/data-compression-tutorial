# spec-generator.ps1 - Step별 SPEC-XXX.md 자동 생성 (Stop hook)
#
# MoAI-ADK Plan→Run→Sync 벤치마킹: 각 Step 시작 시 SPEC 자동 생성.
# 주의: 본 구현이 생성하는 SPEC은 MoAI 정식 EARS("When [trigger], [system] shall [response]"
#       키워드 패턴) 가 아니며, WHAT/WHY/WHEN/ACCEPTANCE/REFERENCE 헤더의 단순화 SPEC 템플릿이다.
# Step의 머리말(### Step-Back) + 첫 본문 H2를 추출해 step_archive/specs/SPEC-NNN.md 생성.
#
# 트리거: 매 Stop 이벤트, current_step 진입 시 specs/SPEC-{current_step}.md 미존재 → 생성.

param()

$ErrorActionPreference = "Continue"
$logFile = Join-Path $PSScriptRoot "spec-generator.log"
function Write-SpecLog($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    try { Add-Content -Path $logFile -Value "[$ts] $msg" -Encoding UTF8 } catch {}
}

$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$progressFile = Join-Path $projectRoot "step_archive\progress.json"
$specDir = Join-Path $projectRoot "step_archive\specs"

if (-not (Test-Path $progressFile)) { exit 0 }
if (-not (Test-Path $specDir)) { New-Item -ItemType Directory -Path $specDir -Force | Out-Null }

try {
    $progress = Get-Content $progressFile -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Write-SpecLog "progress.json read FAILED: $_"
    exit 0
}

$currentStep = [int]$progress.current_step
if ($currentStep -lt 1 -or $currentStep -gt [int]$progress.total_steps) { exit 0 }

$stepNum = "{0:D3}" -f $currentStep
$specFile = Join-Path $specDir "SPEC-$stepNum.md"
if (Test-Path $specFile) {
    Write-SpecLog "SPEC-$stepNum already exists -> skip"
    exit 0
}

$stepFile = Join-Path $projectRoot "step_archive\archived\step$stepNum.md"
if (-not (Test-Path $stepFile)) {
    Write-SpecLog "step$stepNum.md not found"
    exit 0
}

# Step 본문에서 핵심 추출
$stepBody = Get-Content $stepFile -Raw -Encoding UTF8
$titleMatch = [regex]::Match($stepBody, '(?m)^#\s+(.+)$')
$title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value.Trim() } else { "Step $currentStep" }

# 첫 본문 H2 ~ 두 번째 H2 사이 = 핵심 설명
$sectionMatch = [regex]::Match($stepBody, '(?ms)^##\s+(?:실행 내용|개요|목적|Step-Back|검증).+?(?=^##\s+|^---|\z)')
$body = if ($sectionMatch.Success) {
    ($sectionMatch.Value -split "`n" | Select-Object -First 30) -join "`n"
} else {
    "본문 추출 실패. step$stepNum.md 직접 참조."
}

# EARS 형식 SPEC 생성 (백틱은 here-string에서 escape 문자이므로 변수로 주입)
$fence = [char]0x60 + [char]0x60 + [char]0x60  # ``` 3개
$prevStepStr = "{0:D3}" -f ($currentStep - 1)
$spec = @"
# SPEC-$stepNum — $title

자동 생성: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
원본: step_archive/archived/step$stepNum.md

---

## WHAT (무엇을 만드는가)

$title

## WHY (왜 필요한가)

step$stepNum 의 본문 추출 — 다음 Step 진행에 필요한 결과물을 산출하기 위함.

## WHEN (전제 조건)

- 이전 Step ($prevStepStr) 완료
- progress.json.current_step == $currentStep

## ACCEPTANCE (수락 기준)

- 해당 Step의 자체 Self-Calibration 통과
- 결과 파일 step_archive/step${stepNum}_*.md 생성
- 평가 라운드 Step (49/69/104) 도달 시 TRUST 5 게이트 통과

## REFERENCE (원본 본문 발췌)

$fence
$body
$fence

## RUN-COMMAND

Read step_archive/archived/step$stepNum.md → 본문 실행
"@

$spec | Out-File -FilePath $specFile -Encoding UTF8 -Force
# BOM 제거
$bytes = [System.IO.File]::ReadAllBytes($specFile)
if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    [System.IO.File]::WriteAllBytes($specFile, $bytes[3..($bytes.Length - 1)])
}

Write-SpecLog "SPEC-$stepNum generated"
exit 0
