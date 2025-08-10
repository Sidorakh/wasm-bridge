
if [[$YYEXTOPT_wasm_bridge_enabled -eq "True"]]
then
    echo "$YYEXTOPT_wasm_bridge_enabled"
    if test -f "$YYMACROS_project_dir/extensions/wasm_bridge/scripts/server.js"
        set loc=$pwd
        cd "$YYMACROS_project_dir/extensions/wasm_bridge/scripts/"
        npm i
        node "$YYMACROS_project_dir/extensions/wasm_bridge/scripts/server.js" postpackage
    else
        echo script file not found
    fi
else
    echo extension wasm_bridge not enabled - continuing to regular build
fi