var cheerio = require('cheerio'),
    fs = require('fs')

var args = process.argv.slice(2);

var source = fs.readFileSync(args[0], "utf8")
var $ = cheerio.load(source)

/* insert dev tools scripts */
var script = '<script type="application/javascript" src="js/cryptocat-desktop-dev.js"></script>'
$('body').prepend(script)

console.log($.html())