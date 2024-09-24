window.wasmgml = window.wasmgml || {};
const original_prompt = window.prompt;
window.prompt = (q,d)=>{
    if (q == 'wasmexport-function') {
        const {fn,params} = JSON.parse(d);
        if (window.wasmgml[fn]) {
            return window.wasmgml[fn](params);
        }
    } else {
        return original_prompt(q,d);
    }
}