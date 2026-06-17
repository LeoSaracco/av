@echo off
setlocal enabledelayedexpansion

REM === AV Fitness DB Runner ===
REM Usage: db.bat "SELECT * FROM clients"
REM        db.bat (interactive mode)

set QUERY=%~1

if "%QUERY%"=="" (
    set /p QUERY="SQL> "
)

if "%QUERY%"=="" (
    echo No query provided.
    exit /b 1
)

echo Running query...
node "%~dp0db.js" "!QUERY!"
endlocal
