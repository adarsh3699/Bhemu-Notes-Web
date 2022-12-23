import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import { apiCall, extractEncryptedToken } from '../utils';
import Loader from '../components/Loader';
import GoogleLoginBtn from '../components/googleLoginBtn/GoogleLoginBtn';
import { handleUserState, handleLoginForm } from '../firebase/auth/auth';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { amber } from '@mui/material/colors';

import '../styles/loginPage.css';
import logo from '../img/logoBig.png';

function LoginPage() {
    const [msg, setMsg] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [ispasswordVisible, setIspasswordVisible] = useState(false);

    useEffect(() => {
        setIsLoading(false);
        handleUserState('loginPage');
    }, []);

    const handlePasswordVisibility = useCallback(() => {
        setIspasswordVisible(!ispasswordVisible);
    }, [ispasswordVisible]);

    return (
        <>
            {!isLoading && (
                <div id="background">
                    <div id="wrapper">
                        <img id="myLogo" src={logo} alt="" />
                        <div id="Title">Bhemu Notes</div>
                        <form className="form" onSubmit={(e) => handleLoginForm(e, setMsg)}>
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
                        <NavLink to="/forget-password" id="forgotPass">
                            Forgotten Password
                        </NavLink>

                        <hr />
                        {/* <GoogleLoginBtn onClickFunction={googleLogin} /> */}
                        <NavLink to="/register">
                            <div id="createAcc">Create New Account</div>
                        </NavLink>
                    </div>
                </div>
            )}
        </>
    );
}

export default LoginPage;
