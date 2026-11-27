$root = "C:\Users\Avance Computer Lab\plu-mobi"
$cardPath = "$root\client\src\features\member\DigitalCard.jsx"
$cssCandidates = @("$root\client\src\index.css","$root\client\src\App.css","$root\client\src\main.css")
$cssPath = $cssCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

Copy-Item $cardPath "$cardPath.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')" -Force
if ($cssPath) { Copy-Item $cssPath "$cssPath.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')" -Force }

# Fix downloadPng()
$c = Get-Content $cardPath -Raw
$oldDownload = '(?s)const canvas = await html2canvas\(el,\s*\{[^}]*\}\);'
$newDownload = @"
const canvas = await html2canvas(el, {
      backgroundColor: "#FFC400",
      scale: 4,
      useCORS: true,
      logging: false,
      width: 338,
      height: 213,
      windowWidth: 400,
      windowHeight: 300,
      scrollX: 0,
      scrollY: 0,
    });
"@
if ($c -match $oldDownload) {
  $c = [regex]::Replace($c, $oldDownload, $newDownload.Trim())
  Write-Host "Patched downloadPng()" -ForegroundColor Green
} else {
  Write-Host "WARN: downloadPng html2canvas block not matched" -ForegroundColor Yellow
}
Set-Content -Path $cardPath -Value $c -NoNewline -Encoding UTF8

# Fix print CSS
if ($cssPath) {
  $css = Get-Content $cssPath -Raw
  $css = $css -replace '@page\s*\{[^}]*\}', ''
  $css += @"

/* ==== PRINT: full card, no clipping ==== */
@media print {
  body * { visibility: hidden !important; }
  #plu-id-card, #plu-id-card * { visibility: visible !important; }
  #plu-id-card {
    position: absolute !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) scale(1.1) !important;
    box-shadow: none !important;
  }
  #plu-id-card [style*="white-space: nowrap"] {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
    word-break: break-word !important;
  }
  #plu-id-card > div { overflow: visible !important; }
  @page { size: auto; margin: 10mm; }
}
"@
  Set-Content -Path $cssPath -Value $css -NoNewline -Encoding UTF8
  Write-Host "Patched print CSS in $cssPath" -ForegroundColor Green
}

Write-Host "Done. Restart dev server and test print + download." -ForegroundColor Cyan
