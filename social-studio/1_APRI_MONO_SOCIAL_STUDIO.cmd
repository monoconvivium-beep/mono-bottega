@echo off
title MONO Social Studio - Avvio
cd /d "%~dp0"
echo.
echo MONO Social Studio
echo.
echo 1. Lascio aperta questa finestra.
echo 2. Apro il browser automaticamente.
echo 3. Se non si apre, usa questo link esatto:
echo.
echo    http://127.0.0.1:4177/
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-mono-social-studio.ps1"
pause
