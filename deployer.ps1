<<<<<<< HEAD
# Script de Déploiement Automatique - GAL Website
# Ce script facilite le déploiement sur GitHub Pages

Write-Host "🚀 Script de Déploiement GAL Website" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
try {
    $gitVersion = git --version
    Write-Host "✅ Git détecté: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé !" -ForegroundColor Red
    Write-Host "Téléchargez Git depuis: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

# Se positionner dans le bon dossier
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath
Write-Host "📂 Dossier: $scriptPath" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est initialisé
if (-not (Test-Path ".git")) {
    Write-Host "⚠️ Git n'est pas encore initialisé dans ce dossier" -ForegroundColor Yellow
    $init = Read-Host "Voulez-vous initialiser Git maintenant? (O/N)"
    
    if ($init -eq "O" -or $init -eq "o") {
        git init
        Write-Host "✅ Git initialisé" -ForegroundColor Green
        
        $username = Read-Host "Entrez votre nom Git"
        $email = Read-Host "Entrez votre email Git"
        
        git config user.name "$username"
        git config user.email "$email"
        Write-Host "✅ Configuration Git enregistrée" -ForegroundColor Green
    } else {
        Write-Host "❌ Impossible de continuer sans Git initialisé" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "📊 Vérification des fichiers JSON..." -ForegroundColor Cyan

# Vérifier la présence des fichiers JSON
$jsonFiles = @(
    "data/blog.json",
    "data/formations.json",
    "data/machines.json",
    "data/media-index.json",
    "data/newsletter.json",
    "data/pages.json",
    "data/videos.json"
)

$allJsonPresent = $true
foreach ($file in $jsonFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file MANQUANT !" -ForegroundColor Red
        $allJsonPresent = $false
    }
}

if (-not $allJsonPresent) {
    Write-Host ""
    Write-Host "⚠️ Certains fichiers JSON sont manquants !" -ForegroundColor Yellow
    Write-Host "Le site ne fonctionnera pas correctement sans ces fichiers." -ForegroundColor Yellow
    $continue = Read-Host "Voulez-vous continuer malgré tout? (O/N)"
    if ($continue -ne "O" -and $continue -ne "o") {
        exit
    }
}

Write-Host ""
Write-Host "📝 Statut Git actuel:" -ForegroundColor Cyan
git status --short

Write-Host ""
$message = Read-Host "Entrez un message de commit (ou Entrée pour message par défaut)"

if ([string]::IsNullOrWhiteSpace($message)) {
    $date = Get-Date -Format "dd/MM/yyyy HH:mm"
    $message = "🚀 Mise à jour site GAL - $date"
}

Write-Host ""
Write-Host "📦 Ajout des fichiers..." -ForegroundColor Cyan
git add .

Write-Host "💾 Commit..." -ForegroundColor Cyan
git commit -m "$message"

# Vérifier si un remote est configuré
$remotes = git remote
if ($remotes -notcontains "origin") {
    Write-Host ""
    Write-Host "⚠️ Aucun remote 'origin' configuré" -ForegroundColor Yellow
    Write-Host "Exemple: https://github.com/username/repo.git" -ForegroundColor Gray
    $remoteUrl = Read-Host "Entrez l'URL de votre repo GitHub"
    
    if (-not [string]::IsNullOrWhiteSpace($remoteUrl)) {
        git remote add origin $remoteUrl
        Write-Host "✅ Remote 'origin' configuré" -ForegroundColor Green
    } else {
        Write-Host "❌ Impossible de continuer sans remote" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "🚀 Push vers GitHub..." -ForegroundColor Cyan

try {
    # Vérifier si la branche main existe
    $currentBranch = git branch --show-current
    
    if ($currentBranch -ne "main") {
        git branch -M main
    }
    
    git push -u origin main
    
    Write-Host ""
    Write-Host "✅ Déploiement réussi !" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Votre site sera disponible dans 2-3 minutes à:" -ForegroundColor Cyan
    
    # Essayer d'extraire l'URL du repo
    $remoteUrl = git config --get remote.origin.url
    if ($remoteUrl -match "github.com[:/](.+)/(.+)(.git)?") {
        $username = $matches[1]
        $repo = $matches[2] -replace "\.git$", ""
        Write-Host "   https://$username.github.io/$repo/" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "📋 Checklist post-déploiement:" -ForegroundColor Cyan
    Write-Host "  1. Activez GitHub Pages dans Settings > Pages" -ForegroundColor White
    Write-Host "  2. Vérifiez que les JSON sont accessibles" -ForegroundColor White
    Write-Host "  3. Testez la page d'accueil" -ForegroundColor White
    Write-Host "  4. Testez le chatbot Lumu" -ForegroundColor White
    Write-Host "  5. Testez l'admin et l'espace membre" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "❌ Erreur lors du push:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solutions possibles:" -ForegroundColor Yellow
    Write-Host "  1. Vérifiez vos identifiants GitHub" -ForegroundColor White
    Write-Host "  2. Utilisez un Personal Access Token au lieu du mot de passe" -ForegroundColor White
    Write-Host "  3. Vérifiez l'URL du remote: git remote -v" -ForegroundColor White
}

Write-Host ""
Write-Host "Appuyez sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
=======
# Script de Déploiement Automatique - GAL Website
# Ce script facilite le déploiement sur GitHub Pages

Write-Host "🚀 Script de Déploiement GAL Website" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
try {
    $gitVersion = git --version
    Write-Host "✅ Git détecté: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé !" -ForegroundColor Red
    Write-Host "Téléchargez Git depuis: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

# Se positionner dans le bon dossier
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath
Write-Host "📂 Dossier: $scriptPath" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est initialisé
if (-not (Test-Path ".git")) {
    Write-Host "⚠️ Git n'est pas encore initialisé dans ce dossier" -ForegroundColor Yellow
    $init = Read-Host "Voulez-vous initialiser Git maintenant? (O/N)"
    
    if ($init -eq "O" -or $init -eq "o") {
        git init
        Write-Host "✅ Git initialisé" -ForegroundColor Green
        
        $username = Read-Host "Entrez votre nom Git"
        $email = Read-Host "Entrez votre email Git"
        
        git config user.name "$username"
        git config user.email "$email"
        Write-Host "✅ Configuration Git enregistrée" -ForegroundColor Green
    } else {
        Write-Host "❌ Impossible de continuer sans Git initialisé" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "📊 Vérification des fichiers JSON..." -ForegroundColor Cyan

# Vérifier la présence des fichiers JSON
$jsonFiles = @(
    "data/blog.json",
    "data/formations.json",
    "data/machines.json",
    "data/media-index.json",
    "data/newsletter.json",
    "data/pages.json",
    "data/videos.json"
)

$allJsonPresent = $true
foreach ($file in $jsonFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file MANQUANT !" -ForegroundColor Red
        $allJsonPresent = $false
    }
}

if (-not $allJsonPresent) {
    Write-Host ""
    Write-Host "⚠️ Certains fichiers JSON sont manquants !" -ForegroundColor Yellow
    Write-Host "Le site ne fonctionnera pas correctement sans ces fichiers." -ForegroundColor Yellow
    $continue = Read-Host "Voulez-vous continuer malgré tout? (O/N)"
    if ($continue -ne "O" -and $continue -ne "o") {
        exit
    }
}

Write-Host ""
Write-Host "📝 Statut Git actuel:" -ForegroundColor Cyan
git status --short

Write-Host ""
$message = Read-Host "Entrez un message de commit (ou Entrée pour message par défaut)"

if ([string]::IsNullOrWhiteSpace($message)) {
    $date = Get-Date -Format "dd/MM/yyyy HH:mm"
    $message = "🚀 Mise à jour site GAL - $date"
}

Write-Host ""
Write-Host "📦 Ajout des fichiers..." -ForegroundColor Cyan
git add .

Write-Host "💾 Commit..." -ForegroundColor Cyan
git commit -m "$message"

# Vérifier si un remote est configuré
$remotes = git remote
if ($remotes -notcontains "origin") {
    Write-Host ""
    Write-Host "⚠️ Aucun remote 'origin' configuré" -ForegroundColor Yellow
    Write-Host "Exemple: https://github.com/username/repo.git" -ForegroundColor Gray
    $remoteUrl = Read-Host "Entrez l'URL de votre repo GitHub"
    
    if (-not [string]::IsNullOrWhiteSpace($remoteUrl)) {
        git remote add origin $remoteUrl
        Write-Host "✅ Remote 'origin' configuré" -ForegroundColor Green
    } else {
        Write-Host "❌ Impossible de continuer sans remote" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "🚀 Push vers GitHub..." -ForegroundColor Cyan

try {
    # Vérifier si la branche main existe
    $currentBranch = git branch --show-current
    
    if ($currentBranch -ne "main") {
        git branch -M main
    }
    
    git push -u origin main
    
    Write-Host ""
    Write-Host "✅ Déploiement réussi !" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Votre site sera disponible dans 2-3 minutes à:" -ForegroundColor Cyan
    
    # Essayer d'extraire l'URL du repo
    $remoteUrl = git config --get remote.origin.url
    if ($remoteUrl -match "github.com[:/](.+)/(.+)(.git)?") {
        $username = $matches[1]
        $repo = $matches[2] -replace "\.git$", ""
        Write-Host "   https://$username.github.io/$repo/" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "📋 Checklist post-déploiement:" -ForegroundColor Cyan
    Write-Host "  1. Activez GitHub Pages dans Settings > Pages" -ForegroundColor White
    Write-Host "  2. Vérifiez que les JSON sont accessibles" -ForegroundColor White
    Write-Host "  3. Testez la page d'accueil" -ForegroundColor White
    Write-Host "  4. Testez le chatbot Lumu" -ForegroundColor White
    Write-Host "  5. Testez l'admin et l'espace membre" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "❌ Erreur lors du push:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solutions possibles:" -ForegroundColor Yellow
    Write-Host "  1. Vérifiez vos identifiants GitHub" -ForegroundColor White
    Write-Host "  2. Utilisez un Personal Access Token au lieu du mot de passe" -ForegroundColor White
    Write-Host "  3. Vérifiez l'URL du remote: git remote -v" -ForegroundColor White
}

Write-Host ""
Write-Host "Appuyez sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
>>>>>>> cde1394e936ce6941ecebf39df979c7b61583aef
