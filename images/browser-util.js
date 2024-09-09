const BROWSER_UTIL = {
	sessionCookie: 'session-aa',
	sessionLength: 1000 * 60 * 60 * 24 * 14,
	remoteUrl: window.location.host.match('localhost:') ?
		'http://localhost:3002' : 'https://alexa-anderson.com'
};

function getCookie(key) {
	const cookies = document.cookie.split('; ');
	for (var i = 0; i < cookies.length; i++) {
		var cookieset = cookies[i].split('=');
		if (cookieset[0] === key) return cookieset[1];
	}
}

function setCookie(key, value, expires) {
	if (!expires) {
		expires = new Date();
		expires.setTime(expires.getTime() + BROWSER_UTIL.sessionLength);
	}
	document.cookie = key +"="+ escape(value) +
		";domain="+ window.location.hostname +
		";path=/"+
		";expires="+expires.toUTCString();
}

function clearCookie(key) {
	setCookie(key, "", new Date());
}

function shuffleString(string) {
	if (typeof string !== 'string') return '';
	const letters = string.split('');
	const length = letters.length;
	for (let i = 0; i < length; i++) {
		let j = Math.floor(Math.random() * (i + 1));
		let tmp = letters[i];
		letters[i] = letters[j];
		letters[j] = tmp;
	}
	return letters.join("");
}

function manageSession() {
	let sessionId = getCookie(BROWSER_UTIL.sessionCookie);

	if (!sessionId) {
		sessionId = new Date().getTime() + shuffleString('zyxwvut');
	}

	setCookie(BROWSER_UTIL.sessionCookie, sessionId);
}

function registerLoad() {
	const postbody = {
		event: 'windowload',
		meta: { sessionId: getCookie(BROWSER_UTIL.sessionCookie) }
	};

	fetch(`${BROWSER_UTIL.remoteUrl}/tracking`, {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(postbody)
	}).then(console.log).catch(console.error)
}

function windowOnload() {
	manageSession();
	registerLoad();
}