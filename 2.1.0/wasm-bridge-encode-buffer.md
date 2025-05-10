# wasm_bridge_encode_buffer

`wasm_bridge_encode_buffer(buffer)`

Packages up data about the specified [GameMaker Buffer](https://manual.gamemaker.io/monthly/en/GameMaker_Language/GML_Reference/Buffers/Buffers.htm) into a struct designed to work with the [`window.gmbuffer`](window-gmbuffer.md) functions in JavaScript


| Name | Type | Description |
| - | - | - | 
| buffer | Id.Buffer | Buffer ID to encode |

Returns: Struct
```js
// Return Struct
{
    address: String,
    size: Number,
}
```


Example usage:
```js
buffer = buffer_create(2048,buffer_fixed,1);
var encoded = wasm_bridge_encode_buffer(buffer);
run_js_function("function-that-uses-a-buffer",{buffer: buffer});
```
