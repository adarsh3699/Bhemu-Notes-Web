import React, { useState, useEffect, useCallback } from 'react';
import { apiCall, setLoggedUserId } from "../utils";
import Loader from "../components/Loader";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { amber } from '@mui/material/colors';
import { useGoogleLogin } from '@react-oauth/google';

import "../css/loginPage.css";
import logo from "../img/logoBig.png"


function LoginPage() {
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [ispasswordVisible, setIspasswordVisible] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("user_info")) {
            const authorization = JSON.parse(localStorage.getItem("user_info")).jwt
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
                const userId = apiResp?.data[0]?._id;
                if (userId) {
                    setLoggedUserId(userId)
                    document.location.href = "/home";
                    return;
                } else {
                    setMsg("Please Check Your Email or Password")
                }
            } else {
                setMsg(apiResp.message)
            }
            setIsApiLoading(false);
        } else {
            setMsg("Please Enter Your Email and Password")
        }
    }, [])

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            const accessToken = tokenResponse.access_token;

            const apiResp = await apiCall("users/signin", "post", { googleAccessToken: accessToken });
            localStorage.setItem('user_info', JSON.stringify({ ...apiResp }));
            document.location.href = "/home";
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
                            <button onClick={login}>google</button>
                        </form>



                        <div id="msg" className="red" style={isApiLoading ? { marginBottom: "0px" } : {}}> {msg} </div>
                        <Loader isLoading={isApiLoading} />
                        <a href="/forget-password" id='forgotPass'>Forgotten Password</a>

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