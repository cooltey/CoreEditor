@echo off
title SublimeMark Desktop Runner
echo Launching SublimeMark in Electron Desktop Mode...
call npm run build
call npx electron .
