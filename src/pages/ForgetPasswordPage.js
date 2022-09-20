import React, { useState, useCallback } from 'react';
import { apiCall } from "../utils";
import Loader from "../components/Loader";

import "../css/loginPage.css";


document.title = "Bhemu Notes | Forget Password";

function ForgetPasswordPage() {

    const [emailVal, setEmailValsg] = useState("");
    const [encryptedOtp, setEncryptedOtp] = useState("");

    const [otpMsg, setOtpMsg] = useState("");
    const [passMsg, setPassMsg] = useState("");

    const [isOTPApiLoading, setIsOTPApiLoading] = useState(false);
    const [isPassApiLoading, setIsPassApiLoading] = useState(false);
    const [showChangePassForm, setShowChangePassForm] = useState(false);

    const handleEmailValue = useCallback((e) => {
        setEmailValsg(e.target.value);
    }, [])

    const handleSendOtpBtnClick = useCallback(async (e) => {
        e.preventDefault();

        if (emailVal) {
            setIsOTPApiLoading(true);
            const apiResp = await apiCall("auth/forget-password", "post", { email: emailVal });
            if (apiResp.statusCode === 200) {
                setShowChangePassForm(true)
                setOtpMsg(apiResp.msg);
                setEncryptedOtp(apiResp.otp)
            } else {
                setOtpMsg(apiResp.msg)
            }
            setIsOTPApiLoading(false)
        } else {
            setOtpMsg("Please Enter Your Email")
        }
    }, [emailVal])

    const handleConfirmPasswordClick = useCallback(async (e) => {
        e.preventDefault();

        setIsPassApiLoading(true);
        const otp = e.target.otp.value;
        const password = e.target.password.value;
        const confPassword = e.target.confPassword.value;

        if (password === confPassword) {
            const apiResp = await apiCall("auth/change-password", "POST", { email: emailVal, password, encryptedOtp, otp });
            if (apiResp.statusCode === 200) {
                setPassMsg(apiResp.msg)
                // document.location.href = "/";
            } else {
                setPassMsg(apiResp.msg)
            }
        } else {
            setPassMsg("Password does not match")
        }
        setIsPassApiLoading(false)
    }, [emailVal, encryptedOtp])

    return (
        <div id="background">
            <div id="wrapper">
                <div id='Title'>Forget Password</div>
                <form className='form' onSubmit={handleSendOtpBtnClick} style={showChangePassForm ? { display: "none" } : { display: "block" }}  >
                    <input type="email" className="inputBottomMargin" onChange={handleEmailValue} value={emailVal} placeholder="Email" />

                    <button id='createAcc' style={{ marginTop: "unset" }}>Send OTP</button>

                    <div className="red" >{otpMsg}</div>
                    <Loader isLoading={isOTPApiLoading} />
                    <br />
                </form>

                <form className="form" style={showChangePassForm ? null : { display: "none" }} onSubmit={handleConfirmPasswordClick}>
                    <input type="number" name='otp' required placeholder="Enter OTP" className="inputBottomMargin" />

                    <input type="password" name='password' required pattern="().{8,}" placeholder="New Password (Min 8 digit)" className="inputBottomMargin" />

                    <input type="password" name='confPassword' required pattern="().{8,}" placeholder="Confirm Password (Min 8 digit)" className="inputBottomMargin" />

                    <button id="login" className={isPassApiLoading ? "isLogin" : ""}>Confirm Password</button>
                    <div className="red" style={isPassApiLoading ? { marginBottom: "unset" } : {}} >{passMsg}</div>
                    <Loader isLoading={isPassApiLoading} />
                </form>

                <a href="/" id='forgotPass'>Back to Login Page</a>

            </div>
        </div>
    );
}

export default ForgetPasswordPage;