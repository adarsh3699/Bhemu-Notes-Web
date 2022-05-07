import Cookies from 'universal-cookie';
const cookies = new Cookies();

const apiBaseUrl = "http://localhost:4000/api/";

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

export { apiCall, getLoggedUserId, setLoggedUserId };