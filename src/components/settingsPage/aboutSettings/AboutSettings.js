import React from 'react';
import myLogo from '../../../img/logo.jpeg';

import './aboutSettings.css';

const userDetails = JSON.parse(localStorage.getItem('user_info'))?.details;

function AboutSettings({}) {
    return (
        <div>
            <div>
                <div className="ProfilePictureTitle">Profile Picture</div>
                <img
                    src={userDetails?.profilePicture ? userDetails?.profilePicture : myLogo}
                    alt=""
                    className="ProfilePictureImg"
                />
            </div>
        </div>
    );
}

export default AboutSettings;
