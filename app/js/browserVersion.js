/**
 * add "browser version" classes to <html> element
 */
var parser = new UAParser();

var uaResult = parser.getResult();
var browserName = uaResult.browser.name.toLowerCase();
var browserVersion = uaResult.browser.major;
var browserString = '';

switch(browserName) {
	case 'ie':
		if (browserVersion === '6') {
			browserString = browserName + ' ie6 ielt8 ielt9';
		} else if (browserVersion === '7') {
			browserString = browserName + ' ie7 ielt8 ielt9';
		} else if (browserVersion === '8') {
			browserString = browserName + ' ie8 ielt9';
		} else if (browserVersion === '9') {
			browserString = browserName + ' ie9';
		} else {
			browserString = browserName;
		}
		break;
	case 'mobile safari':
		browserString = browserName.replace(' ', '');
		browserString += ' ' + uaResult.device.model;
		browserString += ' ' + uaResult.os.name;
		break;
	default:
		browserString = browserName;
}

var htmlTag = document.getElementsByTagName('html');
var classesHtmlTag = '';

if (htmlTag[0].className !== '') {
	classesHtmlTag = htmlTag[0].className;
}

htmlTag[0].className = browserString + classesHtmlTag;
