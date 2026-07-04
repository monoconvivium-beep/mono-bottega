param(
  [Parameter(Mandatory = $true)]
  [string] $RepositoryUrl
)

$ErrorActionPreference = "Stop"

if ($RepositoryUrl -notmatch '^https://github\.com/.+/.+\.git$') {
  throw "RepositoryUrl deve essere nel formato https://github.com/UTENTE/REPO.git"
}

git branch -M main

$existingRemote = git remote
if ($existingRemote -contains "origin") {
  git remote set-url origin $RepositoryUrl
} else {
  git remote add origin $RepositoryUrl
}

git push -u origin main

$repoPath = $RepositoryUrl -replace '^https://github\.com/', '' -replace '\.git$', ''
$pagesSettings = "https://github.com/$repoPath/settings/pages"
$pagesUrl = "https://$($repoPath.Split('/')[0]).github.io/$($repoPath.Split('/')[1])/"

Write-Host ""
Write-Host "Push completato."
Write-Host "Apri GitHub Pages Settings:"
Write-Host $pagesSettings
Write-Host ""
Write-Host "Imposta:"
Write-Host "Source: Deploy from a branch"
Write-Host "Branch: main"
Write-Host "Folder: /root"
Write-Host ""
Write-Host "URL previsto:"
Write-Host $pagesUrl

Start-Process $pagesSettings
