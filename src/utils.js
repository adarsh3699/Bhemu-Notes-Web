import Cookies from 'universal-cookie';
const cookies = new Cookies();

const apiBaseUrl = "https://bhemu-notes.herokuapp.com/api/"
// const apiBaseUrl = "http://localhost:4000/api/";

// variables for setting cookie expiratiom tym
const COOKIE_EXPIRATION_MINS = 30 * 24 * 60; // 30 days

let COOKIE_EXPIRATION_TYM = new Date();
COOKIE_EXPIRATION_TYM.setTime(COOKIE_EXPIRATION_TYM.getTime() + (COOKIE_EXPIRATION_MINS * 60 * 1000));
const COOKIE_EXPIRATION_TIME = COOKIE_EXPIRATION_TYM;

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
        cookies.set('userId', userId, { path: "/", expires: COOKIE_EXPIRATION_TIME });
    } catch {}
}

function validateUsername(name) {
    var re = /^[a-zA-Z0-9_]*$/;
    return re.test(name);
}

export { apiCall, getLoggedUserId, setLoggedUserId, validateUsername };