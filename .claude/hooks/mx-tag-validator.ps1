# mx-tag-validator.ps1 - @MX 태그 시스템 검증 (PostToolUse: Write/Edit)
#
# MoAI-ADK mx-tag-protocol SoT 준수 (출처: MoAI/.claude/rules/moai/workflow/mx-tag-protocol.md):
# 정식 4종 태그로 코드 레벨 컨텍스트를 AI에게 전달.
#
# 검증 대상 확장자: .js .jsx .ts .tsx .mjs .cjs .html .css .py .go .rs
# 검증 시기: 구현 Step(step015 이후) 생성 코드에 한해 권고. 미준수 시 경고만 출력 (fail-open).
#
# @MX 태그 정식 규격 (MoAI 표준):
#   // @MX:NOTE   - 컨텍스트·의도 전달 (매직 상수, 비즈니스 규칙 등)
#   // @MX:WARN   - 위험 영역 (@MX:REASON 필수)
#   // @MX:ANCHOR - 불변 계약 (fan_in >= 3 등, @MX:REASON 필수)
#   // @MX:TODO   - 미완료 작업
#
# 정책: 파일당 최소 @MX:NOTE 1개 권장. WARN/ANCHOR/TODO는 조건부 (위험/계약/미완료 시).

param()

$ErrorActionPreference = "Continue"
$logFile = Join-Path $PSScriptRoot "mx-tag-validator.log"
function Write-MxLog($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    try { Add-Content -Path $logFile -Value "[$ts] $msg" -Encoding UTF8 } catch {}
}

# stdin 이벤트 JSON
$inputJson = $null
try {
    $stdinStream = [System.IO.StreamReader]::new([Console]::OpenStandardInput(), [System.Text.Encoding]::UTF8)
    $raw = $stdinStream.ReadToEnd()
    $stdinStream.Close()
    if ($raw) { $inputJson = $raw | ConvertFrom-Json }
} catch {
    Write-MxLog "stdin parse FAILED (fail-open): $_"
    exit 0
}

if ($null -eq $inputJson) { exit 0 }

# 대상 파일 추출
$filePath = $null
try {
    if ($inputJson.tool_input.file_path) { $filePath = $inputJson.tool_input.file_path }
    elseif ($inputJson.tool_input.path)  { $filePath = $inputJson.tool_input.path }
} catch {}
if (-not $filePath) { exit 0 }

# 검증 대상 확장자 필터
$targetExts = @('.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.html', '.css', '.py', '.go', '.rs')
$ext = [System.IO.Path]::GetExtension($filePath).ToLower()
if ($targetExts -notcontains $ext) { exit 0 }

# Step 015 이후 구현 단계에서만 검증 (이전은 도구 설치/조사 Step)
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$progressFile = Join-Path $projectRoot "step_archive\progress.json"
if (-not (Test-Path $progressFile)) { exit 0 }

try {
    $progress = Get-Content $progressFile -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Write-MxLog "progress.json read FAILED: $_"
    exit 0
}

$currentStep = [int]$progress.current_step
if ($currentStep -lt 15) {
    # 구현 Step 진입 전 — @MX 태그 미요구
    exit 0
}

# step_archive/, .claude/, node_modules/ 등 제외
if ($filePath -match '\\(step_archive|\.claude|node_modules|\.git)\\') {
    exit 0
}

# 파일 내용 점검
if (-not (Test-Path $filePath)) { exit 0 }
$content = ""
try { $content = Get-Content $filePath -Raw -Encoding UTF8 } catch {
    Write-MxLog "file read FAILED: $filePath"
    exit 0
}

$hasNote   = $content -match '@MX:NOTE'
$hasWarn   = $content -match '@MX:WARN'
$hasAnchor = $content -match '@MX:ANCHOR'
$hasTodo   = $content -match '@MX:TODO'

# 정책: @MX:NOTE 1개 이상 최소 권장 (WARN/ANCHOR/TODO는 조건부)
if ($hasNote -or $hasWarn -or $hasAnchor -or $hasTodo) {
    $tags = @()
    if ($hasNote)   { $tags += 'NOTE' }
    if ($hasWarn)   { $tags += 'WARN' }
    if ($hasAnchor) { $tags += 'ANCHOR' }
    if ($hasTodo)   { $tags += 'TODO' }
    Write-MxLog "OK [step=$currentStep] $filePath has @MX tags: $($tags -join ',')"
    exit 0
}

# @MX:WARN/@MX:ANCHOR 사용 시 @MX:REASON 동반 의무
if (($hasWarn -or $hasAnchor) -and -not ($content -match '@MX:REASON')) {
    $missingReason = "[@MX-WARN] $filePath has WARN/ANCHOR but missing @MX:REASON sub-line"
    Write-MxLog $missingReason
    [Console]::Error.WriteLine($missingReason)
}

# 경고 출력 (fail-open: exit 0)
$warn = "[@MX-WARN] $filePath has no @MX tags (NOTE/WARN/ANCHOR/TODO)"
Write-MxLog $warn
[Console]::Error.WriteLine($warn)
[Console]::Error.WriteLine("Add at top of file (MoAI mx-tag-protocol SoT):")
[Console]::Error.WriteLine("  // @MX:NOTE: <컨텍스트·의도 — 매직 상수, 비즈니스 규칙>")
[Console]::Error.WriteLine("  // @MX:WARN: <위험 영역>  (requires @MX:REASON)")
[Console]::Error.WriteLine("  // @MX:ANCHOR: <불변 계약, fan_in >= 3>  (requires @MX:REASON)")
[Console]::Error.WriteLine("  // @MX:TODO: <미완료 작업>")
exit 0
