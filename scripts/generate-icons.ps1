Add-Type -AssemblyName System.Drawing

function New-ScannerIcon {
    param(
        [int]$IconSize,
        [double]$Scale = 1.55
    )

    $bmp = New-Object System.Drawing.Bitmap($IconSize, $IconSize, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    $black = [System.Drawing.Color]::FromArgb(255, 0, 0, 0)
    $border = [System.Drawing.Color]::FromArgb(255, 85, 85, 85)
    $label = [System.Drawing.Color]::FromArgb(255, 204, 204, 204)
    $white = [System.Drawing.Color]::White
    $displayBg = [System.Drawing.Color]::FromArgb(255, 16, 0, 0)
    $led = [System.Drawing.Color]::FromArgb(255, 255, 17, 17)
    $grayBtn = [System.Drawing.Color]::FromArgb(255, 229, 232, 232)
    $green = [System.Drawing.Color]::FromArgb(255, 39, 174, 96)
    $red = [System.Drawing.Color]::FromArgb(255, 192, 57, 43)

    $g.Clear($black)
    $g.TranslateTransform($IconSize / 2.0, $IconSize / 2.0)
    $g.ScaleTransform($Scale, $Scale)
    $g.TranslateTransform(-$IconSize / 2.0, -$IconSize / 2.0)

    $x = 0
    $y = 0
    $w = $IconSize

    $headerH = [int]($IconSize * 0.16)
    $displayH = [int]($IconSize * 0.13)
    $gap = [int]($IconSize * 0.008)
    $keypadY = $y + $headerH + $gap + $displayH + $gap
    $keypadH = $IconSize - $keypadY
    $rows = 5
    $btnH = [int](($keypadH - (($rows - 1) * $gap)) / $rows)
    $btnW = [int](($w - (2 * $gap)) / 3)
    $penWidth = [math]::Max(1, [int]($IconSize / 256))

    $pen = New-Object System.Drawing.Pen($border, $penWidth)
    $g.DrawRectangle($pen, $x, $y, $w - 1, $headerH)

    $labelFont = New-Object System.Drawing.Font("Arial", [math]::Max(6, [int]($IconSize / 40)), [System.Drawing.FontStyle]::Bold)
    $brandFont = New-Object System.Drawing.Font("Arial", [math]::Max(7, [int]($IconSize / 30)), [System.Drawing.FontStyle]::Bold)
    $ledFont = New-Object System.Drawing.Font("Courier New", [math]::Max(14, [int]($IconSize / 10)), [System.Drawing.FontStyle]::Bold)
    $btnFont = New-Object System.Drawing.Font("Arial", [math]::Max(8, [int]($IconSize / 18)), [System.Drawing.FontStyle]::Bold)
    $smallFont = New-Object System.Drawing.Font("Arial", [math]::Max(5, [int]($IconSize / 50)), [System.Drawing.FontStyle]::Bold)

    $labelBrush = New-Object System.Drawing.SolidBrush($label)
    $whiteBrush = New-Object System.Drawing.SolidBrush($white)
    $ledBrush = New-Object System.Drawing.SolidBrush($led)

    $edge = [math]::Max(2, [int]($IconSize / 128))
    $g.DrawString("BLDG. STREET", $labelFont, $labelBrush, $x + $edge, $y + $edge)
    $locSize = $g.MeasureString("LOC.", $labelFont)
    $g.DrawString("LOC.", $labelFont, $labelBrush, ($x + $w - $locSize.Width - $edge), $y + $edge)

    $lineY = $y + [int]($headerH * 0.38)
    $g.DrawLine((New-Object System.Drawing.Pen($label, 1)), $x + $edge, $lineY, $x + $w - $edge, $lineY)

    $brandRect = New-Object System.Drawing.RectangleF(($x + $edge), ($lineY + 2), ($w - (2 * $edge)), ($headerH - ($lineY - $y) - 4))
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
        @([System.Drawing.Color]::FromArgb(255, 236, 193, 33), "1"),
        @([System.Drawing.Color]::FromArgb(255, 236, 193, 33), "2"),
        @($grayBtn, "OFF"),
        @([System.Drawing.Color]::FromArgb(255, 211, 84, 0), "3"),
        @([System.Drawing.Color]::FromArgb(255, 211, 84, 0), "4"),
        @($grayBtn, "ON"),
        @([System.Drawing.Color]::FromArgb(255, 216, 27, 96), "5"),
        @([System.Drawing.Color]::FromArgb(255, 216, 27, 96), "6"),
        @([System.Drawing.Color]::FromArgb(255, 211, 47, 47), "T"),
        @([System.Drawing.Color]::FromArgb(255, 155, 89, 182), "7"),
        @([System.Drawing.Color]::FromArgb(255, 155, 89, 182), "8"),
        @([System.Drawing.Color]::FromArgb(255, 230, 126, 34), "A"),
        @([System.Drawing.Color]::FromArgb(255, 41, 128, 185), "9"),
        @([System.Drawing.Color]::FromArgb(255, 39, 174, 96), "0"),
        @([System.Drawing.Color]::FromArgb(255, 236, 193, 33), "C")
    )

    for ($i = 0; $i -lt $btnColors.Length; $i++) {
        $col = $i % 3
        $row = [math]::Floor($i / 3)
        $bx = $x + $gap + ($col * ($btnW + $gap))
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
