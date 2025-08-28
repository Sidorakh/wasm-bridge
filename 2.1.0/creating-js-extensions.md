# Creating JavaScript extensions

## Inital setup

In your projects main directory, create a new folder called `libraries` if it doesn't already exist (not in the IDE - in Windows Explorer or similar). This is where .js files to inject into your project will go. 

## Creating a library

There's two parts to creating a usable JavaScript function - the JavaScript itself, and the glue in GameMaker that helps it run (though, this can be as simple as calling [`run_js_function`](run-js-function.md) directly). This is goign to be a very brief guide on implementing the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share), or if you want to skip to the end you can find more or less the end result over [here](https://github.com/Sidorakh/wasm-bridge/blob/main/libraries/native-share-dialog.js). 


Create a new .js file and give it a descriptive name, for example `native-share-dialog.js`, open it in your favourite code editor, and add the following code:

```js
window.wasmgml.native_share_dialog = async (params) => {
    // check if the function exists - Firefox on desktop doesn't have it for example
    if ('share' in navigator) {
        try {
            // require at least one known field
            if ('url' in params || 'text' in params || 'title' in params) {
                await navigator.share(params)
            }
        } catch(e) {
            // catch the error - means the function failed entirely
        }
    }
}
```

It first checks to ensure the `navigator.share` function exists, then makes sure that at least one field is present on the `params` object, and then calls `navigator.share()` in a try-catch statement which will catch the error if the share is cancelled or fails for some other reason. 

To run this in GameMaker, it's as simple as running the following code:
```gml
run_js_function("native_share_dialog",{url: "https://gamemaker.io"})
```




