# run_js_function

`run_js_function(fn, params={}, output_size=-1)`

Attempts to run JavaScript function `fn`, with the given `params` struct, and optionally, set the size of the `output` buffer


| Name | Type | Description |
| - | - | - | 
| fn | String | Name of the function on `window.wasmgml` to call |
| params | Struct | Struct to be pased to the function called as a JSON object |
| output_size | Real | Sets the size of the output buffer - use this if it needs to be at least a certain size, or leave it out or at `-1` to not change its size |

Returns: Any

Example usage:
```js
run_js_function("native_share_dialog",{url: "https://gamemaker.io", title: "GameMaker", text: "GameMaker is a great game development tool"});
```



IMPORTANT: The `input` and `output` structs are both Grow buffers and are 1024 bytes long by default. When data is passed back into GameMaker, the data is encoded into JSON first to ensure types are kept intact, ensure you leave enough overhead for a small JSON wrapper. For example, a response from the sample `get-user-agent.js` file an extra 11 bytes are added to the output (whitespace added for readability): 

```json
{
    "result": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
}
```

The data contained within the `result` key is passed back directly to your code, so you do not need to deal with this intermediary struct at all.


