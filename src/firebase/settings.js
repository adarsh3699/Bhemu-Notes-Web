import { storage, auth, database } from "./initFirebase";

import {
	reauthenticateWithCredential,
	EmailAuthProvider,
	updateProfile,
	updatePassword,
	linkWithCredential,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

// Check if user is Google-only (no password provider)
function isGoogleOnlyUser() {
	const user = auth.currentUser;
	if (!user) return false;

	// Check if user has only Google provider and no password provider
	const hasPasswordProvider = user.providerData.some((provider) => provider.providerId === "password");
	const hasGoogleProvider = user.providerData.some((provider) => provider.providerId === "google.com");

	return hasGoogleProvider && !hasPasswordProvider;
}

// Create password for Google-only users
function handlePasswordCreation(passwordData, setChangePasswordMsg, setIsChangePasswordBtnLoading) {
	const { newPassword, confPassword } = passwordData;

	if (!newPassword || !confPassword)
		return setChangePasswordMsg("Please provide all details") && setIsChangePasswordBtnLoading(false);
	if (newPassword !== confPassword)
		return setChangePasswordMsg("Password does not match.") && setIsChangePasswordBtnLoading(false);
	if (newPassword.length < 8 || confPassword.length < 8)
		return setChangePasswordMsg("Password must be 8 digits.") && setIsChangePasswordBtnLoading(false);

	const user = auth.currentUser;
	const credential = EmailAuthProvider.credential(user.email, newPassword);

	// Link password credential to existing Google account
	linkWithCredential(user, credential)
		.then(() => {
			setIsChangePasswordBtnLoading(false);
			setChangePasswordMsg("Password created successfully.");
		})
		.catch((err) => {
			setIsChangePasswordBtnLoading(false);
			setChangePasswordMsg(
				err.code === "auth/weak-password"
					? "Password is too weak. Choose a stronger password."
					: err.code === "auth/email-already-in-use"
					? "This email is already associated with a password."
					: err.code
			);
			console.log(err.message);
		});
}

async function handleUserNameChange(userDetails, setMsg, setIsSaveBtnLoading, imageUpload) {
	const { userName } = userDetails;
	if (!userName?.trim()) return setMsg("User Name can not be empty");
	const user = auth.currentUser;
	if (userName === user.displayName) return console.log("No change");
	if (!imageUpload) setIsSaveBtnLoading(true);

	const docRef = doc(database, "user_details", auth?.currentUser?.email);

	updateProfile(user, { displayName: userName })
		.then(() => {
			setMsg("Changed successfully");
			if (!imageUpload) setIsSaveBtnLoading(false);

			updateDoc(docRef, {
				userName: userName.trim(),
				updatedOn: serverTimestamp(),
			});
		})
		.catch((err) => {
			setMsg(err.code);
			if (!imageUpload) setIsSaveBtnLoading(false);
			console.log(err.message);
		});
}

async function handleUserProfileChange(imageUpload, setProfilePictureUrl, setMsg, setIsSaveBtnLoading) {
	setIsSaveBtnLoading(true);
	const imageRef = ref(
		storage,
		"profilePicture/" + auth.currentUser.uid + "/" + auth.currentUser.displayName.split(" ")[0] + "_profilePicture"
	);
	const docRef = doc(database, "user_details", auth?.currentUser?.email);

	uploadBytesResumable(imageRef, imageUpload)
		.then((snapshot) => {
			console.log("Uploaded successfully a blob or file!");

			getDownloadURL(snapshot.ref)
				.then((downloadURL) => {
					setProfilePictureUrl(downloadURL);
					localStorage.setItem("user_profile_img", downloadURL);

					const user = auth.currentUser;

					updateProfile(user, { photoURL: downloadURL })
						.then(() => {
							setMsg("Changed successfully");
							setIsSaveBtnLoading(false);

							updateDoc(docRef, {
								profilePicture: downloadURL,
								updatedOn: serverTimestamp(),
							});
						})
						.catch((err) => {
							setMsg(err.code);
							setIsSaveBtnLoading(false);
							console.log(err.message);
						});
				})
				.catch((err) => {
					setIsSaveBtnLoading(false);
					console.log(err.message);
					setMsg(err.code);
				});
		})
		.catch((err) => {
			setIsSaveBtnLoading(false);
			console.log(err.message);
			setMsg(err.code);
		});
}

function handlePasswordChange(changePasswordData, setChangePasswordMsg, setIsChangePasswordBtnLoading) {
	const { currentPassword, newPassword, confPassword } = changePasswordData;
	console.log(changePasswordData);

	if (!currentPassword || !newPassword || !confPassword)
		return setChangePasswordMsg("Please provide all detials") && setIsChangePasswordBtnLoading(false);
	if (newPassword !== confPassword)
		return setChangePasswordMsg("Password does not match.") && setIsChangePasswordBtnLoading(false);
	if (currentPassword.length < 8 || newPassword.length < 8 || confPassword.length < 8)
		return setChangePasswordMsg("Password must be 8 digits.") && setIsChangePasswordBtnLoading(false);

	const user = auth.currentUser;
	const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);

	reauthenticateWithCredential(user, credential)
		.then((cred) => {
			updatePassword(cred.user, newPassword)
				.then(() => {
					setIsChangePasswordBtnLoading(false);
					setChangePasswordMsg("Update successful.");
				})
				.catch((err) => {
					setIsChangePasswordBtnLoading(false);
					setChangePasswordMsg(err.code);
					console.log(err.message);
				});
		})
		.catch((err) => {
			setIsChangePasswordBtnLoading(false);
			setChangePasswordMsg(
				err.code === "auth/too-many-requests"
					? " Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
					: err.code
			);
			console.log(err.message);
		});
}

export {
	handleUserNameChange,
	handlePasswordChange,
	handleUserProfileChange,
	isGoogleOnlyUser,
	handlePasswordCreation,
};
