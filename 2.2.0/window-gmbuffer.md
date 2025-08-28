# window.gmbuffer

## window.gmbuffer.get
`window.gmbuffer.get(buffer)`

Returns the buffer specified by the `buffer` argument as an ArrayBuffer

| Name | Type | Description |
| - | - | - |
| `buffer` | BufferPointer | A value returned by [`wasm-bridge-encode-buffer`](wasm-bridge-encode-buffer.md) that describes where the specified buffer is in memory |

Returns: [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)


## window.gmbuffer.set
`window.gmbuffer.set(buffer,newdata)`

Writes the data from `newdata` into buffer specified by the `buffer` argument

| Name | Type | Description |
| - | - | - |
| buffer | BufferPointer | A value returned by [`wasm-bridge-encode-buffer`](wasm-bridge-encode-buffer.md) that describes where the specified buffer is in memory |
| newdata | [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | Data to write into the specified buffer |

Returns: N/A


