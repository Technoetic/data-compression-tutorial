# session-start.ps1 - 세션 시작 시 프로젝트 규모 자동 출력
param()

$ErrorActionPreference = "Continue"
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$logFile = Join-Path $PSScriptRoot "session-start.log"

function Write-Log($msg) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "[$timestamp] $msg" | Tee-Object -FilePath $logFile -Append
}

Write-Log "=== Session Start ==="
Write-Log "Project root: $projectRoot"

# 프로젝트 규모 파악
$srcDir = Join-Path $projectRoot "src"
if (Test-Path $srcDir) {
    $fileCount = (Get-ChildItem -Path $srcDir -Recurse -File | Measure-Object).Count
    $jsFiles = (Get-ChildItem -Path $srcDir -Recurse -File -Filter "*.js" | Measure-Object).Count
    $cssFiles = (Get-ChildItem -Path $srcDir -Recurse -File -Filter "*.css" | Measure-Object).Count
    $htmlFiles = (Get-ChildItem -Path $srcDir -Recurse -File -Filter "*.html" | Measure-Object).Count
    
    Write-Log "=== Project Scale ==="
    Write-Log "Total files in src/: $fileCount"
    Write-Log "  JS files: $jsFiles"
    Write-Log "  CSS files: $cssFiles"
    Write-Log "  HTML files: $htmlFiles"
} else {
    Write-Log "src/ directory not found - new project"
    $fileCount = 0
}

# 서브에이전트 전략 제안
if ($fileCount -ge 1000) {
    Write-Log "Scale: LARGE (1000+ files) -> 20+ subagents recommended"
} elseif ($fileCount -ge 100) {
    Write-Log "Scale: MEDIUM (100-1000 files) -> 10-20 subagents recommended"
} else {
    Write-Log "Scale: SMALL (<100 files) -> 5-10 subagents recommended"
}

# package.json 확인
$pkgJson = Join-Path $projectRoot "package.json"
if (Test-Path $pkgJson) {
    Write-Log "=== Dependencies ==="
    $pkg = Get-Content $pkgJson -Raw | ConvertFrom-Json
    if ($pkg.dependencies) {
        Write-Log "Dependencies: $($pkg.dependencies.PSObject.Properties.Name -join ', ')"
    }
    if ($pkg.devDependencies) {
        Write-Log "DevDependencies: $($pkg.devDependencies.PSObject.Properties.Name -join ', ')"
    }
}

# tokei가 있으면 실행
$tokeiPath = Get-Command tokei -ErrorAction SilentlyContinue
if ($tokeiPath -and (Test-Path $srcDir)) {
    Write-Log "=== tokei Code Stats ==="
    $tokeiOutput = & tokei $srcDir 2>&1
    Write-Log ($tokeiOutput | Out-String)
}

# MoAI-ADK 벤치마킹: 누적 컨텍스트 표시 (specs/outputs/metrics)
$stepArchive = Join-Path $projectRoot "step_archive"
$specDir   = Join-Path $stepArchive "specs"
$outDir    = Join-Path $stepArchive "outputs"
$metrics   = Join-Path $stepArchive "task-metrics.jsonl"

Write-Log "=== MoAI Context (누적 컨텍스트) ==="
if (Test-Path $specDir) {
    $specCount = (Get-ChildItem -Path $specDir -Filter "SPEC-*.md" -ErrorAction SilentlyContinue).Count
    Write-Log "Generated SPECs: $specCount (step_archive/specs/)"
} else {
    Write-Log "Generated SPECs: 0 (spec-generator.ps1 will create on Stop)"
}
if (Test-Path $outDir) {
    $t5Count = (Get-ChildItem -Path $outDir -Filter "trust5_*.md" -ErrorAction SilentlyContinue).Count
    Write-Log "TRUST 5 reports: $t5Count (step_archive/outputs/)"
}
if (Test-Path $metrics) {
    $metricLines = (Get-Content $metrics -ErrorAction SilentlyContinue).Count
    Write-Log "Task metrics entries: $metricLines (step_archive/task-metrics.jsonl)"
}

Write-Log "=== Session Start Complete ==="
exit 0
