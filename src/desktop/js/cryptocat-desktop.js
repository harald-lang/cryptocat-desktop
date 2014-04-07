/* open link in an external window */
function openLink(url) {
	var gui = require('nw.gui')
	gui.Shell.openExternal(url)
}

/*
Override audio file extension to .ogg because Node-webkit does not support .mp3.
I will be better if Cryptocat would use Vorbis sound files by default.
*/
Cryptocat.audioExt = '.ogg'
Cryptocat.sounds = {
	'keygenStart': (new Audio('snd/keygenStart' + Cryptocat.audioExt)),
	'keygenLoop':  (new Audio('snd/keygenLoop'  + Cryptocat.audioExt)),
	'keygenEnd':   (new Audio('snd/keygenEnd'   + Cryptocat.audioExt)),
	'userLeave':   (new Audio('snd/userLeave'   + Cryptocat.audioExt)),
	'userJoin':    (new Audio('snd/userJoin'    + Cryptocat.audioExt)),
	'msgGet':      (new Audio('snd/msgGet'      + Cryptocat.audioExt)),
	'balloon':     (new Audio('snd/balloon'     + Cryptocat.audioExt))
}

/* 
Override hyperlink handling.
In Node-webkit we want the links to be opened externally.
*/
openLinksExternally = function(message) {
	var sanitize
	var URLs = message.match(/((http(s?)\:\/\/){1}\S+)/gi)
	if (!URLs) { return message }
	for (var i = 0; i !== URLs.length; i++) {
		sanitize = URLs[i].split('')
		for (var l = 0; l !== sanitize.length; l++) {
			if (!sanitize[l].match(
				/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;|\%/)
			) {
				sanitize[l] = encodeURIComponent(sanitize[l])
			}
		}
		sanitize = sanitize.join('')
		var url = sanitize.replace(':', '&colon;')
		if (navigator.userAgent === 'Chrome (Mac app)') {
			message = message.replace(
				sanitize, '<a href="' + url + '">' + url + '</a>'
			)
			continue
		}
		message = message.replace(
			//sanitize, '<a href="' + url + '" onclick="openLink(\'' + url + '\');" target="_blank">' + url + '</a>'
			sanitize, '<a onclick="openLink(\'' + url + '\');" target="_blank">' + url + '</a>'
		)
	}
	return message
}

/*
Additional interface bindings
*/
function close() {
	var closeWin = function() {
		var gui = require('nw.gui')
		var win = gui.Window.get()
        win.close(true)
	}
	if (Cryptocat.xmpp.connection !== null) {
		setTimeout(closeWin, 2000)
		Cryptocat.logout()
	} else {
		closeWin()
	}
}

function minimize() {
	var gui = require('nw.gui')
	var win = gui.Window.get()
	win.minimize()
}

setTimeout(function() {
    $('#close').click(close)
    $('#minimize').click(minimize)    
    Cryptocat.addLinks = openLinksExternally
}, 100)
