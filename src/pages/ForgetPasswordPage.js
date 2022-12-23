import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { handleForgetPassword } from '../firebase/auth/auth';
import Loader from '../components/Loader';

import '../styles/loginPage.css';

document.title = 'Bhemu Notes | Forget Password';

function ForgetPasswordPage() {
    const [emailVal, setEmailValsg] = useState('');

    const [msg, setMsg] = useState('');

    const [isOTPApiLoading, setIsOTPApiLoading] = useState(false);
    const [showChangePassForm, setShowChangePassForm] = useState(false);

    const handleEmailValue = useCallback((e) => {
        setEmailValsg(e.target.value);
    }, []);

    return (
        <div id="background">
            <div id="wrapper">
                <div id="Title">Forget Password</div>
                <form
                    className="form"
                    onSubmit={(e) => handleForgetPassword(e, setMsg)}
                    style={showChangePassForm ? { display: 'none' } : { display: 'block' }}
                >
                    <input
                        type="email"
                        name="email"
                        className="inputBottomMargin"
                        onChange={handleEmailValue}
                        value={emailVal}
                        placeholder="Email"
                    />

                    <button id="createAcc" style={{ marginTop: 'unset' }}>
                        Send Link
                    </button>

                    <div className="red">{msg}</div>
                    <Loader isLoading={isOTPApiLoading} />
                    <br />
                </form>

                <NavLink to="/" id="forgotPass">
                    Back to Login Page
                </NavLink>
            </div>
        </div>
    );
}

export default ForgetPasswordPage;
