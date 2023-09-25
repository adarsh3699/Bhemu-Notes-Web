import React, { useEffect, useCallback, useRef } from 'react';

import Button from '@mui/material/Button';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import userProflie from '../../img/userProfile.svg';

import './shareDialogBox.css';

const userDetails = JSON.parse(localStorage.getItem('user_details')) || {};
const userProfileImg = localStorage.getItem('user_profile_img');

function ShareDialogBox({ title, message, toggleBtn, handleAddShareNoteUser, noteSharedWith, sx }) {
	const backgroundRef = useRef();

	const handleClickOutside = useCallback(
		(e) => {
			if (backgroundRef.current && !backgroundRef.current.contains(e.target)) {
				toggleBtn();
			}
		},
		[toggleBtn]
	);

	useEffect(
		function () {
			// document.body.style.overflow = 'hidden';
			document.addEventListener('click', handleClickOutside, true);

			//component did un-mount
			return function () {
				document.removeEventListener('click', handleClickOutside, true);
			};
		},
		[handleClickOutside]
	);

	return (
		<div className="shareDialogBoxBg">
			<div className="shareDialogBox" ref={backgroundRef} style={sx}>
				<div className="ConfirmationDialogBoxTitle">{title}</div>
				{/* <div className="ConfirmationDialogBoxMessage">{message}</div> */}

				<form onSubmit={handleAddShareNoteUser}>
					<input type="email" className="shareEmailInput" name="shareEmailInput" placeholder="Add Email" />
				</form>
				<div className="shareUserDetailsBox">
					<img
						src={userProfileImg === null ? userProflie : userProfileImg}
						className="shareUserProflie"
						alt=""
					/>
					<div className="shareUserDetails">
						<div>
							<div className="shareUserName">{userDetails?.userName}</div>
							<div className="shareUserEmail">{userDetails?.email}</div>
						</div>
						<div>Owner</div>
					</div>
				</div>

				{noteSharedWith?.map((item, index) => {
					return (
						<div className="shareUserDetailsBox" key={index}>
							<img src={userProflie} className="shareUserProflie" alt="" />
							<div className="shareUserDetails">
								<div>
									<div className="shareUserOthersEmail">{userDetails?.email}</div>
								</div>

								<select className="shareUserPermission">
									<option value="age">Read</option>
									<option value="age">Editor</option>
								</select>
							</div>
						</div>
					);
				})}
				<div className="shareUserAccessBox">
					<div>Who can access</div>
					<div className="shareUserAccess">
						<ManageAccountsIcon fontSize="inherit" />
						<select className="shareUserAccessSelect">
							<option value="age">Read</option>
							<option value="age">Editor</option>
						</select>
					</div>
					<div className="shareCopySaveBtns">
						<Button variant="contained" sx={{ my: 2, mr: 2, width: '50%' }}>
							Copy Link
						</Button>
						<Button variant="contained" color="success" sx={{ my: 2, width: '50%' }}>
							Save
						</Button>
					</div>
				</div>
				<h1>Feature Coming Soon</h1>
			</div>
		</div>
	);
}

export default ShareDialogBox;
