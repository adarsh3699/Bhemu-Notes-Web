import React, { useState, useCallback } from 'react';

import { handleUserNameChange } from '../../../firebase/settings';

import myLogo from '../../../img/logo.jpeg';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import './profileSettings.css';

const localUserDetails = JSON.parse(localStorage.getItem('user_details'));

function ProfileSettings() {
    const [userDetails, setUserDetails] = useState({
        userName: localUserDetails?.userName,
        email: localUserDetails?.email,
        profilePicture: localUserDetails?.photoURL,
        userId: localUserDetails?.userId,
    });
    const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleUserDetailsChange = useCallback(
        (e) => {
            setUserDetails({
                ...userDetails,
                [e.target.name]: e.target.value.trim(),
            });
        },
        [userDetails, setUserDetails]
    );

    return (
        <div className="profileSettings">
            <div className="ProfilePictureTitle">Profile Picture</div>
            <div className="userInfo">
                <div>
                    <img src={myLogo} alt="" className="ProfilePictureImg" />
                </div>

                <div className="userDetails">
                    <div className="userNameTitle">User Name →</div>
                    <div className="userName">
                        <input
                            className="firstNameInput profileSettingsInput"
                            type="text"
                            name="userName"
                            placeholder="User Name"
                            value={userDetails?.userName ? userDetails.userName : ''}
                            onChange={handleUserDetailsChange}
                        />
                    </div>

                    <div className="saveChangesBtn">
                        <Button
                            variant="contained"
                            color="success"
                            id="basic-button"
                            aria-haspopup="true"
                            onClick={() => handleUserNameChange(userDetails, setMsg, setIsSaveBtnLoading)}
                            disabled={isSaveBtnLoading}
                            sx={{
                                fontWeight: 600,
                                p: 0,
                                height: 40,
                                width: 140,
                            }}
                        >
                            {isSaveBtnLoading ? <CircularProgress size={30} /> : ' Save Changes'}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="changeUserProfileMsg">{msg}</div>
        </div>
    );
}

export default ProfileSettings;
