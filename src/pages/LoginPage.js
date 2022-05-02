import React, { useState, useEffect } from 'react';
import { apiCall, getLoggedUserId, setLoggedUserId } from "../utils";
import "../css/login.css";

function LoginPage() {
    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (getLoggedUserId()) {
            document.location.href = "/home";
            return;
        } else {
            setIsLoading(false);
        }
    }, []);

    function handleUserNameChange(e) {
        setuserName(e.target.value)
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value)
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        if (userName !== "" && password !== "") {
            const apiResp = await apiCall("users?userName=" + userName + "&password=" + password);
            if (apiResp.statusCode === 200) {
                const userId = apiResp?.data[0]?.id;
                if (userId) {
                    setLoggedUserId(userId)
                    document.location.href = "/home";
                    return;
                } else {
                    setMsg(apiResp.msg)
                }
            } else {
                setMsg(apiResp.msg)
            }
        } else {
            setMsg("Please enter Your Username and Password")
        }
    }

    return (
        <>
            {
                isLoading ? null
                    :
                    <div id="background">
                        <div id="wrapper">
                            <form id="form" onSubmit={handleFormSubmit}>
                                <div>
                                    <input type="text" placeholder="User Name" id="userName" value={userName} onChange={handleUserNameChange} />
                                </div>

                                <div>
                                    <input type="password" placeholder="Password" id="password" value={password} onChange={handlePasswordChange} />
                                </div>

                                <div>
                                    <button id="login">Login</button>
                                </div>

                                <div id="msg" className="red" > {msg} </div>
                                <hr />

                                <a href="/register">
                                    <div id="createAcc">Create New Account</div>
                                </a>
                            </form>
                        </div>
                    </div>
            }
        </>
    )
}

export default LoginPage;