
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
    
    console.log = function(/** @type {string} */ message,...optional) {
        message = `${message}`;
        if (message.startsWith(init_prefix)) {
            const type = message.replace(init_prefix,'');
            if (['gms2_vm','gms2_yyc','gmrt_vm','gmrt'].includes(type)) {
                build_type = type;
                original_console_log(`Detected build type as ${build_type}`);
                original_console_log(message);
            } else {
                alert(`[WASM-BRIDGE] Unknown type ${type} detected!`);
            }
        }
        else if (message.startsWith(lib_prefix)) {
            let components = message.replace(lib_prefix,'').split(delimiter);
            const fn = components[0];
            const input_address = parseInt(components[1],16);
            const output_address = parseInt(components[2],16);
            const input_size = parseInt(components[3]);
            const output_size = parseInt(components[4]);

            
            //original_console_log(`Function: ${fn}\nInput: ${input_address}\nOutput: ${output_address}\nInput size: ${input_size}\nOutput size: ${output_size}`);
            const input_buff = gml_extract_buffer(input_address,input_size);
            const input_json = JSON.parse(decode_uint8array(input_buff));

            const output_json = {
                result: null,
            }; 
            // run function here
            
            if (window.wasmgml[fn] != undefined) {
                output_json.result = window.wasmgml[fn](input_json);
            }
            const output_buff = encoder.encode(JSON.stringify(output_json) + '\0'); // ensure null byte to allow reading via `buffer_string`
            gml_insert_buffer(output_address,output_buff);


        } else {
            original_console_log(message,optional);
        }
    }
})();
