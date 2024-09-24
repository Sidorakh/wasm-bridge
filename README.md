# wasm-bridge
Include Javascript libraries in your GameMaker WebAssembly games!

In my ongoing quest to try and use the GX.Games/Web Assembly target in GameMaker in place of the HTML5 target, I wanted Javascript extensions. And since we don't have that access yet, I DIY'd it. 

## Dependencies
- Requires Node.JS v20 on system PATH (other versions may work)

## Limitations
This does not work when expoorting directly to GX.Games.
However, you can export a zip on your local PC by uncommenting line 62 in the `server.js` file in the wasm-bridge scripts folder - this line copies any game builds to the curent directory. When WASM zip exports are opened up officially in GameMaker, I expect those to work right out of the box. 

## How does it work?
This extension overrides `window.prompt` in the HTML pages that the GX.Games target generates, and bundles specific JavaScript files with the game. 

## Creating an extension for use with this
Create Javascript files that register functions on the `window.wasmgml` object and place them in the `extensions/wasm_bridge/scripts/libraries` folder. If you're using a build system such as webpack or a transpiler like TypeScript, just ensure the functions are created on the `window.wasmgml` object and drop the generated JS file in the correct location. 

For example, a library designed to use the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)

```js
/// extensions/wasm_bridge/scripts/libraries/native-share-dialog.js
window.wasmgml.native_share_dialog  =  async (params) => {
    try {
        await  navigator.share(params);
    } catch(e) {
        // share API not available
    };
}

/// In GameMaker - to call the above function
run_js_function("native_share_dialog",{text: "Shared from a GameMaker WASM game!"});
```
