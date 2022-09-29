import React, { useState, useEffect, useCallback } from 'react';
import { apiCall, getLoggedUserId, setLoggedUserId } from "../utils";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { amber } from '@mui/material/colors';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import {useDispatch} from 'react-redux';
import {signinGoogle, signin} from "../redux/actions/auth";

import "../css/loginPage.css";
import logo from "../img/logoBig.png"

function LoginPage() {
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [ispasswordVisible, setIspasswordVisible] = useState(false);

    const navigate = useNavigate ()
    const dispatch = useDispatch()


    useEffect(() => {
        if (getLoggedUserId()) {
            document.location.href = "/home";
            return;
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

    function handleGoogleLoginSuccess(tokenResponse) {
        console.log(tokenResponse);
        const accessToken = tokenResponse.access_token;

        dispatch(signinGoogle(accessToken,navigate))
    }
    const login = useGoogleLogin({onSuccess: handleGoogleLoginSuccess});

    function handleSubmit(e){
        const email = e.target.email.value;
        const password = e.target.password.value;
        e.preventDefault();
        if(email !== "" && password !== ""){
            dispatch(signin({email,password}, navigate))
        }

    }

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
                            <button onClick={() => login()}>google</button>
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