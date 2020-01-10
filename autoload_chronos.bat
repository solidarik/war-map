@echo off

call python.exe loadDatabase\python\parse_xls_to_json_chronos.py
call node.exe loadDatabase\load.js > autoload.log

echo Complited