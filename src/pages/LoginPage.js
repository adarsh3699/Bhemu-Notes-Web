import React, { useState, useEffect, useCallback } from 'react';
import { apiCall } from "../utils";
import Loader from "../components/Loader";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { amber } from '@mui/material/colors';
import { useGoogleLogin } from '@react-oauth/google';

import "../css/loginPage.css";
import logo from "../img/logoBig.png"
import googleLogo from "../img/google.svg"


function LoginPage() {
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [ispasswordVisible, setIspasswordVisible] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("user_info")) {
            const authorization = JSON.parse(localStorage.getItem("user_info"))?.jwt
            console.log(authorization);
            document.location.href = "/home";
        } else {
            setIsLoading(false);
        }
    }, []);

    const handlePasswordVisibility = useCallback(() => {
        setIspasswordVisible(!ispasswordVisible)
    }, [ispasswordVisible])

    const handleUserLogin = useCallback(async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (email !== "" && password !== "") {
            setIsApiLoading(true);
            const apiResp = await apiCall("users/signin", "post", { email, password });

            if (apiResp.statusCode === 200) {
                const userInfo = { jwt: apiResp.jwt, details: apiResp.details };
                localStorage.setItem('user_info', JSON.stringify(userInfo));
                document.location.href = "/home";
            } else {
                setMsg(apiResp.msg)
            }
            setIsApiLoading(false);
        } else {
            setMsg("Please Enter Your Email and Password")
        }
    }, [])

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const accessToken = tokenResponse.access_token;
            setIsApiLoading(true);
            const apiResp = await apiCall("users/signin", "post", { googleAccessToken: accessToken });
            if (apiResp.statusCode === 200) {
                const userInfo = { jwt: apiResp.jwt, details: apiResp.details };
                localStorage.setItem('user_info', JSON.stringify(userInfo));

                document.location.href = "/home";
            } else {
                setMsg(apiResp.msg)
            }
            setIsApiLoading(false);

        }
    });

    return (
        <>
            {
                !isLoading &&
                <div id="background">
                    <div id="wrapper">
                        <img id='myLogo' src={logo} alt="" />
                        <div id='Title'>Bhemu Notes</div>
                        <form className="form" onSubmit={handleUserLogin}>
                            <input type="email" name='email' placeholder="Email" disabled={isApiLoading} className="inputBottomMargin" />
                            <input type={ispasswordVisible ? "text" : "password"} name='password' placeholder="Password" disabled={isApiLoading} className="" />

                            <FormControlLabel
                                id='showPassword'
                                control={
                                    <Checkbox
                                        onClick={handlePasswordVisibility}
                                        sx={{
                                            color: amber[400],
                                            '&.Mui-checked': {
                                                color: amber[600],
                                            }
                                        }}
                                    />}
                                label="Show password"
                            />

                            <button id="login" className={isApiLoading ? "isLogin" : ""} >Login</button>
                        </form>



                        <div id="msg" className="red" style={isApiLoading ? { marginBottom: "0px" } : {}}> {msg} </div>
                        <Loader isLoading={isApiLoading} />
                        <a href="/forget-password" id='forgotPass'>Forgotten Password</a>

                        <hr />
                        <div onClick={login} id="googleBtn">
                            <img id='googleLogo' src={googleLogo} alt="" />
                            <div id='googleBtnName'>Sign in with Google</div>
                        </div>
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