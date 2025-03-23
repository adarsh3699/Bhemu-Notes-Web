import { auth, database } from './initFirebase';
import { encryptText, decryptText, USER_DETAILS } from '../utils';
import { handleUserState } from './auth';

import {
	collection,
	onSnapshot,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
	query,
	where,
	serverTimestamp,
	orderBy,
} from 'firebase/firestore';

// collection ref
const colRef = collection(database, 'user_notes');
let unsubscribeFolderFunctions = [];
let unsubscribeNoteFunctions = [];

//get user all notes
function getUserAllNoteData(setAllNotes, setIsApiLoading, setMsg, handleNoteOpening, isDesktopMode) {
	const getDataQuery = query(colRef, where('userId', '==', USER_DETAILS?.userId || ''), orderBy('updatedOn', 'desc')); // orderBy('name', 'desc || ase')
	setIsApiLoading(true);

	onSnapshot(
		getDataQuery,
		async (realSnapshot) => {
			let allNotesData = [];
			const urlNoteId = window.location.hash.slice(1);
			const folderName = new URL(document.location).searchParams.get('folder');

			realSnapshot.docs.forEach((doc, index) => {
				allNotesData.push({
					index,
					noteId: doc.id,
					noteData: decryptText(doc.data().noteData),
					noteText: decryptText(doc.data().noteText),
					noteTitle: decryptText(doc.data().noteTitle),
					isLocked: doc.data().isLocked,
					updatedOn: doc.data().updatedOn,
					noteSharedUsers: doc.data().noteSharedUsers || [],
					isNoteSharedWithAll: doc.data().isNoteSharedWithAll,
				});
			});
			setIsApiLoading(false);
			setAllNotes(allNotesData);
			const encryptNotesData = encryptText(JSON.stringify(allNotesData));
			localStorage.setItem('note_data', encryptNotesData);

			if (!urlNoteId && !folderName && allNotesData.length > 0 && isDesktopMode) {
				handleNoteOpening(0, allNotesData?.[0] || []);
			}
		},
		(err) => {
			setIsApiLoading(false);
			console.log('getUserAllNoteData', err);
			setMsg(err.code);
		}
	);
}

//get folder all notes
function getAllNotesOfFolder(
	folder,
	setAllNotes,
	setIsApiLoading,
	handleMsgShown,
	folderName,
	handleNoteOpening,
	isDesktopMode
) {
	const noteIds = folder.folderData.map((item) => item.noteId);

	try {
		const getDataQuery = query(colRef, where('__name__', 'in', noteIds));
		const unsubscribe = onSnapshot(
			getDataQuery,
			async (realSnapshot) => {
				let folderAllNotesData = [];
				const urlNoteId = window.location.hash.slice(1);
				realSnapshot.forEach((doc, index) => {
					folderAllNotesData.push({
						index,
						noteId: doc.id,
						noteData: decryptText(doc.data().noteData),
						noteText: decryptText(doc.data().noteText),
						noteTitle: decryptText(doc.data().noteTitle),
						isLocked: doc.data().isLocked,
						updatedOn: doc.data().updatedOn,
						noteSharedUsers: doc.data().noteSharedUsers || [],
						isNoteSharedWithAll: doc.data().isNoteSharedWithAll,
					});
				});

				setAllNotes(folderAllNotesData);
				if (folderName && !urlNoteId && isDesktopMode) {
					handleNoteOpening(0, folderAllNotesData?.[0] || [], folderName);
				}
				const encryptNotesData = encryptText(JSON.stringify(folderAllNotesData));
				localStorage.setItem(folder.folderName, encryptNotesData);

				unsubscribeFolderFunctions.push(unsubscribe);
			},
			(err) => {
				setIsApiLoading(false);
				console.log(err);
				handleMsgShown(err.code);
			}
		);
	} catch (error) {
		console.log('getAllNotesOfFolder', error);
		handleMsgShown(error.message);
	}
}

