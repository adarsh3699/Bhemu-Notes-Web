import React, { useState, useCallback } from 'react';

import { handleUserNameChange, handleUserProfileChange } from '../../../firebase/settings';

import myLogo from '../../../img/logo.jpeg';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import './profileSettings.css';

const localUserDetails = JSON.parse(localStorage.getItem('user_details'));

function ProfileSettings() {
	const [imageUpload, setImageUpload] = useState(null);
	const [userDetails, setUserDetails] = useState({
		userName: localUserDetails?.userName,
		email: localUserDetails?.email,
		profilePicture: localUserDetails?.photoURL,
		userId: localUserDetails?.userId,
	});
	const [profilePictureUrl, setProfilePictureUrl] = useState(localStorage.getItem('user_profile_img'));
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
	const [msg, setMsg] = useState('');

	const handleUserDetailsChange = useCallback(
		(e) => {
			setUserDetails({
				...userDetails,
				[e.target.name]: e.target.value,
			});
			if (msg) setMsg('');
		},
		[userDetails, setUserDetails, msg]
	);

	const handleImageUpload = useCallback(
		(e) => {
			setImageUpload(e.target.files[0]);
		},
		[setImageUpload]
	);

	const handleUserDetailsUpdate = useCallback(() => {
		if (imageUpload) {
			handleUserProfileChange(imageUpload, setProfilePictureUrl, setMsg, setIsSaveBtnLoading);
		}
		handleUserNameChange(userDetails, setMsg, setIsSaveBtnLoading, imageUpload);
	}, [userDetails, imageUpload]);

	return (
		<div className="profileSettings">
			<div className="ProfilePictureTitle">Profile Picture</div>
			<div className="userInfo">
				<div>
					<img
						src={imageUpload ? URL.createObjectURL(imageUpload) : profilePictureUrl || myLogo}
						alt=""
						className="ProfilePictureImg"
					/>
				</div>
				<div className="userDetails">
					<input
						type="file"
						className="ProfilePicUploadBtn"
						accept="image/png, image/gif, image/jpeg"
						onChange={handleImageUpload}
					/>

					<div className="userNameTitle">User Name →</div>
					<div className="userName">
						<input
							className="firstNameInput profileSettingsInput"
							type="text"
							name="userName"
							placeholder="User Name"
							autoComplete="off"
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
							onClick={handleUserDetailsUpdate}
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
