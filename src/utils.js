const { enc, AES, MD5 } = require('crypto-js');

const apiBaseUrl = 'https://helpful-blue-bighorn-sheep.cyclic.app/';
// const apiBaseUrl = 'http://localhost:4000/';

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

// function validateUsername(name) {
//     var re = /^[a-zA-Z0-9_]*$/;
//     return re.test(name);
// }

// async function apiCall(endpoint, method, body) {
//     const apiUrl = apiBaseUrl + endpoint;
//     try {
//         let apiCallResp;
//         const authorization = localStorage.getItem('JWT_token');

//         if (method === 'GET' || method === undefined) {
//             apiCallResp = await fetch(apiUrl, {
//                 headers: { Authorization: 'Bearer ' + authorization },
//             });
//         } else {
//             apiCallResp = await fetch(apiUrl, {
//                 method: method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: 'Bearer ' + authorization,
//                 },
//                 body: JSON.stringify(body),
//             });
//         }

//         const apiJsonResp = await apiCallResp.json();
//         return apiJsonResp;
//     } catch (error) {
//         return { msg: 'Something went wrong', statusCode: 500 };
//     }
// }

// function extractEncryptedToken(token) {
//     try {
//         var base64Url = token.split('.')[1];
//         var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         var jsonPayload = decodeURIComponent(
//             window
//                 .atob(base64)
//                 .split('')
//                 .map(function (c) {
//                     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//                 })
//                 .join('')
//         );
//         return JSON.parse(jsonPayload);
//     } catch (err) {
//         console.log(err);
//     }
// }

export { encryptText, decryptText, md5Hash };
