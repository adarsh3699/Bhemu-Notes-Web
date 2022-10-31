import React from 'react';
import myLogo from '../../../img/logo.jpeg';
import Button from '@mui/material/Button';

import './aboutSettings.css';

const userDetails = JSON.parse(localStorage.getItem('user_info'))?.details;

function AboutSettings() {
    return (
        <div>
            <div className="ProfilePictureTitle">Profile Picture</div>
            <div className="userInfo">
                <div>
                    <img
                        src={userDetails?.profilePicture ? userDetails?.profilePicture : myLogo}
                        alt=""
                        className="ProfilePictureImg"
                    />
                </div>

                <div className="userDetails">
                    <div className="userNameTitle">User Name →</div>
                    <div className="userName">
                        <input type="text" placeholder="First Name" />
                        <input type="text" placeholder="Last Name" />
                    </div>
                </div>
            </div>

            <div className="saveChangesBtn">
                <Button
                    variant="contained"
                    color="success"
                    id="basic-button"
                    aria-haspopup="true"
                    // onClick={handleClick}
                    sx={{ fontWeight: 600, py: 1.2, mr: 7 }}
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}

export default AboutSettings;
