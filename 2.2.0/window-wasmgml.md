# window.wasmgml

`window.wasmgml` is an object injected into the webpage containing your game when using this extension, it contains all the JavaScript code you can execute from GML, and will be created before any other libraries are injected into your games webpage. 

Functions created on this object should accept either a single argument, an object or array that stores all parameters, and return anything that can be serialised in JSON (or, optionally, nothing at all, which will return `undefined` in GameMaker). If a single array is passed into `run_js_function`, then **the external function will be called with the Spread operator** to allow for functions to be declared with standard parameters. 