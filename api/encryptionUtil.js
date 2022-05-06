const { enc, AES, MD5 } = require("crypto-js");

const encryptionKey = "bhemu_is_kutta";

function encryptText(text) {
    try {
        const encryptedValue = AES.encrypt(text, encryptionKey).toString();
        return encryptedValue;
    } catch {
        return null;
    }
}

function decryptText(enryptedValue) {
    let value = null;
    try {
        const decrypted = AES.decrypt(enryptedValue, encryptionKey);
        value = enc.Utf8.stringify(decrypted);
    } catch {
        return null;
    }

    return value;
}

function md5Hash(text) {
    try {
        return MD5(text).toString();
    } catch {
        return null;
    }
}

module.exports = { encryptText, decryptText, md5Hash };