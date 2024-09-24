/// @description 
if (keyboard_check_pressed(ord("1"))) {
	run_js_function("native_share_dialog",{text: "Hello, world!"}); 
}
if (keyboard_check_pressed(ord("2"))) {
	show_message(run_js_function("get_user_agent"));
}