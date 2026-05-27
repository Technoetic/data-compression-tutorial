# task-metrics.ps1 - Step별 task 메트릭 수집 (Stop hook)
#
# MoAI-ADK task-metrics.jsonl 벤치마킹.
# Step별 토큰/시간/재시도 정량화하여 향후 분석 가능.
#
# 출력: step_archive/task-metrics.jsonl (JSONL, 한 줄 = 한 Step 메트릭)

param()

$ErrorActionPreference = "Continue"
$logFile = Join-Path $PSScriptRoot "task-metrics.log"
function Write-TmLog($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    try { Add-Content -Path $logFile -Value "[$ts] $msg" -Encoding UTF8 } catch {}
}

$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$progressFile = Join-Path $projectRoot "step_archive\progress.json"
$metricsFile = Join-Path $projectRoot "step_archive\task-metrics.jsonl"

if (-not (Test-Path $progressFile)) { exit 0 }

# stdin
$inputJson = $null
try {
    $stdinStream = [System.IO.StreamReader]::new([Console]::OpenStandardInput(), [System.Text.Encoding]::UTF8)
    $raw = $stdinStream.ReadToEnd()
    $stdinStream.Close()
    if ($raw) { $inputJson = $raw | ConvertFrom-Json }
} catch {}

try {
    $progress = Get-Content $progressFile -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Write-TmLog "progress.json read FAILED: $_"
    exit 0
}

$currentStep = [int]$progress.current_step
$completedCount = @($progress.completed_steps).Count

# transcript 토큰 길이 근사 (단어 4글자/토큰)
$transcriptTokens = 0
$assistantMsgCount = 0
$toolCallCount = 0
if ($inputJson -and $inputJson.transcript_path -and (Test-Path $inputJson.transcript_path)) {
    try {
        $lines = Get-Content $inputJson.transcript_path -Encoding UTF8
        foreach ($line in $lines) {
            if (-not $line) { continue }
            try {
                $entry = $line | ConvertFrom-Json
                if ($entry.type -eq 'assistant') {
                    $assistantMsgCount++
                    if ($entry.message.content) {
                        foreach ($block in $entry.message.content) {
                            if ($block.type -eq 'text' -and $block.text) {
                                $transcriptTokens += [int]($block.text.Length / 4)
                            } elseif ($block.type -eq 'tool_use') {
                                $toolCallCount++
                            }
                        }
                    }
                }
            } catch {}
        }
    } catch {}
}

# step result 파일 크기 합산
$stepArchive = Join-Path $projectRoot "step_archive"
$resultFiles = @()
try {
    $resultFiles = Get-ChildItem -Path $stepArchive -Filter "step*_*.md" -ErrorAction SilentlyContinue
} catch {}
$resultBytes = 0
foreach ($f in $resultFiles) { $resultBytes += $f.Length }

# JSONL 한 줄 생성
$metric = [PSCustomObject]@{
    timestamp = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')
    current_step = $currentStep
    completed_count = $completedCount
    transcript_tokens_approx = $transcriptTokens
    assistant_msg_count = $assistantMsgCount
    tool_call_count = $toolCallCount
    step_result_files = $resultFiles.Count
    step_result_total_bytes = $resultBytes
}

try {
    $jsonLine = $metric | ConvertTo-Json -Compress -Depth 5
    Add-Content -Path $metricsFile -Value $jsonLine -Encoding UTF8
    Write-TmLog "metric appended: step=$currentStep tokens=$transcriptTokens tools=$toolCallCount"
} catch {
    Write-TmLog "metric append FAILED: $_"
}

exit 0
