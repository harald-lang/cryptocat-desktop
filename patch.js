var cheerio = require('cheerio'),
    fs = require('fs')

var args = process.argv.slice(2);

var source = fs.readFileSync(args[0], "utf8")
var $ = cheerio.load(source)

/* insert title bar */
var titleBar = '<div id="titleBar">\
Cryptocat\
<img id="close" class="button" src="img/close.png" alt="Close"/>\
<img id="minimize" class="button" src="img/minimize.png" alt="Minimize"/>\
</div>'
$('body').prepend(titleBar)

/* insert desktop scripts */
var script = '<script type="application/javascript" src="js/cryptocat-desktop.js"></script>'
$('body').prepend(script)

/* insert styles */
$('head').append('<link rel="stylesheet" media="screen" href="css/style-desktop.css" type="text/css" />')

console.log($.html())