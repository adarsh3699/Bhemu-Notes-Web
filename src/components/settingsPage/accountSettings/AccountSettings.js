import React, { useCallback, useState } from 'react';
import { handlePasswordChange } from '../../../firebase/settings';
import { USER_DETAILS } from '../../../utils';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import './accountSettings.css';

const userDetails = USER_DETAILS;

function AccountSettings() {
	//change password
	const [changePasswordData, setChangePasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confPassword: '',
	});
	const [changePasswordMsg, setChangePasswordMsg] = useState('');
	const [isChangePasswordBtnLoading, setIsChangePasswordBtnLoading] = useState(false);

	const handleChangePasswordInputChange = useCallback(
		(e) => {
			setChangePasswordData({
				...changePasswordData,
				[e.target.name]: e.target.value.trim(),
			});
		},
		[changePasswordData]
	);

	const handleChangePasswordBtn = useCallback(async () => {
		setIsChangePasswordBtnLoading(true);
		handlePasswordChange(changePasswordData, setChangePasswordMsg, setIsChangePasswordBtnLoading);
	}, [changePasswordData]);

	return (
		<div className="accountSettings">
			<div className="userNameEmail">
				<div className="userFullName">
					<div className="userNameEmailTitle">User Name →</div>
					<input
						className="userFullNameInput accountSettingsInput"
						type="text"
						placeholder="User Name"
						value={userDetails?.userName}
						readOnly
					/>
				</div>
				<div className="userEmail">
					<div className="userNameEmailTitle">Email →</div>
					<input
						className="accountSettingsInput"
						type="text"
						placeholder="Email"
						value={userDetails?.email}
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
					/>
				</div>
				<div>
					<input
						type="password"
						onChange={handleChangePasswordInputChange}
						name="newPassword"
						placeholder="New Password (8 digit)"
						className="changePasswordInput"
					/>
				</div>
				<div>
					<input
						type="password"
						onChange={handleChangePasswordInputChange}
						name="confPassword"
						placeholder="Confirm Password (8 digit)"
						className="changePasswordInput"
					/>
				</div>

				<Button
					variant="contained"
					color="success"
					id="basic-button"
					aria-haspopup="true"
					onClick={handleChangePasswordBtn}
					sx={{
						fontWeight: 600,
						p: 0,
						mt: 1.5,
						mb: 1.1,
						height: 40,
						width: 185,
					}}
				>
					{isChangePasswordBtnLoading ? <CircularProgress size={30} /> : 'Change Password'}
				</Button>
				<div className="changePasswordMsg">{changePasswordMsg}</div>
			</div>
		</div>
	);
}

export default AccountSettings;
