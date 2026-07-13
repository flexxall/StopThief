Add-Type -AssemblyName System.Drawing

function New-ScannerIcon {
    param([int]$IconSize)

    $bmp = New-Object System.Drawing.Bitmap $IconSize, $IconSize
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $black = [System.Drawing.Color]::FromArgb(0, 0, 0)
    $border = [System.Drawing.Color]::FromArgb(85, 85, 85)
    $label = [System.Drawing.Color]::FromArgb(204, 204, 204)
    $white = [System.Drawing.Color]::White
    $displayBg = [System.Drawing.Color]::FromArgb(16, 0, 0)
    $led = [System.Drawing.Color]::FromArgb(255, 17, 17)
    $grayBtn = [System.Drawing.Color]::FromArgb(229, 232, 232)
    $green = [System.Drawing.Color]::FromArgb(39, 174, 96)
    $red = [System.Drawing.Color]::FromArgb(192, 57, 43)

    $g.Clear($black)

    $pad = [int]($IconSize * 0.08)
    $w = $IconSize - (2 * $pad)
    $x = $pad
    $y = $pad

    $headerH = [int]($IconSize * 0.15)
    $displayH = [int]($IconSize * 0.12)
    $gap = [int]($IconSize * 0.018)
    $keypadY = $y + $headerH + $gap + $displayH + $gap
    $keypadH = $IconSize - $pad - $keypadY
    $rows = 5
    $btnH = [int](($keypadH - (($rows - 1) * $gap)) / $rows)
    $btnW = [int](($w - (2 * $gap)) / 3)
    $penWidth = [math]::Max(1, [int]($IconSize / 256))

    $pen = New-Object System.Drawing.Pen($border, $penWidth)
    $g.DrawRectangle($pen, $x, $y, $w, $headerH)

    $labelFont = New-Object System.Drawing.Font("Arial", [math]::Max(6, [int]($IconSize / 46)), [System.Drawing.FontStyle]::Bold)
    $brandFont = New-Object System.Drawing.Font("Arial", [math]::Max(7, [int]($IconSize / 36)), [System.Drawing.FontStyle]::Bold)
    $ledFont = New-Object System.Drawing.Font("Courier New", [math]::Max(14, [int]($IconSize / 12)), [System.Drawing.FontStyle]::Bold)
    $btnFont = New-Object System.Drawing.Font("Arial", [math]::Max(8, [int]($IconSize / 22)), [System.Drawing.FontStyle]::Bold)
    $smallFont = New-Object System.Drawing.Font("Arial", [math]::Max(5, [int]($IconSize / 58)), [System.Drawing.FontStyle]::Bold)

    $labelBrush = New-Object System.Drawing.SolidBrush($label)
    $whiteBrush = New-Object System.Drawing.SolidBrush($white)
    $ledBrush = New-Object System.Drawing.SolidBrush($led)

    $g.DrawString("BLDG. STREET", $labelFont, $labelBrush, $x + 6, $y + 4)
    $locSize = $g.MeasureString("LOC.", $labelFont)
    $g.DrawString("LOC.", $labelFont, $labelBrush, ($x + $w - $locSize.Width - 6), $y + 4)

    $lineY = $y + [int]($headerH * 0.38)
    $g.DrawLine((New-Object System.Drawing.Pen($label, 1)), $x + 4, $lineY, $x + $w - 4, $lineY)

    $brandRect = New-Object System.Drawing.RectangleF(($x + 4), ($lineY + 2), ($w - 8), ($headerH - ($lineY - $y) - 4))
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString("ELECTRONIC`nCRIME SCANNER", $brandFont, $whiteBrush, $brandRect, $sf)

    $displayY = $y + $headerH + $gap
    $displayRect = New-Object System.Drawing.Rectangle($x, $displayY, $w, $displayH)
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($displayBg)), $displayRect)

    $ledText = "Cr"
    $ledSize = $g.MeasureString($ledText, $ledFont)
    $ledX = $x + (($w - $ledSize.Width) / 2)
    $ledY = $displayY + (($displayH - $ledSize.Height) / 2)
    $g.DrawString($ledText, $ledFont, $ledBrush, $ledX, $ledY)

    $btnColors = @(
        @([System.Drawing.Color]::FromArgb(236, 193, 33), "1"),
        @([System.Drawing.Color]::FromArgb(236, 193, 33), "2"),
        @($grayBtn, "OFF"),
        @([System.Drawing.Color]::FromArgb(211, 84, 0), "3"),
        @([System.Drawing.Color]::FromArgb(211, 84, 0), "4"),
        @($grayBtn, "ON"),
        @([System.Drawing.Color]::FromArgb(216, 27, 96), "5"),
        @([System.Drawing.Color]::FromArgb(216, 27, 96), "6"),
        @([System.Drawing.Color]::FromArgb(211, 47, 47), "T"),
        @([System.Drawing.Color]::FromArgb(155, 89, 182), "7"),
        @([System.Drawing.Color]::FromArgb(155, 89, 182), "8"),
        @([System.Drawing.Color]::FromArgb(230, 126, 34), "A"),
        @([System.Drawing.Color]::FromArgb(41, 128, 185), "9"),
        @([System.Drawing.Color]::FromArgb(39, 174, 96), "0"),
        @([System.Drawing.Color]::FromArgb(236, 193, 33), "C")
    )

    for ($i = 0; $i -lt $btnColors.Length; $i++) {
        $col = $i % 3
        $row = [math]::Floor($i / 3)
        $bx = $x + ($col * ($btnW + $gap))
        $by = $keypadY + ($row * ($btnH + $gap))
        $rect = New-Object System.Drawing.Rectangle($bx, $by, $btnW, $btnH)
        $g.FillRectangle((New-Object System.Drawing.SolidBrush($btnColors[$i][0])), $rect)

        $text = [string]$btnColors[$i][1]
        $font = if ($text.Length -gt 1) { $smallFont } else { $btnFont }
        $textBrush = if ($text -eq "OFF") { (New-Object System.Drawing.SolidBrush($green)) }
                     elseif ($text -eq "ON") { (New-Object System.Drawing.SolidBrush($red)) }
                     else { $whiteBrush }
        $textSize = $g.MeasureString($text, $font)
        $g.DrawString($text, $font, $textBrush, ($bx + ($btnW - $textSize.Width) / 2), ($by + ($btnH - $textSize.Height) / 2))
    }

    $pen.Dispose()
    $g.Dispose()
    return $bmp
}

$iconDir = Join-Path $PSScriptRoot "..\assets\icons"
New-Item -ItemType Directory -Force -Path $iconDir | Out-Null

foreach ($iconSize in @(192, 512)) {
    $icon = New-ScannerIcon -IconSize $iconSize
    $path = Join-Path $iconDir "icon-$iconSize.png"
    $icon.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $icon.Dispose()
    Write-Host "Wrote $path"
}
