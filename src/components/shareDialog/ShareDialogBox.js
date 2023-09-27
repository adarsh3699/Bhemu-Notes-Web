import React, { useEffect, useState, useCallback, useRef } from 'react';

import { updateShareNote } from '../../firebase/shareNote';

import Button from '@mui/material/Button';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CircularProgress from '@mui/material/CircularProgress';

import userProflie from '../../img/userProfile.svg';

import './shareDialogBox.css';

const userDetails = JSON.parse(localStorage.getItem('user_details')) || {};
const userProfileImg = localStorage.getItem('user_profile_img');

function ShareDialogBox({
	title,
	handleErrorShown,
	toggleBtn,
	handleAddShareNoteUser,
	noteSharedUsers,
	isNoteSharedWithAll,
	setIsNoteSharedWithAll,
	myNotesId,
	sx,
}) {
	const backgroundRef = useRef();
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);

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

	const handleAllUserPermissionChange = useCallback(
		(e) => {
			const permission = e.target.value === 'true' ? true : false;
			setIsNoteSharedWithAll(permission);
		},
		[setIsNoteSharedWithAll]
	);

	const handleSaveBtnClick = useCallback(() => {
		if (!myNotesId) return console.log('Please Provide noteId');
		const data = {
			noteId: myNotesId,
			noteSharedUsers,
			isNoteSharedWithAll,
		};
		updateShareNote(data, setIsSaveBtnLoading, handleErrorShown);
	}, [myNotesId, isNoteSharedWithAll, noteSharedUsers, handleErrorShown]);

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

				{noteSharedUsers?.map((item, index) => {
					return (
						<div className="shareUserDetailsBox" key={index}>
							<img src={userProflie} className="shareUserProflie" alt="" />
							<div className="shareUserDetails">
								<div>
									<div className="shareUserOthersEmail">{item?.email}</div>
								</div>

								<select className="shareUserPermission">
									<option value={false}>Can Read</option>
									<option value={true}>Can Edit</option>
									<option value="remove">Remove</option>
								</select>
							</div>
						</div>
					);
				})}
				<div className="shareUserAccessBox">
					<div>Who can access</div>
					<div className="shareUserAccess">
						<ManageAccountsIcon fontSize="inherit" />
						<select
							className="shareUserAccessSelect"
							value={isNoteSharedWithAll}
							onChange={handleAllUserPermissionChange}
						>
							<option value={false}>Only invited people can access</option>
							<option value={true}>Anyone with the link can comment</option>
						</select>
					</div>
					<div className="shareCopySaveBtns">
						<Button variant="contained" sx={{ my: 2, mr: 2, width: '50%' }}>
							Copy Link
						</Button>
						<Button
							variant="contained"
							onClick={handleSaveBtnClick}
							color="success"
							disabled={isSaveBtnLoading}
							sx={{ my: 2, width: '50%' }}
						>
							{isSaveBtnLoading ? <CircularProgress color="success" size={30} /> : ' Save'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ShareDialogBox;
