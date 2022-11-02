import React from 'react';
import Button from '@mui/material/Button';

import './accountSettings.css';

const userDetails = JSON.parse(localStorage.getItem('user_details'));

function AccountSettings() {
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
                <div className='createPasswordArea'>
                    <input className="createPasswordInput createPasswordInput1 " type="text" placeholder="Create a Password" />
                    <input className="createPasswordInput" type="text" placeholder="Confirm Password" />
                </div>

                <div className="createPasswordBtn">
                        <Button
                            variant="contained"
                            color="success"
                            id="basic-button"
                            aria-haspopup="true"
                            // onClick={handleProfileSubmit}
                            // disabled={isSaveBtnLoading}
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
