import React, { useCallback, useState, useEffect } from 'react';
import { apiCall, extractEncryptedToken } from '../../../utils';
import GoogleLoginBtn from '../../googleLoginBtn/GoogleLoginBtn';
import { useGoogleLogin } from '@react-oauth/google';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import './accountSettings.css';

const userDetails = JSON.parse(localStorage.getItem('user_details'));

function AccountSettings() {
    const [encryptedLoginInfo, setEncryptedLoginInfo] = useState(localStorage.getItem('login_info'));
    const [loginInfo, setLoginInfo] = useState({});
    const [changePasswordData, setChangePasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confPassword: '',
    });
    const [changePasswordMsg, setChangePasswordMsg] = useState('');
    const [createedPasswordData, setCreateedPasswordData] = useState({ password: '', confPassword: '' });
    const [createPasswordMsg, setCreatePasswordMsg] = useState('');
    const [linkWithGoogleMSg, setLinkWithGoogleMSg] = useState('');

    useEffect(() => {
        const extractedLoginInfo = extractEncryptedToken(encryptedLoginInfo);
        setLoginInfo(extractedLoginInfo);
    }, [encryptedLoginInfo, createPasswordMsg]);

    const handleCreatePasswordInputChange = useCallback(
        (e) => {
            setCreateedPasswordData({ ...createedPasswordData, [e.target.name]: e.target.value.trim() });
        },
        [createedPasswordData]
    );

    const handleCreatePasswordBtn = useCallback(
        async () => {
            if (loginInfo.linkWithPassword === false) {
                const toSend = { ...createedPasswordData, loginInfo: encryptedLoginInfo };
                const apiResp = await apiCall('settings/create_password', 'POST', toSend);

                if (apiResp.statusCode === 200) {
                    if (apiResp?.loginInfo) {
                        localStorage.setItem('login_info', apiResp.loginInfo);
                        setEncryptedLoginInfo(apiResp.loginInfo);
                        setCreatePasswordMsg(apiResp.msg);
                    }
                } else {
                    setCreatePasswordMsg(apiResp.msg);
                }
            }
        },
        [createedPasswordData, encryptedLoginInfo, loginInfo.linkWithPassword]
    );

    const handleChangePasswordInputChange = useCallback(
        (e) => {
            setChangePasswordData({ ...changePasswordData, [e.target.name]: e.target.value.trim() });
        },
        [changePasswordData]
    );

    const handleChangePasswordBtn = useCallback(async () => {
        if (loginInfo.linkWithPassword === true) {
            const apiResp = await apiCall('settings/change_password', 'POST', changePasswordData);

            console.log(apiResp);
            if (apiResp.statusCode === 200) {
                setChangePasswordMsg(apiResp?.msg);
            } else {
                setChangePasswordMsg(apiResp.msg);
            }
        }
    }, [changePasswordData, loginInfo.linkWithPassword]);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const accessToken = tokenResponse.access_token;
            const apiResp = await apiCall('settings/link_google', 'post', {
                googleAccessToken: accessToken,
                loginInfo: encryptedLoginInfo,
            });

            if (apiResp.statusCode === 200) {
                setEncryptedLoginInfo(apiResp.loginInfo);
                localStorage.setItem('login_info', apiResp.loginInfo);
                setLinkWithGoogleMSg(apiResp.msg);
            } else {
                setLinkWithGoogleMSg(apiResp.msg);
            }
        },
        onError: (e) => {
            console.log('Login Failed', e);
        },
    });

    return (
        <div className="accountSettings">
            <div className="userNameEmail">
                <div className="userFullName">
                    <div className="userNameEmailTitle">User Name →</div>
                    <input
                        className="userFullNameInput accountSettingsInput"
                        type="text"
                        placeholder="User Name"
                        value={userDetails.firstName + ' ' + userDetails.lastName}
                        readOnly
                    />
                </div>
                <div className="userEmail">
                    <div className="userNameEmailTitle">Email →</div>
                    <input
                        className="accountSettingsInput"
                        type="text"
                        placeholder="Email"
                        value={userDetails.email}
                        readOnly
                    />
                </div>
            </div>

            <div className="changePasswordSection">
                <div className="changePasswordTitle">Change Password</div>
                <div>
                    <input
                        type="password"
                        onChange={handleChangePasswordInputChange}
                        name="currentPassword"
                        placeholder="Current Password"
                        className="changePasswordInput"
                        disabled={!loginInfo.linkWithPassword}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        onChange={handleChangePasswordInputChange}
                        name="newPassword"
                        placeholder="New Password"
                        className="changePasswordInput"
                        disabled={!loginInfo.linkWithPassword}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        onChange={handleChangePasswordInputChange}
                        name="confPassword"
                        placeholder="Confirm Password"
                        className="changePasswordInput"
                        disabled={!loginInfo.linkWithPassword}
                    />
                </div>

                <Button
                    variant="contained"
                    color="success"
                    id="basic-button"
                    aria-haspopup="true"
                    onClick={handleChangePasswordBtn}
                    disabled={!loginInfo.linkWithPassword}
                    sx={{ fontWeight: 600, mt: 1.5, mb: 1.1, height: 40 }}
                >
                    Change Password
                    {/* {isSaveBtnLoading ? <CircularProgress size={30} /> : ' Save Changes'} */}
                </Button>
                <div className="changePasswordMsg">{changePasswordMsg}</div>
            </div>

            <div className="createPasswordSection">
                <div className="createPasswordTitle">
                    <div className="createPasswordText">Create a Password</div>

                    {loginInfo.linkWithPassword ? (
                        <Tooltip title="Your Account is Already link with a Password" arrow placement="top">
                            <InfoIcon />
                        </Tooltip>
                    ) : null}
                </div>
                <div className="createPasswordArea" onSubmit={handleCreatePasswordBtn}>
                    <input
                        className="createPasswordInput createPasswordInput1 "
                        type="password"
                        name="password"
                        placeholder="Create a Password"
                        onChange={handleCreatePasswordInputChange}
                        disabled={loginInfo.linkWithPassword}
                    />
                    <input
                        className="createPasswordInput"
                        type="password"
                        name="confPassword"
                        placeholder="Confirm Password"
                        onChange={handleCreatePasswordInputChange}
                        disabled={loginInfo.linkWithPassword}
                    />
                </div>

                <div className="createPasswordBtn">
                    <div className="createPasswordMsg createPasswordMsg1">{createPasswordMsg}</div>
                    <Button
                        variant="contained"
                        color="success"
                        id="basic-button"
                        aria-haspopup="true"
                        onClick={handleCreatePasswordBtn}
                        disabled={loginInfo.linkWithPassword}
                        sx={{ fontWeight: 600, p: 0, height: 40, width: 140 }}
                    >
                        Create
                        {/* {isSaveBtnLoading ? <CircularProgress size={30} /> : ' Save Changes'} */}
                    </Button>
                    <div className="createPasswordMsg createPasswordMsg2">{createPasswordMsg}</div>
                </div>
            </div>

            <div className="linkWithGoogleSection">
                <div className="linkWithGoogleTitle">
                    <div className="linkWithGoogleTitleText">Link Your Google Account</div>
                    {loginInfo.linkWithPassword ? (
                        <Tooltip title="Your Account is Already link with a Google" arrow placement="top">
                            <InfoIcon />
                        </Tooltip>
                    ) : null}
                </div>
                <div className="linkWithGoogleBtnMSg">
                    <GoogleLoginBtn
                        onClickFunction={loginInfo.linkWithGoogle === false ? googleLogin : null}
                        sx={{ margin: '0 20px 0 0' }}
                        disabled={loginInfo.linkWithGoogle}
                    />
                    <div className="linkWithGoogleMSg">{linkWithGoogleMSg}</div>
                </div>
            </div>
        </div>
    );
}

export default AccountSettings;
