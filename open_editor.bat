@echo off
echo Dang khoi dong Trinh Soan De Local PARABOL KHAO THI...
start http://localhost:3000/admin/exams/editor
cd /d "%~dp0"
npm start
