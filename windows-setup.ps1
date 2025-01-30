# OwO Farm Bot Stable
# Copyright (C) 2024 Mido
# This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
# For more information, see README.md and LICENSE

# BENDE VARRR 🤙🤙🤙🤙
# https://open.spotify.com/track/1Ma4fLShd0hpZSNH37mEkR?si=fa52965f89434731


function Install-Python {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion -like "*3.10.6*") {
        Write-Host "Python 3.10.6 is already installed." -ForegroundColor Green
    } else {
        Write-Host "Installing Python 3.10.6..." -ForegroundColor Yellow
        $pythonInstaller = "https://www.python.org/ftp/python/3.10.6/python-3.10.6-amd64.exe"
        $installerPath = "$env:TEMP\python-3.10.6-installer.exe"
        Invoke-WebRequest -Uri $pythonInstaller -OutFile $installerPath
        Start-Process $installerPath -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1" -Wait
        Remove-Item $installerPath
        Write-Host "Python 3.10.6 has been successfully installed." -ForegroundColor Green
    }
}

function Install-Node {
    $nodeVersion = node -v 2>$null
    if ($nodeVersion -like "v*") {
        Write-Host "Node.js is already installed: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "Installing Node.js..." -ForegroundColor Yellow
        $nodeInstaller = "https://nodejs.org/dist/latest/node-v20.7.1-x64.msi" # Adjust the version URL if needed
        $installerPath = "$env:TEMP\nodejs-installer.msi"
        Invoke-WebRequest -Uri $nodeInstaller -OutFile $installerPath
        Start-Process msiexec.exe -ArgumentList "/i $installerPath /quiet /norestart" -Wait
        Remove-Item $installerPath
        Write-Host "Node.js has been successfully installed." -ForegroundColor Green
    }
}

function Install-Git {
    $gitVersion = git --version 2>$null
    if ($gitVersion -like "git version *") {
        Write-Host "Git is already installed: $gitVersion" -ForegroundColor Green
    } else {
        Write-Host "Installing Git..." -ForegroundColor Yellow
        $gitInstaller = "https://github.com/git-for-windows/git/releases/latest/download/Git-2.42.0-64-bit.exe"
        $installerPath = "$env:TEMP\git-installer.exe"
        Invoke-WebRequest -Uri $gitInstaller -OutFile $installerPath
        Start-Process $installerPath -ArgumentList "/SILENT" -Wait
        Remove-Item $installerPath
        Write-Host "Git has been successfully installed." -ForegroundColor Green
    }
}

function Clone-Project {
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $repoPath = Join-Path $desktopPath "owofarmbot_stable"

    if (Test-Path $repoPath) {
        Write-Host "The project is already cloned at $repoPath." -ForegroundColor Green
    } else {
        Write-Host "Cloning the repository..." -ForegroundColor Yellow
        git clone https://github.com/Mid0aria/owofarmbot_stable $repoPath
        Write-Host "Repository cloned successfully." -ForegroundColor Green
    }

    # Proje klasörüne gir ve npm install çalıştır
    Write-Host "Entering the project directory and installing dependencies..." -ForegroundColor Yellow
    Set-Location $repoPath
    npm install
    Write-Host "Dependencies installed successfully." -ForegroundColor Green
}

Install-Python
Install-Node
Install-Git
Clone-Project

Write-Host "Everything is ready. Please type 'node main.js' in owofarmbot_stable folder" -ForegroundColor Cyan
