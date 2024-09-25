function scr_wasm_bridge(){}

function run_js_function(fn, params={}) {
	/// feather ignore once GM1017
	var out = get_string("wasmexport-function",json_stringify({fn,params}));
	return json_parse(out).data;
}