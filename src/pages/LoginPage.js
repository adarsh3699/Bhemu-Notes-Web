import React, { useState, useEffect } from 'react';
import { apiCall, getLoggedUserId, setLoggedUserId } from "../utils";
import Loader from "../components/Loader";
import "../css/login.css";

function LoginPage() {
    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isApiLoading, setIsApiLoading] = useState(false);

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
            setIsApiLoading(true);
            const apiResp = await apiCall("users?userName=" + userName + "&password=" + password);
            if (apiResp.statusCode === 200) {
                setIsApiLoading(false);
                const userId = apiResp?.data[0]?._id;
                if (userId) {
                    setLoggedUserId(userId)
                    document.location.href = "/home";
                    return;
                } else {
                    setMsg("Please Check Your UserName or Password")
                }
            } else {
                setIsApiLoading(false);
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
                                    <button id="login" className={isApiLoading? "isLogin": "" }>Login</button>
                                </div>

                                <div id="msg" className="red" > {msg} </div>
                                <Loader isLoading={isApiLoading} />
                                <hr style={isApiLoading? { marginTop: "10px" }: null } />

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