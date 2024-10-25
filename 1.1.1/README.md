# Home

<center>
<p>
    WASM Bridge : include JavaScript extensions with your WebAssembly games
</p>

[Download the latest version here](https://github.com/Sidorakh/wasm-bridge/releases/)
</center>

# Features
- Allows you to expose JavaScript functions in your Web Assembly exports
- Allows returning any datatype that can fit in JSON

---

# Prerequisites
- Windows only at the moment
- Requires GameMaker 24.1100 or later (the first version with native WASM export). 
- Requires Node.JS v20 and npm in system PATH to run (later versions may work)
- Utilises [`jszip`](https://www.npmjs.com/package/jszip) and [`cheerio`](https://www.npmjs.com/package/cheerio)

---


# Limitations

This does not work when expoorting directly to GX.Games. 


# Why was WASM Bridge made?
I wanted to use JavaScript extensions. That's it. 

---

# What license is activity.gml released under?
This library was released under the [MIT license](https://github.com/Sidorakh/wasm-bridge/blob/main/LICENSE)
