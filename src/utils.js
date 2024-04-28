const { enc, AES, MD5 } = require('crypto-js');

const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;

function encryptText(text) {
	try {
		const encryptedValue = AES.encrypt(text, encryptionKey).toString();
		return encryptedValue;
	} catch (err) {
		console.log(err);
		return null;
	}
}

function decryptText(enryptedValue) {
	let value = null;
	try {
		if (!enryptedValue) throw new Error('enryptedValue is required');
		const decrypted = AES.decrypt(enryptedValue, encryptionKey);
		value = enc.Utf8.stringify(decrypted);
	} catch (err) {
		console.log(err);
		return null;
	}

	return value || [];
}

function md5Hash(text) {
	try {
		return MD5(text).toString();
	} catch (err) {
		console.log(err);
		return null;
	}
}

function userDeviceType() {
	const { innerWidth: width, innerHeight: height } = window;
	if (width > 768) {
		return { mobile: false, desktop: true, width, height };
	} else {
		return { mobile: true, desktop: false, width, height };
	}
}

let USER_DETAILS = localStorage.getItem('user_details')
	? JSON?.parse(
			decryptText(localStorage.getItem('user_details'))?.length === 0
				? '{}'
				: decryptText(localStorage.getItem('user_details'))
	  )
	: {};

export { encryptText, decryptText, md5Hash, userDeviceType, USER_DETAILS };
