$files = @(
    "css/utilities.css",
    "css/components.css",
    "css/home.css",
    "js/chatbot.js",
    "js/newsletter.js",
    "js/pages/about.js",
    "js/pages/contact.js",
    "js/proverbes.js",
    "js/test-projects-storage.js",
    "js/test-supabase.js",
    "_redirects",
    "sitemap.xml",
    "robots.txt",
    "404.html",
    "admin/debug.html"
)

$basePath = "c:\Users\USER\Desktop\gal-lubumbashi-main"

foreach ($file in $files) {
    $fullPath = Join-Path $basePath $file
    if (Test-Path $fullPath) {
        Write-Host "Cleaning $fullPath..."
        $content = Get-Content $fullPath -Raw
        
        # Regex to keep HEAD version
        $newContent = $content -replace '(?s)<<<<<<< HEAD\r?\n(.*?)\r?\n=======.*?>>>>>>> [a-f0-9]+', '$1'
        
        # Generic fallback
        $newContent = $newContent -replace '(?s)<<<<<<<.*?\r?\n(.*?)\r?\n=======.*?>>>>>>>.*?\r?\n', '$1'
        
        if ($newContent -ne $content) {
            Set-Content $fullPath $newContent -NoNewline
            Write-Host "Successfully cleaned $file"
        } else {
            Write-Host "No markers found in $file"
        }
    } else {
        Write-Host "File not found: $fullPath"
    }
}
