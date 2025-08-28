
/*
window.wasmgml = window.wasmgml || {};
const original_prompt = window.prompt;
window.prompt = (q,d)=>{
    if (q == 'wasmexport-function') {
        const {fn,params} = JSON.parse(d);
        if (window.wasmgml[fn]) {
            return JSON.stringify({data: window.wasmgml[fn](params)});
        } else {
            return JSON.stringify({data: ""});
        }
    } else {
        return original_prompt(q,d);
    }
}
*/
/**
 * @typedef {Object} BufferPointer
 * @property {string} address
 * @property {number} size
 */

window.gmbuffer = {
    type: '',
    get(/** @type {BufferPointer} */ buffer) {
        const address = parseInt(buffer.address,16);
        const size = buffer.size;
        if (window.gmbuffer.type == 'gms2_vm') {
            const view = new Uint8Array(mb.buffer);
            return view.slice(address,address+size).buffer;
        }
        if (window.gmbuffer.type == 'gms2_yyc') {
            const view = new Uint8Array(wasmMemory.buffer);
            return view.slice(address,address+size).buffer;
        }
        if (window.gmbuffer.type == '') {
            throw new Error(`[WASM Bridge] Tried to read from a buffer before initialising the extension`);
        }
        throw new Error(`[WASM Bridge] Invalid GameMaker build type '${window.gmbuffer.type}'`);
    },
    set(/** @type {BufferPointer} */ buffer,/** @type {ArrayBufferLike} */ newdata){
        const address = parseInt(buffer.address,16);
        if (buffer.size < newdata.size) {
            throw new Error(`[WASM Bridge] Attempted to write data to outside the target buffer`);
        }
        if (window.gmbuffer.type == 'gms2_vm') {
            const view = new Uint8Array(mb.buffer);
            view.set(newdata,address);
        }
        if (window.gmbuffer.type == 'gms2_yyc') {
            const view = new Uint8Array(wasmMemory.buffer);
            view.set(newdata,address);
        }
        if (window.gmbuffer.type == '') {
            throw new Error(`[WASM Bridge] Tried to write to a buffer before initialising the extension`)
        }
        throw new Error(`[WASM Bridge] Invalid GameMaker build type '${window.gmbuffer.type}'`);
    },
};
window.wasmgml = window.wasmgml || {};
(function(){
    const lib_prefix = `wasmbridge_dataio|`;
    const init_prefix = 'wasmbridge_init|';
    const delimiter = '|';
    const original_console_log = console.log;

    /** @type {'gms2_vm'|'gms2_yyc'|'gmrt_vm'|'gmrt'} */
    let build_type = 'gms2_vm';     // build type - gms2_vm, gms2_yyc, gmrt_vm, gmrt - each may require different handling

    // build textencoder and textdecoder for input processing
    const encoder = new TextEncoder();
    const decoder = new TextDecoder('utf8');

    const gml_extract_buffer = (/** @type {number} */ address,/** @type {number} */ length)=>{
        if (build_type == 'gms2_vm') {
            const view = new Uint8Array(mb.buffer);
            return view.slice(address,address+length);
        }
        if (build_type == 'gms2_yyc') {
            const view = new Uint8Array(wasmMemory.buffer);
            return view.slice(address,address+length);
        }
    }

    const gml_insert_buffer = (/** @type {number} */ address, /** @type {Uint8Array} */ data)=>{
        if (build_type == 'gms2_vm') {
            const view = new Uint8Array(mb.buffer);
            view.set(data,address);
        }
        if (build_type == 'gms2_yyc') {
            const view = new Uint8Array(wasmMemory.buffer);
            view.set(data,address);
        }
    }

    const decode_uint8array = (/** @type {ArrayBufferLike} */ array) => {
        // will probably have more checks here
        return decoder.decode(array);
    }
    let title = document.title;
    Object.defineProperty(document,'title',{
        get(){
            return title;
        },
        set(/** @type {string} */ v) {
            if (v.startsWith(init_prefix)) {
                const type = v.replace(init_prefix,'');
                if (['gms2_vm','gms2_yyc','gmrt_vm','gmrt'].includes(type)) {
                    build_type = type;
                    console.log(`[WASM-BRIDGE] Detected build type as \`${build_type}\``);
                } else {
                    console.error(`[WASM-BRIDGE] Unsupported build type \`${type}\` detected`);
                }
            } else if (v.startsWith(lib_prefix)) {
                const components = v.replace(lib_prefix,'').split(delimiter);
                const fn = components[0];
                const input_address = parseInt(components[1],16);
                const output_address = parseInt(components[2],16);
                const input_size =  parseInt(components[3]);
                const output_size =  parseInt(components[4]);

                const input_buff = gml_extract_buffer(input_address,input_size);
                const input_json = JSON.parse(decode_uint8array(input_buff));

                const output_json = {
                    result: null,
                };

                if (window.wasmgml[fn] != undefined) {
                    if (Array.isArray(input_json)) {
                        output_json.result = window.wasmgml[fn](...input_json);
                    } else {
                        output_json.result = window.wasmgml[fn](input_json);
                    }
                }

                const output_buff = encoder.encode(JSON.stringify(output_json) + '\0'); // ensure null byte to allow reading via `buffer_string`
                gml_insert_buffer(output_address,output_buff);
            } else {
                title = v; 
                const el = document.head.querySelector('title')
                if (el) {
                    el.innerText = v;
                }
            }
        }
    });
})();
