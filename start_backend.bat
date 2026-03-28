@echo off
echo Starting Solabucks Backend...
cd /d "%~dp0backend"
python -m venv venv 2>nul
call venv\Scripts\activate
pip install -r requirements.txt -q
python app.py
pause
