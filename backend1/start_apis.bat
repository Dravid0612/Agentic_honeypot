@echo off
echo Starting Dual API Testing System...
echo.

cd /d "C:\Users\Dhayanithi M U\OneDrive\Desktop\new\Agentic_honeypot\backend1"

REM Activate virtual environment if exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

REM Install Flask if not installed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installing Flask...
    pip install flask flask-cors >nul 2>&1
)

REM Run the API manager
python api_manager.py

pause