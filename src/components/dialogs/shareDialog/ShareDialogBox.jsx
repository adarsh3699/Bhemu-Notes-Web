import { useEffect, useState, useCallback, useRef } from "react";

import { updateNoteShareAccess } from "../../../firebase/features";
import { USER_DETAILS } from "../../../utils";

import Button from "@mui/material/Button";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CircularProgress from "@mui/material/CircularProgress";

import userProflie from "../../../img/userProfile.svg";

import "./shareDialogBox.css";

const userDetails = USER_DETAILS || {};
const userProfileImg = localStorage.getItem("user_profile_img");

function ShareDialogBox({
	handleMsgShown,
	toggleShareDialog,
	handleAddShareNoteUser,
	openedNoteAllData,
	setOpenedNoteAllData,
	sx,
}) {
	const backgroundRef = useRef();
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);

	const handleClickOutside = useCallback(
		(e) => {
			if (backgroundRef.current && !backgroundRef.current.contains(e.target)) {
				toggleShareDialog();
			}
		},
		[toggleShareDialog]
	);

	useEffect(
		function () {
			// document.body.style.overflow = 'hidden';
			document.addEventListener("click", handleClickOutside, true);

			//component did un-mount
			return function () {
				document.removeEventListener("click", handleClickOutside, true);
			};
		},
		[handleClickOutside]
	);

	const handleSpecificUserPermissionChange = useCallback(
		(e, index) => {
			const toBoolean = e.target.value === "true" ? true : e.target.value === "false" ? false : "remove";

			if (toBoolean === "remove") {
				let userlist = openedNoteAllData.noteSharedUsers.filter((data, i) => {
					return i !== index ? data : null;
				});

				return setOpenedNoteAllData((prev) => ({ ...prev, noteSharedUsers: userlist }));
			}

			const userlist = openedNoteAllData.noteSharedUsers.map(function (item, i) {
				return i === index ? { ...item, canEdit: toBoolean } : item;
			});

			return setOpenedNoteAllData((prev) => ({ ...prev, noteSharedUsers: userlist }));
		},
		[openedNoteAllData.noteSharedUsers, setOpenedNoteAllData]
	);

	const handleAllUserPermissionChange = useCallback(
		(e) => {
			const permission = e.target.value === "true" ? true : false;
			setOpenedNoteAllData((prev) => ({ ...prev, isNoteSharedWithAll: permission }));
		},
		[setOpenedNoteAllData]
	);

	const handleCopyLinkBtnClick = useCallback(() => {
		navigator.clipboard.writeText(window.location.origin + "/share/" + openedNoteAllData.noteId);
		handleMsgShown("Copied to clipboard", "success");
	}, [openedNoteAllData.noteId, handleMsgShown]);

	const handleSaveBtnClick = useCallback(() => {
		if (!openedNoteAllData.noteId) return console.log("Please Provide noteId");
		const data = {
			noteId: openedNoteAllData.noteId,
			noteSharedUsers: openedNoteAllData.noteSharedUsers,
			isNoteSharedWithAll: openedNoteAllData.isNoteSharedWithAll,
		};
		updateNoteShareAccess(data, setIsSaveBtnLoading, handleMsgShown);
		// updateUserShareList(data, setIsSaveBtnLoading, handleMsgShown);
	}, [openedNoteAllData, handleMsgShown]);

	return (
		<div className="dialogBoxBg">
			<div className="dialogBox" ref={backgroundRef} style={sx}>
				<div className="dialogBoxTitle">Share Note</div>
				{/* <div className="dialogBoxMessage">{message}</div> */}

				<form onSubmit={handleAddShareNoteUser}>
					<input
						type="email"
						className="dialogInputFullSize"
						name="shareEmailInput"
						placeholder="Add Email"
					/>
				</form>
				<div className="shareUserDetailsBox">
					<img
						src={userProfileImg === "null" || !userProfileImg ? userProflie : userProfileImg}
						className="shareUserProflie"
						alt=""
					/>
					<div className="shareUserDetails">
						<div>
							<div className="ownerUserName">{userDetails?.userName}</div>
							<div className="ownerUserEmail">{userDetails?.email}</div>
						</div>
						<div>Owner</div>
					</div>
				</div>

				{openedNoteAllData.noteSharedUsers?.map((item, index) => {
					return (
						<div className="shareUserDetailsBox" key={index}>
							<img src={userProflie} className="shareUserProflie" alt="" />
							<div className="shareUserDetails">
								<div className="shareUserOthersEmail">{item?.email}</div>

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
				<div className="dialogSubContainer">
					<div>Who can access</div>
					<div className="shareUserAccess">
						<ManageAccountsIcon fontSize="inherit" />
						<select
							className="shareUserAccessSelect"
							value={openedNoteAllData.isNoteSharedWithAll}
							onChange={handleAllUserPermissionChange}
						>
							<option value={false}>Only invited people can access</option>
							<option value={true}>Anyone with the link can comment</option>
						</select>
					</div>
					<div className="dailog2BtnsFlex">
						<Button
							variant="contained"
							onClick={handleCopyLinkBtnClick}
							sx={{ my: 2, mr: 2, width: "50%" }}
						>
							Copy Link
						</Button>
						<Button
							variant="contained"
							onClick={handleSaveBtnClick}
							color="success"
							disabled={isSaveBtnLoading}
							sx={{ my: 2, width: "50%" }}
						>
							{isSaveBtnLoading ? <CircularProgress color="success" size={30} /> : " Save"}
						</Button>
					</div>
				</div>
				{/* <h1>This feature comming soon</h1> */}
			</div>
		</div>
	);
}

export default ShareDialogBox;
