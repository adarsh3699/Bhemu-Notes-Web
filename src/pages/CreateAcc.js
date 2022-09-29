import React, { useState } from 'react';
import { apiCall } from "../utils";
import Loader from "../components/Loader";

import {Link,useNavigate} from "react-router-dom"

import {useGoogleLogin} from '@react-oauth/google';
import {useDispatch} from 'react-redux';
import {signup, signupGoogle} from "../redux/actions/auth";

import "../css/loginPage.css";

document.title = "Bhemu Notes | Create Your Account";

function CreateAcc() {
    const [msg, setMsg] = useState("");
    const [isApiLoading, setIsApiLoading] = useState(false);

    const nagivate = useNavigate();
    const dispatch = useDispatch();

    async function handleFormSubmit(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confPassword = e.target.confPassword.value;

        if (email !== "" && password !== "" && confPassword !== "") {
            if (password === confPassword) {
                setIsApiLoading(true);

                const apiResp = await apiCall("auth/signUp", "post", { email, password });
                if (apiResp.statusCode === 200) {
                    setMsg(apiResp.msg)
                    document.location.href = "/";
                } else {
                    setMsg(apiResp.msg)
                }
                setIsApiLoading(false);
            } else {
                setMsg("Passwords didn't match.")
            }
        } else {
            setMsg("Please enter all data.")
        }
    }

    function handleGoogleLoginSuccess(tokenResponse) {

        const accessToken = tokenResponse.access_token;

        dispatch(signupGoogle(accessToken,nagivate))
    }

    const login = useGoogleLogin({onSuccess: handleGoogleLoginSuccess});

    return (
        <div id="background">
            <div id="wrapper">
                <div id='Title'>Create Your Account</div>

                <form className="form" onSubmit={handleFormSubmit}>
                    <input type="email" name='email' placeholder="Email" className='inputBottomMargin' />

                    <input type="Password" name='password' placeholder="Password (8 digit)" pattern="().{8,}" className='inputBottomMargin' />

                    <input type="Password" name='confPassword' placeholder="Confirm Password (8 digit)" pattern="().{8,}" className='inputBottomMargin' />

                    <button id="signup" className={isApiLoading ? "isSignup" : ""} >Sign Up</button>
                    <div id="updateMsg" className="red" style={isApiLoading ? { marginBottom: "0px" } : {}}> {msg} </div>
                    <button onClick={() => login()}>google</button>
                </form>

                <Loader isLoading={isApiLoading} />
                <hr />

                <div id='alreadyAcc' style={isApiLoading ? null : { margin: "25px 0px 5px 0px" }} >
                    <a href="/" >Already have an Account</a>
                </div>
            </div>
        </div>
    )
}

export default CreateAcc;