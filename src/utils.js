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
        const decrypted = AES.decrypt(enryptedValue, encryptionKey);
        value = enc.Utf8.stringify(decrypted);
    } catch (err) {
        console.log(err);
        return null;
    }

    return value;
}

function md5Hash(text) {
    try {
        return MD5(text).toString();
    } catch (err) {
        console.log(err);
        return null;
    }
}

// function handleMsgAndBtnLoading(setMsg, msg, setIsApiLoading) {
//     if (!msg) return console.log('Please set your msg');
//     setIsApiLoading(false);
//     setMsg(msg);
// }

export { encryptText, decryptText, md5Hash };
