# Script pour mettre à jour les liens de navigation pour GitHub Pages
# Utilise le hash routing (#) au lieu des chemins de fichiers

Write-Host "🔄 Mise à jour des liens de navigation pour GitHub Pages..." -ForegroundColor Cyan

$indexFile = "index.html"

# Lire le contenu du fichier
$content = Get-Content $indexFile -Raw -Encoding UTF8

# Remplacer les liens dans la navigation desktop
$content = $content -replace 'href="index\.html"', 'href="#"'
$content = $content -replace 'href="html/videos\.html"', 'href="#videos"'
$content = $content -replace 'href="html/formations\.html"', 'href="#formations"'
$content = $content -replace 'href="html/machines\.html"', 'href="#machines"'
$content = $content -replace 'href="html/blog\.html"', 'href="#blog"'
$content = $content -replace 'href="html/faq\.html"', 'href="#faq"'
$content = $content -replace 'href="html/about\.html"', 'href="#a-propos"'
$content = $content -replace 'href="html/contact\.html"', 'href="#contact"'

# Sauvegarder le fichier modifié
$content | Set-Content $indexFile -Encoding UTF8 -NoNewline

Write-Host "✅ Liens de navigation mis à jour avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Modifications effectuées:" -ForegroundColor Yellow
Write-Host "  - Navigation desktop: chemins remplacés par hash (#)" -ForegroundColor White
Write-Host "  - Menu mobile: chemins remplacés par hash (#)" -ForegroundColor White
Write-Host "  - Footer: chemins remplacés par hash (#)" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Prêt pour GitHub Pages!" -ForegroundColor Green
