import React, { useState, useEffect, useCallback } from 'react';
import { apiCall, extractEncryptedToken } from '../utils';
import Loader from '../components/Loader';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { amber } from '@mui/material/colors';
import { useGoogleLogin } from '@react-oauth/google';

import '../css/loginPage.css';
import logo from '../img/logoBig.png';
import googleLogo from '../img/google.svg';

function LoginPage() {
    const [msg, setMsg] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [ispasswordVisible, setIspasswordVisible] = useState(false);

    useEffect(() => {
        if (
            localStorage.getItem('JWT_token') &&
            localStorage.getItem('user_details') &&
            localStorage.getItem('login_info')
        ) {
            document.location.href = '/home';
        } else {
            setIsLoading(false);
            localStorage.clear();
        }
    }, []);

    const handlePasswordVisibility = useCallback(() => {
        setIspasswordVisible(!ispasswordVisible);
    }, [ispasswordVisible]);

    const handleUserLogin = useCallback(async (e) => {
        e.preventDefault();
        setMsg('');
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (email !== '' && password !== '') {
            setIsApiLoading(true);
            const apiResp = await apiCall('auth/signin', 'post', { email, password });

            if (apiResp.statusCode === 200) {
                const extractedToken = extractEncryptedToken(apiResp.jwt);
                const userDetails = { ...apiResp.details, email: extractedToken?.email };

                localStorage.setItem('user_details', JSON.stringify(userDetails));
                localStorage.setItem('JWT_token', apiResp.jwt);
                localStorage.setItem('login_info', apiResp.loginInfo);
                document.location.href = '/home';
            } else {
                setMsg(apiResp.msg);
            }
            setIsApiLoading(false);
        } else {
            setMsg('Please Enter Your Email and Password');
        }
    }, []);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const accessToken = tokenResponse.access_token;
            setIsApiLoading(true);
            const apiResp = await apiCall('auth/signin/google', 'post', { googleAccessToken: accessToken });
            if (apiResp.statusCode === 200) {
                const extractedToken = extractEncryptedToken(apiResp.jwt);

                const userDetails = { ...apiResp.details, email: extractedToken?.email };

                localStorage.setItem('user_details', JSON.stringify(userDetails));
                localStorage.setItem('JWT_token', apiResp.jwt);
                localStorage.setItem('login_info', apiResp.loginInfo);
                document.location.href = '/home';
            } else {
                setMsg(apiResp.msg);
            }
            setIsApiLoading(false);
        },
    });

    return (
        <>
            {!isLoading && (
                <div id="background">
                    <div id="wrapper">
                        <img id="myLogo" src={logo} alt="" />
                        <div id="Title">Bhemu Notes</div>
                        <form className="form" onSubmit={handleUserLogin}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                disabled={isApiLoading}
                                className="inputBottomMargin"
                            />
                            <input
                                type={ispasswordVisible ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                disabled={isApiLoading}
                                className=""
                            />

                            <FormControlLabel
                                id="showPassword"
                                control={
                                    <Checkbox
                                        onClick={handlePasswordVisibility}
                                        sx={{
                                            color: amber[400],
                                            '&.Mui-checked': {
                                                color: amber[600],
                                            },
                                        }}
                                    />
                                }
                                label="Show password"
                            />

                            <button id="login" className={isApiLoading ? 'isLogin' : ''}>
                                Login
                            </button>
                        </form>

                        <div id="msg" className="red" style={isApiLoading ? { marginBottom: '0px' } : {}}>
                            {' '}
                            {msg}{' '}
                        </div>
                        <Loader isLoading={isApiLoading} />
                        <a href="/forget-password" id="forgotPass">
                            Forgotten Password
                        </a>

                        <hr />
                        <div onClick={googleLogin} id="googleBtn">
                            <img id="googleLogo" src={googleLogo} alt="" />
                            <div id="googleBtnName">Sign in with Google</div>
                        </div>
                        <a href="/register">
                            <div id="createAcc">Create New Account</div>
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}

export default LoginPage;
