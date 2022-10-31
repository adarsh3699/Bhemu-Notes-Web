import React from 'react';
import myLogo from '../../../img/logo.jpeg';
import Button from '@mui/material/Button';

import './accountSettings.css';

const userDetails = JSON.parse(localStorage.getItem('user_info'))?.details;

function AccountSettings() {
    return (
        <div>
            Account Settings
        </div>
    );
}

export default AccountSettings;
