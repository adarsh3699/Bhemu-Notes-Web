import { database, auth } from './initFirebase';
import { encryptText, decryptText, USER_DETAILS } from '../utils';
import { handleUserState } from './auth';

import { onSnapshot, getDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

function updateNoteShareAccess(incomingData, setIsSaveBtnLoading, handleErrorShown) {
	const { noteId, noteSharedUsers, isNoteSharedWithAll } = incomingData;

	if (!noteId || noteSharedUsers === '') {
		handleErrorShown('Please Provide all details (noteId, isNoteSharedWithAll)');
		// setIsSaveBtnLoading(false);
		return;
	}
	setIsSaveBtnLoading(true);
	const docRef = doc(database, 'user_notes', noteId);

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
			console.log(err.message);
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

//open anonymous sharenote
async function getSearchedNoteData(noteId, setSearchedUserData, setCanEdit, handleMsgShown, setIsGetApiLoading) {
	setIsGetApiLoading(true);
	if (!noteId) return (window.location.href = '/') & console.log('Please Provide Note Id');

	const docRef = doc(database, 'user_notes', noteId);

	onSnapshot(
		docRef,
		async (realSnapshot) => {
			if (!realSnapshot?.data()) return (window.location.href = '/');

			if (USER_DETAILS?.email) handleUserState('ShareNotePage');

			const checkUser = realSnapshot?.data()?.noteSharedUsers?.find((user) => user.email === USER_DETAILS?.email);
			const userPermission = checkUser
				? { userExists: true, canEdit: checkUser.canEdit }
				: { userExists: false, canEdit: false };

			if (!realSnapshot?.data()?.isNoteSharedWithAll && !userPermission.userExists) {
				return (window.location.href = '/');
			}

			const sharedNoteData = {
				noteId: realSnapshot.id,
				noteTitle: decryptText(realSnapshot.data().noteTitle),
				noteText: decryptText(realSnapshot.data().noteText),
				noteData: decryptText(realSnapshot.data().noteData),
				updatedOn: realSnapshot.data().updatedOn,
				noteSharedUsers: realSnapshot.data().noteSharedUsers || [],
				isNoteSharedWithAll: realSnapshot.data().isNoteSharedWithAll,
			};

			setCanEdit(userPermission.canEdit);
			setSearchedUserData(sharedNoteData);

			setIsGetApiLoading(false);
		},
		(err) => {
			setIsGetApiLoading(false);
			console.log(err);
			handleMsgShown(err.code, 'error');
		}
	);
}

//get user all info like share, folders, etc
function getUserAllData(setUserAllDetails, setIsApiLoading, setMsg) {
	const myEmail = auth?.currentUser?.email || USER_DETAILS?.email;
	if (!myEmail) return;
	const docRef = doc(database, 'user_details', myEmail);

	setIsApiLoading(true);
	onSnapshot(
		docRef,
		async (realSnapshot) => {
			await getDoc(docRef)
				.then((snapshot) => {
					const data = snapshot.data();
					setIsApiLoading(false);
					setUserAllDetails(data);

					// const encryptNotesData = encryptText(JSON.stringify(noteData));
					// localStorage.setItem('note_data', encryptNotesData);
					localStorage.setItem('user_details', encryptText(JSON.stringify(data)));
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

function updateUserFolder(incomingData, setIsSaveBtnLoading, setMsg, handleBackBtnClick, isDeleteFolder) {
	const myEmail = auth?.currentUser.email;
	setIsSaveBtnLoading(true);

	const docRef = doc(database, 'user_details', myEmail);
	updateDoc(docRef, {
		userFolders: incomingData,
	})
		.then(() => {
			handleBackBtnClick();
			isDeleteFolder
				? setMsg('Folder deleted successfully', 'success')
				: setMsg('Folder save successfully', 'success');
		})
		.catch((err) => {
			console.log(err.message);
			setMsg(err.code);
		})
		.finally(() => {
			setIsSaveBtnLoading(false);
		});
}

export { updateNoteShareAccess, getSearchedNoteData, updateUserFolder, getUserAllData };
