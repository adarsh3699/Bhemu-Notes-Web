import Cookies from 'universal-cookie';
import { enc, AES, MD5 } from "crypto-js";

const cookies = new Cookies();

const apiBaseUrl = "http://localhost:4000/api2/";

async function apiCall(endpoint, isGet ,method, body) {
    const apiUrl =  apiBaseUrl + endpoint;
    try {
        let apiCallResp;
        if (isGet === false) {
            apiCallResp = await fetch(apiUrl, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
        } else {
            apiCallResp = await fetch(apiUrl);
        }
       
        const apiJsonResp = await apiCallResp.json();
        return apiJsonResp;
    } catch (error) {
        return { msg: "Something went wrong", statusCode: 500 };
    }
}

function getLoggedUserId() {
    try {
        const myUserId = cookies.get('userId');
        if (myUserId) {
            return myUserId;
        }
    } catch {}

    return null;
}

function setLoggedUserId(userId) {
    try {
        cookies.set('userId', userId);
    } catch {}
}

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

export { apiCall, getLoggedUserId, setLoggedUserId, encryptText, decryptText };