import React, { useState, useEffect, useCallback } from 'react';
import { apiCall, getLoggedUserId, setLoggedUserId } from "../utils";
import Loader from "../components/Loader";

import "../css/loginPage.css";
import logo from "../img/logoBig.png"

function LoginPage() {
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

    const handleUserLogin = useCallback(async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (email !== "" && password !== "") {
            setIsApiLoading(true);
            const apiResp = await apiCall("auth/login", "post", { email, password });

            if (apiResp.statusCode === 200) {
                const userId = apiResp?.data[0]?._id;
                if (userId) {
                    setLoggedUserId(userId)
                    document.location.href = "/home";
                    return;
                } else {
                    setMsg("Please Check Your Email or Password")
                }
            } else {
                setMsg(apiResp.msg)
            }
            setIsApiLoading(false);
        } else {
            setMsg("Please Enter Your Email and Password")
        }
    }, [])

    return (
        <>
            {
                isLoading ? null
                    :
                    <div id="background">
                        <div id="wrapper">
                            <img id='myLogo' src={logo} alt="" />
                            <div id='Title'>Bhemu Notes</div>
                            <form id="form" onSubmit={handleUserLogin}>
                                <input type="email" name='email' placeholder="Email" id="userName" />
                                <br />
                                <input type="password" name='password' placeholder="Password" id="password" />
                                <br />
                                <button id="login" className={isApiLoading ? "isLogin" : ""} >Login</button>

                                <div id="msg" className="red" style={isApiLoading ? { marginBottom: "0px" } : {}}> {msg} </div>
                                <Loader isLoading={isApiLoading} />
                                <a href="/forget-password" id='forgotPass'>Forgotten Password</a>
                            </form>
                            <hr />

                            <a href="/register">
                                <div id="createAcc">Create New Account</div>
                            </a>
                        </div>
                    </div>
            }
        </>
    )
}

export default LoginPage;