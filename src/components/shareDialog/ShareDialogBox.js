import React, { useEffect, useState, useCallback, useRef } from 'react';

import { updateNoteShareAccess, updateUserShareList } from '../../firebase/features';
import { USER_DETAILS } from '../../utils';

import Button from '@mui/material/Button';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CircularProgress from '@mui/material/CircularProgress';

import userProflie from '../../img/userProfile.svg';

import './shareDialogBox.css';

const userDetails = USER_DETAILS || {};
const userProfileImg = localStorage.getItem('user_profile_img');

function ShareDialogBox({
	title,
	handleMsgShown,
	toggleBtn,
	handleAddShareNoteUser,
	currentNoteId,
	noteSharedUsers,
	setNoteSharedUsers,
	isNoteSharedWithAll,
	setIsNoteSharedWithAll,
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

	const handleSpecificUserPermissionChange = useCallback(
		(e, index) => {
			const toBoolean = e.target.value === 'true' ? true : e.target.value === 'false' ? false : 'remove';

			if (toBoolean === 'remove') {
				let newToDos = noteSharedUsers.filter((data, i) => {
					return i !== index ? data : null;
				});

				return setNoteSharedUsers(newToDos);
			}

			const newToDos = noteSharedUsers.map(function (item, i) {
				return i === index ? { ...item, canEdit: toBoolean } : item;
			});

			setNoteSharedUsers(newToDos);
		},
		[noteSharedUsers, setNoteSharedUsers]
	);

	const handleAllUserPermissionChange = useCallback(
		(e) => {
			const permission = e.target.value === 'true' ? true : false;
			setIsNoteSharedWithAll(permission);
		},
		[setIsNoteSharedWithAll]
	);

	const handleCopyLinkBtnClick = useCallback(() => {
		navigator.clipboard.writeText(window.location.origin + '/share/' + currentNoteId);
		handleMsgShown('Copied to clipboard', 'success');
	}, [handleMsgShown, currentNoteId]);

	const handleSaveBtnClick = useCallback(() => {
		if (!currentNoteId) return console.log('Please Provide noteId');
		const data = {
			noteId: currentNoteId,
			noteSharedUsers,
			isNoteSharedWithAll,
		};
		updateNoteShareAccess(data, setIsSaveBtnLoading, handleMsgShown);
		// updateUserShareList(data, setIsSaveBtnLoading, handleMsgShown);
	}, [currentNoteId, isNoteSharedWithAll, noteSharedUsers, handleMsgShown]);

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
						src={userProfileImg === 'null' || !userProfileImg ? userProflie : userProfileImg}
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

								<select
									className="shareUserPermission"
									value={item?.canEdit}
									onChange={(e) => handleSpecificUserPermissionChange(e, index)}
								>
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
						<Button
							variant="contained"
							onClick={handleCopyLinkBtnClick}
							sx={{ my: 2, mr: 2, width: '50%' }}
						>
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
				{/* <h1>This feature comming soon</h1> */}
			</div>
		</div>
	);
}

export default ShareDialogBox;
