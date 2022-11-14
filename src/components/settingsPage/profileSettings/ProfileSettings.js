import React, { useState, useCallback } from 'react';
import { apiCall } from '../../../utils';
import myLogo from '../../../img/logo.jpeg';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import './profileSettings.css';

const jwtDetails = JSON.parse(localStorage.getItem('user_details'));

function ProfileSettings() {
    const [userDetails, setUserDetails] = useState({
        firstName: jwtDetails?.firstName,
        lastName: jwtDetails?.lastName,
        profilePicture: jwtDetails?.profilePicture,
    });
    const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
    const [changeUserProfileMsg, setchangeUserProfileMsg] = useState('');

    const handleUserDetailsChange = useCallback(
        (e) => {
            setUserDetails({ ...userDetails, [e.target.name]: e.target.value.trim() });
        },
        [userDetails, setUserDetails]
    );

    const handleProfileSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setchangeUserProfileMsg('');
            if (userDetails.firstName.trim() && userDetails.lastName.trim()) {
                setIsSaveBtnLoading(true);
                const apiResp = await apiCall('settings/update_profile', 'POST', userDetails);

                if (apiResp.statusCode === 200) {
                    if (apiResp?.details) {
                        localStorage.setItem('user_details', JSON.stringify(apiResp.details));
                    }
                } else if (apiResp.statusCode === 401) {
                    localStorage.clear();
                    document.location.href = '/';
                } else {
                    setchangeUserProfileMsg(apiResp.msg);
                }
                setIsSaveBtnLoading(false);
            } else {
                setchangeUserProfileMsg('First name or Last name can not be empty.');
            }
        },
        [userDetails]
    );

    return (
        <div className="profileSettings">
            <div className="ProfilePictureTitle">Profile Picture</div>
            <div className="userInfo">
                <div>
                    <img src={myLogo} alt="" className="ProfilePictureImg" />
                </div>

                <form className="userDetails" onSubmit={handleProfileSubmit} encType="multipart/form-data">
                    <div className="userNameTitle">User Name →</div>
                    <div className="userName">
                        <input
                            className="firstNameInput profileSettingsInput"
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={userDetails?.firstName ? userDetails.firstName : ''}
                            onChange={handleUserDetailsChange}
                        />
                        <input
                            className="profileSettingsInput"
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={userDetails?.lastName ? userDetails.lastName : ''}
                            onChange={handleUserDetailsChange}
                        />
                    </div>

                    <div className="saveChangesBtn">
                        <Button
                            variant="contained"
                            color="success"
                            id="basic-button"
                            aria-haspopup="true"
                            onClick={handleProfileSubmit}
                            disabled={isSaveBtnLoading}
                            sx={{ fontWeight: 600, p: 0, height: 40, width: 140 }}
                        >
                            {isSaveBtnLoading ? <CircularProgress size={30} /> : ' Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
            <div className="changeUserProfileMsg">{changeUserProfileMsg}</div>
        </div>
    );
}

export default ProfileSettings;
