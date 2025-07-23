import { database, auth } from "./initFirebase";
import { encryptText, USER_DETAILS } from "../utils";

import { onSnapshot, getDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";

function updateNoteShareAccess(incomingData, setIsSaveBtnLoading, handleErrorShown) {
	const { noteId, noteSharedUsers, isNoteSharedWithAll } = incomingData;

	if (!noteId || noteSharedUsers === "") {
		handleErrorShown("Please Provide all details (noteId, isNoteSharedWithAll)");
		// setIsSaveBtnLoading(false);
		return;
	}
	setIsSaveBtnLoading(true);
	const docRef = doc(database, "user_notes", noteId);

	updateDoc(docRef, {
		isNoteSharedWithAll,
		noteSharedUsers,
		lastSharedAt: serverTimestamp(),
	})
		.then(() => {
			setIsSaveBtnLoading(false);
		})
		.catch((err) => {
			setIsSaveBtnLoading(false);
			console.log("updateNoteShareAccess:", err);
			handleErrorShown(err.message);
		});
}

// function updateUserShareList(incomingData, setIsSaveBtnLoading, handleErrorShown) {
// 	const { noteId, noteSharedUsers } = incomingData;

// 	if (!noteId || noteSharedUsers === '') {
// 		handleErrorShown('Please Provide all details (noteId, noteSharedUsers)');
// 		console.log('Please Provide all details (noteId, noteSharedUsers)');
// 		setIsSaveBtnLoading(false);
// 		return;
// 	}
// 	setIsSaveBtnLoading(true);

// 	noteSharedUsers.forEach(async (user) => {
// 		const docRef = doc(database, 'user_details', user.email);

// 		await getDoc(docRef)
// 			.then((e) => {
// 				const oldNotesSharedWithYou = e.data()?.notesSharedWithYou || [];
// 				console.log(oldNotesSharedWithYou);

// 				if (e.exists()) {
// 					updateDoc(docRef, {
// 						notesSharedWithYou: [noteId],
// 					})
// 						.then(() => {
// 							setIsSaveBtnLoading(false);
// 							console.log('User Updated');
// 						})
// 						.catch((err) => {
// 							setIsSaveBtnLoading(false);
// 							console.log(err.message);
// 						});
// 				}
// 			})
// 			.catch((err) => {
// 				console.log(err.message);
// 				setIsSaveBtnLoading(false);
// 			});
// 	});
// }

//get user all info like share, folders, etc
function getUserAllData(setUserAllDetails, setIsApiLoading, setMsg) {
	const myEmail = auth?.currentUser?.email || USER_DETAILS?.email;
	if (!myEmail) return;
	const docRef = doc(database, "user_details", myEmail);

	setIsApiLoading(true);
	onSnapshot(
		docRef,
		async (_realSnapshot) => {
			await getDoc(docRef)
				.then((snapshot) => {
					const data = snapshot.data();
					setIsApiLoading(false);
					setUserAllDetails(data);

					// const encryptNotesData = encryptText(JSON.stringify(noteData));
					// localStorage.setItem('note_data', encryptNotesData);
					localStorage.setItem("user_details", encryptText(JSON.stringify(data)));
				})
				.catch((err) => {
					setIsApiLoading(false);
					console.log(err.message);
					setMsg(err.code);
				});
		},
		(err) => {
			setIsApiLoading(false);
			console.log(err);
			setMsg(err.code);
		}
	);
}

function updateUserFolder(incomingData, setIsSaveBtnLoading, setMsg, handleBackBtnClick, isDeleteFolder, folderName) {
	const myEmail = auth?.currentUser.email;
	setIsSaveBtnLoading(true);

	const docRef = doc(database, "user_details", myEmail);
	updateDoc(docRef, {
		userFolders: incomingData,
	})
		.then(() => {
			handleBackBtnClick();
			if (isDeleteFolder) {
				localStorage.removeItem(folderName);
				setMsg("Folder deleted successfully", "success");
			} else {
				setMsg("Folder save successfully", "success");
				// const encryptNotesData = encryptText(JSON.stringify(incomingData));
				// localStorage.setItem(folderName, encryptNotesData);
			}
		})
		.catch((err) => {
			console.log(err.message);
			setMsg(err.code);
		})
		.finally(() => {
			setIsSaveBtnLoading(false);
		});
}

export { updateNoteShareAccess, updateUserFolder, getUserAllData };
