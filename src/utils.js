async function apiCall(link, isGet ,method, body) {
    try {
        let apiCallResp;
        if (isGet === false) {
            apiCallResp = await fetch(link, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
        } else {
            apiCallResp = await fetch(link);
        }
       
        const apiJsonResp = await apiCallResp.json();
        return apiJsonResp;
    } catch (error) {
        return { error, statusCode: 500 };
    }
}

export { apiCall };