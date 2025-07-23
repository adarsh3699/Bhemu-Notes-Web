import { useCallback, useState, useEffect } from "react";
import { handlePasswordChange, isGoogleOnlyUser, handlePasswordCreation } from "../../../firebase/settings";
import { USER_DETAILS } from "../../../utils";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import "./accountSettings.css";

const userDetails = USER_DETAILS;

function AccountSettings() {
	const [isGoogleOnly, setIsGoogleOnly] = useState(false);

	//change password
	const [changePasswordData, setChangePasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confPassword: "",
	});
	const [changePasswordMsg, setChangePasswordMsg] = useState("");
	const [isChangePasswordBtnLoading, setIsChangePasswordBtnLoading] = useState(false);

	// Check if user is Google-only on component mount
	useEffect(() => {
		setIsGoogleOnly(isGoogleOnlyUser());
	}, []);

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

		if (isGoogleOnly) {
			// For Google-only users, create password (no current password needed)
			handlePasswordCreation(
				changePasswordData,
				(msg) => {
					setChangePasswordMsg(msg);
					// If password creation was successful, update the Google-only status
					if (msg === "Password created successfully.") {
						setIsGoogleOnly(false);
						// Clear the form
						setChangePasswordData({
							currentPassword: "",
							newPassword: "",
							confPassword: "",
						});
					}
				},
				setIsChangePasswordBtnLoading
			);
		} else {
			// For users with existing password, change password
			handlePasswordChange(
				changePasswordData,
				(msg) => {
					setChangePasswordMsg(msg);
					// If password change was successful, clear the form
					if (msg === "Update successful.") {
						setChangePasswordData({
							currentPassword: "",
							newPassword: "",
							confPassword: "",
						});
					}
				},
				setIsChangePasswordBtnLoading
			);
		}
	}, [changePasswordData, isGoogleOnly]);

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
				<div className="changePasswordTitle">{isGoogleOnly ? "Create Password" : "Change Password"}</div>

				{/* Explanation for Google users */}
				{isGoogleOnly && (
					<div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
						Create a password to enable login with both Google and email/password.
					</div>
				)}

				{/* Show current password field only for non-Google users */}
				{!isGoogleOnly && (
					<div>
						<input
							type="password"
							onChange={handleChangePasswordInputChange}
							name="currentPassword"
							value={changePasswordData.currentPassword}
							placeholder="Current Password"
							className="changePasswordInput"
						/>
					</div>
				)}

				<div>
					<input
						type="password"
						onChange={handleChangePasswordInputChange}
						name="newPassword"
						value={changePasswordData.newPassword}
						placeholder={isGoogleOnly ? "New Password (8 digit)" : "New Password (8 digit)"}
						className="changePasswordInput"
					/>
				</div>
				<div>
					<input
						type="password"
						onChange={handleChangePasswordInputChange}
						name="confPassword"
						value={changePasswordData.confPassword}
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
					{isChangePasswordBtnLoading ? (
						<CircularProgress size={30} />
					) : isGoogleOnly ? (
						"Create Password"
					) : (
						"Change Password"
					)}
				</Button>
				<div className="changePasswordMsg">{changePasswordMsg}</div>
			</div>
		</div>
	);
}

export default AccountSettings;
