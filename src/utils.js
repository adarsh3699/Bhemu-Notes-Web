import Cookies from 'universal-cookie';
const cookies = new Cookies();

const apiBaseUrl = 'https://bhemu-notes.herokuapp.com/';
// const apiBaseUrl = 'http://localhost:4000/';

// variables for setting cookie expiratiom tym
const COOKIE_EXPIRATION_MINS = 30 * 24 * 60; // 30 days

let COOKIE_EXPIRATION_TYM = new Date();
COOKIE_EXPIRATION_TYM.setTime(COOKIE_EXPIRATION_TYM.getTime() + COOKIE_EXPIRATION_MINS * 60 * 1000);
const COOKIE_EXPIRATION_TIME = COOKIE_EXPIRATION_TYM;

async function apiCall(endpoint, method, body) {
    const apiUrl = apiBaseUrl + endpoint;
    try {
        let apiCallResp;
        const authorization = localStorage.getItem('JWT_token');

        if (method === 'GET' || method === undefined) {
            apiCallResp = await fetch(apiUrl, {
                headers: { Authorization: 'Bearer ' + authorization },
            });
        } else {
            apiCallResp = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authorization,
                },
                body: JSON.stringify(body),
            });
        }

        const apiJsonResp = await apiCallResp.json();
        return apiJsonResp;
    } catch (error) {
        return { msg: 'Something went wrong', statusCode: 500 };
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
        cookies.set('userId', userId, { path: '/', expires: COOKIE_EXPIRATION_TIME });
    } catch {}
}

// function validateUsername(name) {
//     var re = /^[a-zA-Z0-9_]*$/;
//     return re.test(name);
// }

export { apiCall, getLoggedUserId, setLoggedUserId };
