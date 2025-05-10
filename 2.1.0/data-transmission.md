# Data Transmission

## Basic: Primitive Types

At a basic level, anything that can be serialised into JSON can be sent between GameMaker and JavaScript, the following is a list of types in GameMaker and their basic JavaScript equivalents

| GameMaker | JavaScript |
| - | - |
| `Real` \| `int64` | `Number` |
| `Boolean` | `Boolean` |
| `String` | `String` |
| `Array` | `Array` |
| `Struct` | `Object` |
| `undefined` | `undefined` \| `null` |

By default, JSON is used to transfer data in and out of the GameMaker application, so any types that can serialise in GameMakers JSON immplementation will work as expected, each is outlined in the above table. Types such as [`Handles`](https://manual.gamemaker.io/monthly/en/GameMaker_Language/GML_Overview/Data_Types.htm#:~:text=int64-,Handles,-A%20handle%20contains) and special values such as `NaN` and `Infinity` are all turned into specially formatte strings by GameMakers `json_stringify` function, and as such if unaltered *can* be properly evaluated by `json_parse`, but since they don't have an equivalent in the standard JSON implementation used by JavaScript, it's best to not rely on this behaviour when using this extension. 

## Advanced: Buffers

You can use the provided [`window.gmbuffer`](window-gmbuffer.md) functions to get and set GML buffers directly from JavaScript with some safeguards. The `window.gmbuffer.get` function returns a section of the games memory where that buffer is stored, while the `window.gmbuffer.set` functino will overwrite the specified buffer with whatever new data passed in (with some absic sanity checks to try and avoid a buffer overflow). 

You can also access a GameMaker buffer from JavaScript directly if needed by manipulating the heap directly (yes, really). You can find an implementation for reading [here](https://github.com/Sidorakh/wasm-bridge/blob/main/extensions/wasm_bridge/scripts/ext-setup.js#L36) and for writing [here](https://github.com/Sidorakh/wasm-bridge/blob/main/extensions/wasm_bridge/scripts/ext-setup.js#L47) in the extensions main JS file. You need to use the address obtained with `buffer_get_address` to find the buffer in memory in the [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) stored in the `mb.buffer` (GMS2 VM) or `wasmMemory.buffer` (GMS2 YYC) variable, and create a TypedArray class (such as [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), [Int32Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array), etc.) over it to read and write data. 

