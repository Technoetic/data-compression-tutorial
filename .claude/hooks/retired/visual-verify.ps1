# visual-verify.ps1
# PostToolUse Hook (Write|Edit) — 웹 프로젝트 파일 수정 시 자동 스크린샷 + 크롭
# 범용: dist/index.html 또는 프로젝트 루트의 index.html을 자동 감지
#
# 사용법: settings.json의 PostToolUse에 등록
# { "matcher": "Write|Edit", "hooks": [{ "type": "command", "command": "powershell -ExecutionPolicy Bypass -File .claude/hooks/visual-verify.ps1", "timeout": 30 }] }

param()

$ErrorActionPreference = "Continue"
$projectRoot = (Get-Location).Path

# B-P2 fix: $input은 PS 5.1에서 hook stdin을 못 읽는다. UTF-8 명시 read.
$input_json = $null
try {
    $stdinStream = [System.IO.StreamReader]::new([Console]::OpenStandardInput(), [System.Text.Encoding]::UTF8)
    $raw = $stdinStream.ReadToEnd()
    $stdinStream.Close()
    if ($raw) { $input_json = $raw | ConvertFrom-Json }
} catch {}
if ($null -eq $input_json) { exit 0 }

# 웹 파일(html/css/js) 수정 시에만 실행
$filePath = ""
if ($input_json.tool_input.file_path) { $filePath = $input_json.tool_input.file_path }
elseif ($input_json.tool_response.filePath) { $filePath = $input_json.tool_response.filePath }

if ($filePath -and $filePath -notmatch '\.(html|css|js|jsx|tsx|vue|svelte)$') {
    exit 0
}

# dist/index.html 또는 index.html 자동 감지
$htmlFile = $null
if (Test-Path "$projectRoot/dist/index.html") { $htmlFile = "$projectRoot/dist/index.html" }
elseif (Test-Path "$projectRoot/build/index.html") { $htmlFile = "$projectRoot/build/index.html" }
elseif (Test-Path "$projectRoot/index.html") { $htmlFile = "$projectRoot/index.html" }
elseif (Test-Path "$projectRoot/src/index.html") { $htmlFile = "$projectRoot/src/index.html" }

if (-not $htmlFile) {
    # HTML 파일 없으면 스킵
    exit 0
}

# B1 fix: .claude/ 외부에 저장 (CLAUDE.md 절대 규칙 준수)
$ssDir = "$projectRoot/step_archive/screenshots"
if (-not (Test-Path $ssDir)) { New-Item -ItemType Directory -Path $ssDir -Force | Out-Null }

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# B-P2-18 fix: $htmlFile / $ssDir를 JS 문자열 리터럴 보간하면 인젝션 위험.
# 환경변수로 전달하고 JS 안에서는 process.env로 읽는다 (이스케이프 불필요).
$env:VV_HTML_FILE = $htmlFile
$env:VV_OUT_PATH  = Join-Path $ssDir "auto-verify-$timestamp.png"

$scriptContent = @'
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  try {
    const browser = await chromium.launch();
    const htmlFile = process.env.VV_HTML_FILE;
    const outPath  = process.env.VV_OUT_PATH;
    if (!htmlFile || !outPath) { process.exit(0); }
    const filePath = 'file:///' + path.resolve(htmlFile).replace(/\\/g, '/');
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: outPath, fullPage: false });
    await page.close();
    await browser.close();
  } catch(e) { process.exit(0); }
})();
'@

# B1 fix: 임시 파일도 .claude/ 외부로
$tmpScript = Join-Path $ssDir "_tmp_verify.js"
try {
    Set-Content -Path $tmpScript -Value $scriptContent -Encoding UTF8
    try {
        node $tmpScript 2>$null
    } catch {}
} finally {
    if (Test-Path $tmpScript) { Remove-Item $tmpScript -Force -ErrorAction SilentlyContinue }
    Remove-Item Env:\VV_HTML_FILE -ErrorAction SilentlyContinue
    Remove-Item Env:\VV_OUT_PATH  -ErrorAction SilentlyContinue
}

# 결과 JSON 출력
$result = @{
    hookSpecificOutput = @{
        hookEventName = "PostToolUse"
        additionalContext = "스크린샷 촬영됨: step_archive/screenshots/auto-verify-$timestamp.png — Read로 직접 확인하세요."
    }
} | ConvertTo-Json -Depth 3

Write-Output $result
exit 0
