window.wasmgml.native_share_dialog = async (params) => {
    try {
        await navigator.share(params);
    } catch(e) {

    }
};