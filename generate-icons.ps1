# Generate PNG icons from canvas drawing using System.Drawing
Add-Type -AssemblyName System.Drawing

function New-Icon {
    param([int]$Size, [string]$Path)
    
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    $scale = $Size / 128.0
    
    # Background
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(26, 26, 46))
    $g.FillRectangle($bgBrush, 0, 0, $Size, $Size)
    
    # TV Screen outline
    $screenPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(224, 224, 224), [math]::Max(1, 3 * $scale))
    $sx = [int](18 * $scale); $sy = [int](24 * $scale)
    $sw = [int](92 * $scale); $sh = [int](58 * $scale)
    $g.DrawRectangle($screenPen, $sx, $sy, $sw, $sh)
    
    # TV Stand
    $standPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(224, 224, 224), [math]::Max(1, 3 * $scale))
    $g.DrawLine($standPen, [int](44*$scale), [int](88*$scale), [int](84*$scale), [int](88*$scale))
    $g.DrawLine($standPen, [int](64*$scale), [int](82*$scale), [int](64*$scale), [int](88*$scale))
    
    # Play button (red triangle)
    $redBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 0))
    $points = @(
        New-Object System.Drawing.Point([int](52*$scale), [int](40*$scale)),
        New-Object System.Drawing.Point([int](52*$scale), [int](66*$scale)),
        New-Object System.Drawing.Point([int](74*$scale), [int](53*$scale))
    )
    $g.FillPolygon($redBrush, $points)
    
    # "TV" text
    $fontSize = [math]::Max(6, [int](14 * $scale))
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 170, 170))
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString("TV", $font, $textBrush, [float]($Size/2), [float](96*$scale), $sf)
    
    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    
    Write-Host "Created $Path (${Size}x${Size})"
}

$dir = "C:\Users\scott\.gemini\antigravity\scratch\youtube-tv-extension\icons"
New-Icon -Size 16 -Path "$dir\icon16.png"
New-Icon -Size 48 -Path "$dir\icon48.png"
New-Icon -Size 128 -Path "$dir\icon128.png"

# Create "off" variants (grayscale-ish)
function New-OffIcon {
    param([int]$Size, [string]$Path)
    
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    
    $scale = $Size / 128.0
    
    # Dark background
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 40, 40))
    $g.FillRectangle($bgBrush, 0, 0, $Size, $Size)
    
    # TV Screen outline (dimmed)
    $screenPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 100, 100), [math]::Max(1, 3 * $scale))
    $sx = [int](18 * $scale); $sy = [int](24 * $scale)
    $sw = [int](92 * $scale); $sh = [int](58 * $scale)
    $g.DrawRectangle($screenPen, $sx, $sy, $sw, $sh)
    
    # Stand (dimmed)
    $standPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 100, 100), [math]::Max(1, 3 * $scale))
    $g.DrawLine($standPen, [int](44*$scale), [int](88*$scale), [int](84*$scale), [int](88*$scale))
    $g.DrawLine($standPen, [int](64*$scale), [int](82*$scale), [int](64*$scale), [int](88*$scale))
    
    # Play button (gray)
    $grayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 100, 100))
    $points = @(
        New-Object System.Drawing.Point([int](52*$scale), [int](40*$scale)),
        New-Object System.Drawing.Point([int](52*$scale), [int](66*$scale)),
        New-Object System.Drawing.Point([int](74*$scale), [int](53*$scale))
    )
    $g.FillPolygon($grayBrush, $points)
    
    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    
    Write-Host "Created $Path (${Size}x${Size} off)"
}

New-OffIcon -Size 16 -Path "$dir\icon16-off.png"
New-OffIcon -Size 48 -Path "$dir\icon48-off.png"
New-OffIcon -Size 128 -Path "$dir\icon128-off.png"

Write-Host "`nAll icons generated!"
