# Getting Started

## Why / how use this extension

GameMaker's Web Assembly (GX.Games) export is really good, it has better performance than the equivalent HTML5 export, but unfortunately lacks native JavaScript extension support. This extension patches that support in by modifying the HTML files that GameMaker generates and overwriting the `window.prompt`. The new `window.prompt` function checks if the first parameter is `"wasmexport-function"`, and if so, attempts to call custom code instead of showing the prompt window. 

## Installing this extension
---
1. Download the latest .yymp from [releases](https://github.com/sidorakh/wasm-bridge/releases)
2. Open up your GameMaker project and drag the .yymp file into the IDE (or go to the Tools menu and select "Import Local Package")
3. Import the WASM bridge folder

## Creating callable JavaScript functions
1. In your projects folder, create a directory called `libraries` if it doesn't exist
2. Create functions on the `window.wasmgml` object, it is created before any custom code is imported. Examples of basic extensions are included with this library and can be found here: https://github.com/Sidorakh/wasm-bridge/tree/main/libraries/

## Calling these functions in-game
1. Run the `call_custom_code` function, the first parameter is the function name on `window.wasmgml` to call, and the second is an array or struct of parameters to pass to it. The returned value, if any, will depend on the function called
2. That's it. That's the entire process

## Exporting

To export a game with included libraries, you need to ensure you click `Export as ZIP` when exporting your GameMaker game on the WASM target. 