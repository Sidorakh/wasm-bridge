const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

// assume it's enabled - this script *is* running after all

const runner_path = path.join(process.env.YYoutputFolder,'runner','runner.html');
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

$('head').prepend(`<script>\n${inject_js}\n</script>`);

fs.writeFileSync(runner_path,$.html());