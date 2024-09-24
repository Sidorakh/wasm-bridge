@echo off
if "%YYEXTOPT_wasm_bridge_enabled%" == "True" (
    echo "%YYEXTOPT_wasm_bridge_enabled%"
    if exist "%YYMACROS_project_dir%/extensions/wasm_bridge/scripts/server.js"  (
        set loc=%cd%
        cd "%YYMACROS_project_dir%/extensions/wasm_bridge/scripts/"
        cmd /c "npm i"
        node "%YYMACROS_project_dir%/extensions/wasm_bridge/scripts/server.js"
    ) else (
        echo script file not found
    )
) else (
    echo extension wasm_bridge not enabled - continuing to regular build
)