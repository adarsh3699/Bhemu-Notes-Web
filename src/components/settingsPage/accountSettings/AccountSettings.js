import React, { useCallback, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { apiCall, extractEncryptedToken } from '../../../utils';

import './accountSettings.css';

const userDetails = JSON.parse(localStorage.getItem('user_details'));
const encryptedLoginInfo = localStorage.getItem('login_info');

function AccountSettings() {
    const [loginInfo, setLoginInfo] = useState('');
    const [createedPasswordData, setCreateedPasswordData] = useState({ password: '', confPassword: '' });

    useEffect(() => {
        const extractedLoginInfo = extractEncryptedToken(encryptedLoginInfo);
        setLoginInfo(extractedLoginInfo);
    }, []);

    const handleCreatePasswordInputChange = useCallback(
        (e) => {
            setCreateedPasswordData({ ...createedPasswordData, [e.target.name]: e.target.value.trim() });
        },
        [createedPasswordData]
    );

    const handleCreatePasswordBtn = useCallback(
        async (e) => {
            const toSend = { ...createedPasswordData, loginInfo: encryptedLoginInfo };
            const apiResp = await apiCall('settings/create_password', 'POST', toSend);
            console.log(apiResp);
        },
        [createedPasswordData]
    );

    return (
        <div className="accountSettings">
            <div className="userNameEmail">
                <div className="userFullName">
                    <div className="userNameEmailTitle">User Name →</div>
                    <input
                        className="userFullNameInput accountSettingsInput"
                        type="text"
                        placeholder="User Name"
                        value={userDetails.firstName}
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

            <div>
                <div className="createPasswordTitle">Create a Password</div>
                <div className="createPasswordArea" onSubmit={handleCreatePasswordBtn}>
                    <input
                        className="createPasswordInput createPasswordInput1 "
                        type="text"
                        name="password"
                        placeholder="Create a Password"
                        onChange={handleCreatePasswordInputChange}
                        disabled={loginInfo.linkWithPassword}
                    />
                    <input
                        className="createPasswordInput"
                        type="text"
                        name="confPassword"
                        placeholder="Confirm Password"
                        onChange={handleCreatePasswordInputChange}
                        disabled={loginInfo.linkWithPassword}
                    />
                </div>

                <div className="createPasswordBtn">
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
                </div>
            </div>
        </div>
    );
}

export default AccountSettings;