//Add Notes
function addNewNote(toSendNoteData, setMsg, setIsApiLoading, isSharedNoteType) {
	const userId = auth?.currentUser?.uid;
	const { newNoteText, newNoteData } = toSendNoteData;
	if (!userId || !newNoteText || !newNoteData) return setMsg('addNewNote: Please Provide all details');
	setIsApiLoading(true);
	const encryptNoteText = encryptText(newNoteText?.trim());
	const encryptNoteData = encryptText(newNoteData);
	const toAdd = {
		userId,
		noteTitle: encryptNoteText,
		noteText: encryptNoteText,
		noteData: encryptNoteData,
		isNoteSharedWithAll: false,
		isDeleted: false,
		isLocked: false,
		createdAt: serverTimestamp(),
		updatedOn: serverTimestamp(),
	};
	addDoc(colRef, toAdd)
		.then((e) => {
			if (isSharedNoteType) window.location.href = '/';
		})
		.catch((err) => {
			setMsg(err.code);
			console.log('addNewNote:', err);
		})
		.finally(() => {
			setIsApiLoading(false);
		});
}

//delete Notes
function deleteData(
	noteId,
	setIsApiLoading,
	setMsg,
	index,
	userAllNotes,
	handleNoteOpening,
	isDesktopMode,
	handleNotesModalClosing
) {
	if (!noteId) return setMsg('deleteData: Please Provide noteId');
	const docRef = doc(database, 'user_notes', noteId);
	setIsApiLoading(true);
	deleteDoc(docRef)
		.then(() => {
			if (isDesktopMode)
				index === 0 ? handleNoteOpening(0, userAllNotes[1]) : handleNoteOpening(0, userAllNotes[0]);
			else handleNotesModalClosing();
		})
		.catch((err) => {
			console.log('deleteData:', err);
			setMsg(err.message);
		})
		.finally(() => {
			setIsApiLoading(false);
		});
}

//update notes
function updateDocument(upcomingData, setIsSaveBtnLoading, handleMsgShown) {
	const { noteId, noteTitle, noteText, noteData } = upcomingData;
	if (!noteId || !noteText || !noteData || !noteTitle) {
		handleMsgShown('Please Create a note first', 'warning');
		console.log('updateDocument: Please Provide all details (noteId, noteText, noteData, noteTitle)');
		setIsSaveBtnLoading(false);
		return;
	}

	const docRef = doc(database, 'user_notes', noteId);

	updateDoc(docRef, {
		noteTitle: encryptText(noteTitle?.trim() || ''),
		noteData: encryptText(noteData),
		noteText: encryptText(noteText),
		updatedOn: serverTimestamp(),
	})
		.catch((err) => {
			handleMsgShown(err.message);
			console.log('updateDoc:', err);
		})
		.finally(() => {
			setIsSaveBtnLoading(false);
		});
}

async function getOpenNoteData(
	noteId,
	setOpenedNoteAllData,
	setOpenedNoteText,
	setIsApiLoading,
	handleMsgShown,
	handleNoteOpening,
	isSharedNoteType
) {
	isSharedNoteType && setIsApiLoading(true);
	if (!noteId) return console.log('getOpenNoteData: Please Provide Note Id');

	const docRef = doc(database, 'user_notes', noteId);

	const unsubscribe = onSnapshot(
		docRef,
		async (realSnapshot) => {
			if (!realSnapshot?.data()) return isSharedNoteType ? handleNoteOpening('/login') : handleNoteOpening(0);
			if (USER_DETAILS?.email) handleUserState(true);

			const checkUser = realSnapshot?.data()?.noteSharedUsers?.find((user) => user.email === USER_DETAILS?.email);
			const userPermission = checkUser
				? { userExists: true, canEdit: checkUser.canEdit }
				: { userExists: false, canEdit: false };

			if (isSharedNoteType && !realSnapshot?.data()?.isNoteSharedWithAll && !userPermission.userExists) {
				return handleNoteOpening('/login');
			}

			const sharedNoteData = {
				noteId: realSnapshot.id,
				noteTitle: decryptText(realSnapshot.data().noteTitle),
				noteText: decryptText(realSnapshot.data().noteText),
				noteData: decryptText(realSnapshot.data().noteData),
				canEdit: userPermission.canEdit,
				updatedOn: realSnapshot.data().updatedOn,
				noteSharedUsers: realSnapshot.data().noteSharedUsers || [],
				isNoteSharedWithAll: realSnapshot.data().isNoteSharedWithAll,
			};
			setOpenedNoteText(sharedNoteData.noteData);
			setOpenedNoteAllData(sharedNoteData);

			unsubscribeNoteFunctions.push(unsubscribe);
			isSharedNoteType && setIsApiLoading(false);
		},
		(err) => {
			isSharedNoteType && setIsApiLoading(false);
			console.log('getOpenNoteData:', err);
			handleMsgShown(err.code, 'error');
		}
	);
}

