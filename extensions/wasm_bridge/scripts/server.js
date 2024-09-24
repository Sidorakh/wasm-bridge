const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const JSZip = require('jszip'); // for modifying the output zip file
// assume it's enabled - this script *is* running after all

fs.writeFileSync(path.join(__dirname,'../','../','../','.env'),Object.entries(process.env).map(e=>`${e[0]}=${e[1]}`).join('\n'))


let runner_path = path.join(process.env.YYoutputFolder,'runner','runner.html');
if (!fs.existsSync(runner_path)) {
    runner_path = path.join(process.env.YYoutputFolder,'runner','index.html');
}
const runner_html = fs.readFileSync(runner_path,'utf8');

const inject_js = fs.readFileSync(path.join(__dirname,'ext-setup.js'),'utf8');

const $ = cheerio.load(runner_html);
const files = fs.readdirSync(path.join(__dirname,'libraries'));

fs.mkdirSync(path.join(process.env.YYoutputFolder,'runner','libraries'));

for (const file of files) {
    if (file.endsWith('.js')) {
        $('head').prepend(`\n<!-- ${file} -->\n<script src="./libraries/${file}"></script>\n`);
        fs.copyFileSync(path.join(__dirname,'libraries',file),path.join(process.env.YYoutputFolder,'runner','libraries',file));
        
    }
}

$('head').prepend(`\n<script>\n${inject_js}\n</script>`);

fs.writeFileSync(runner_path,$.html());
let is_post_package = false;
for (const arg of process.argv.slice(2)) {
    if (arg.includes('postpackage')) {
        console.log('we are IN THE POST PACKAGE STEP BOIIIIIII WOOOO!!');
        console.log(`Target File: ${process.env.YYtargetFile}`);
        is_post_package = true;
        
        fs.copyFileSync(process.env.YYtargetFile, path.join(__dirname,'game.zip'));
    }

}

if (is_post_package) {
    (async()=>{
        const data = fs.readFileSync(process.env.YYtargetFile);
        const zip = await JSZip.loadAsync(data);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const js = fs.readFileSync(path.join(__dirname,'libraries',file));
                zip.file(`libraries/${file}`,js);
            }
        }
        zip.file('index.html',$.html());
        const final = await zip.generateAsync({type: 'nodebuffer'});
        fs.writeFileSync(process.env.YYtargetFile,final);

        console.log('Overwritten final zip file - pausing');
        //fs.copyFileSync(process.env.YYtargetFile, path.join(__dirname,path.basename(process.env.YYtargetFile)));
        process.exit(0);
    })();

}