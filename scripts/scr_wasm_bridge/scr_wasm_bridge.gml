function scr_wasm_bridge(){}

/*
function run_js_function(fn, params={}) {
	/// feather ignore once GM1017
	var out = get_string("wasmexport-function",json_stringify({fn,params}));
	return json_parse(out).data;
}
 * */

/// @description Run a bundled JavaScript function
/// @param {string} fn Function name as desifned in JS
/// @param {any} params Parameter/s for the function
/// @param {real} output_size Sets size of (static) output buffer
/// @returns {any}
/// 
function run_js_function(fn,params=undefined,output_size = -1) {

    if (!is_wasm_runner()) {
        throw "Can only run on Opera GX"
    }
    
    static input = buffer_create(1024,buffer_grow,1);
    static output = buffer_create(1024,buffer_grow,1);
    
    
    if (output_size != -1) {
        buffer_resize(output,output_size);
    }
    buffer_fill(input,0,buffer_u8,0,buffer_get_size(input));
    buffer_fill(output,0,buffer_u8,0,buffer_get_size(output));
    buffer_seek(input,buffer_seek_start,0);
    buffer_seek(output,buffer_seek_start,0);
    var input_address = buffer_get_address(input);
    var output_address = buffer_get_address(output);
    buffer_write(input,buffer_text,json_stringify(params));
    var str = $"wasmbridge_dataio|{fn}|{input_address}|{output_address}|{buffer_tell(input)}|{buffer_get_size(output)}";
    
    wasm_bridge_data_out(str);
    buffer_seek(input,buffer_seek_start,0);
    var out = buffer_read(output,buffer_string);
	var json = json_parse(out);
	return json[$ "result"];
}

function is_wasm_runner() {
    if (os_type != os_operagx) {
        return false;
    }
    return true;
}

function wasm_bridge_init() {
    // GM_runtime_type = gms2 / gmrt
    // code_is_compiled
    var platform = "gms2";
    if (GM_runtime_type == "gms2") {
        if (code_is_compiled()) {
            platform = "gms2_yyc";
        } else {
            platform = "gms2_vm";
        }
    } else if (GM_runtime_type == "gmrt") {
        if (code_is_compiled()) {
            platform = "gmrt";
        } else {
            platform = "gmrt_vm";
        }
    }
    var str = $"wasmbridge_init|{platform}";
    wasm_bridge_data_out(str);
}

function wasm_bridge_encode_buffer(buffer) {
    return {
        address: buffer_get_address(buffer),
        size: buffer_get_size(buffer),
    }
}

/// @description Pass data out to JS
/// @argument {string} data Data to send
function wasm_bridge_data_out(data) {
    //show_debug_message(data);
    window_set_caption(data);
}

wasm_bridge_init();