// async function getSearchedNoteData(
// 	noteId,
// 	setSearchedUserData,
// 	setOpenedNoteAllData,
// 	handleMsgShown,
// 	setIsGetApiLoading
// ) {
// 	setIsGetApiLoading(true);
// 	if (!noteId) return (window.location.href = '/login') & console.log('Please Provide Note Id');

// 	const docRef = doc(database, 'user_notes', noteId);

// 	const unsubscribe = onSnapshot(
// 		docRef,
// 		async (realSnapshot) => {
// 			if (!realSnapshot?.data()) return (window.location.href = '/login');

// 			if (USER_DETAILS?.email) handleUserState('ShareNotePage');

// 			const checkUser = realSnapshot?.data()?.noteSharedUsers?.find((user) => user.email === USER_DETAILS?.email);
// 			const userPermission = checkUser
// 				? { userExists: true, canEdit: checkUser.canEdit }
// 				: { userExists: false, canEdit: false };

// 			if (!realSnapshot?.data()?.isNoteSharedWithAll && !userPermission.userExists) {
// 				return (window.location.href = '/login');
// 			}

// 			const sharedNoteData = {
// 				index: 0,
// 				noteId: realSnapshot.id,
// 				noteTitle: decryptText(realSnapshot.data().noteTitle),
// 				noteText: decryptText(realSnapshot.data().noteText),
// 				noteData: decryptText(realSnapshot.data().noteData),
// 				canEdit: userPermission.canEdit,
// 				updatedOn: realSnapshot.data().updatedOn,
// 				noteSharedUsers: realSnapshot.data().noteSharedUsers || [],
// 				isNoteSharedWithAll: realSnapshot.data().isNoteSharedWithAll,
// 			};

// 			setSearchedUserData([sharedNoteData]);
// 			setOpenedNoteAllData(sharedNoteData);
// 			setIsGetApiLoading(false);
// 			unsubscribeNoteFunctions.push(unsubscribe);
// 		},
// 		(err) => {
// 			setIsGetApiLoading(false);
// 			console.log(err);
// 			handleMsgShown(err.code, 'error');
// 		}
// 	);
// }

function unsubscribeAllFolders() {
	unsubscribeFolderFunctions.forEach((unsubscribe) => unsubscribe());
	// Clear the array after unsubscribing all listeners
	unsubscribeFolderFunctions = [];
}

function unsubscribeAllNotes() {
	unsubscribeNoteFunctions.forEach((unsubscribe) => unsubscribe());
	// Clear the array after unsubscribing all listeners
	unsubscribeNoteFunctions = [];
}

// console.log(getAllNotesOfFolder().unsubscribe);

export {
	getUserAllNoteData,
	addNewNote,
	deleteData,
	updateDocument,
	getOpenNoteData,
	getAllNotesOfFolder,
	unsubscribeAllFolders,
	unsubscribeAllNotes,
};
