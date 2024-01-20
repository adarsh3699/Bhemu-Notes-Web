import { auth, database } from './initFirebase';
import { encryptText, decryptText, USER_DETAILS } from '../utils';

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
let unsubscribeFunctionsArray = [];

function getUserAllNoteData(setAllNotes, setIsApiLoading, setMsg) {
	const getDataQuery = query(colRef, where('userId', '==', USER_DETAILS?.userId || ''), orderBy('updatedOn', 'desc')); // orderBy('name', 'desc || ase')
	setIsApiLoading(true);
	onSnapshot(
		getDataQuery,
		async (realSnapshot) => {
			let noteData = [];
			realSnapshot.docs.forEach((doc) => {
				noteData.push({
					notesId: doc.id,
					notesTitle: decryptText(doc.data().notesTitle),
					noteData: JSON.parse(decryptText(doc.data().noteData)),
					updatedOn: doc.data().updatedOn,
					noteSharedUsers: doc.data().noteSharedUsers || [],
					isNoteSharedWithAll: doc.data().isNoteSharedWithAll,
				});
			});
			setIsApiLoading(false);
			setAllNotes(noteData);

			const encryptNotesData = encryptText(JSON.stringify(noteData));
			localStorage.setItem('note_data', encryptNotesData);
		},
		(err) => {
			setIsApiLoading(false);
			console.log(err);
			setMsg(err.code);
		}
	);
}

//Add Notes
function addNewNote(upcomingData, setMyNotesId, setMsg, setIsApiLoading) {
	const userId = auth?.currentUser?.uid;
	const { newNotesTitle, newNoteData } = upcomingData;
	const encryptTitle = encryptText(newNotesTitle ? newNotesTitle?.trim() : newNotesTitle);
	const stringifyedNoteData = JSON.stringify(newNoteData);
	const encryptNoteData = encryptText(stringifyedNoteData);

	addDoc(colRef, {
		userId,
		notesTitle: encryptTitle,
		noteData: encryptNoteData,
		createdAt: serverTimestamp(),
		updatedOn: serverTimestamp(),
	})
		.then((e) => {
			setMyNotesId(e?.id);
			setIsApiLoading(false);
		})
		.catch((err) => {
			setIsApiLoading(false);
			setMsg(err.code);
			console.log(err);
		});
}
//delete Notes
function deleteData(noteId, setIsApiLoading, setMsg) {
	if (!noteId) return setMsg('Please Provide all details');
	const docRef = doc(database, 'user_notes', noteId);
	setIsApiLoading(true);
	deleteDoc(docRef)
		.then((e) => {
			setIsApiLoading(false);
		})
		.catch((err) => {
			console.log(err.message);
			setMsg(err.code);
		});
}

//update notes
function updateDocument(upcomingData, setIsSaveBtnLoading, setIsNotesModalOpen, setMsg) {
	const { noteId, notesTitle, noteData } = upcomingData;
	if (!noteId || !notesTitle || !noteData) {
		setMsg('Please Provide all details (noteId, notesTitle, noteData)');
		setIsSaveBtnLoading(false);
		return;
	}
	const encryptTitle = encryptText(notesTitle ? notesTitle?.trim() : notesTitle);
	const stringifyedNoteData = JSON.stringify(noteData);
	const encryptNoteData = encryptText(stringifyedNoteData);

	const docRef = doc(database, 'user_notes', noteId);

	updateDoc(docRef, {
		notesTitle: encryptTitle,
		noteData: encryptNoteData,
		updatedOn: serverTimestamp(),
	})
		.then(() => {
			setIsSaveBtnLoading(false);
		})
		.catch((err) => {
			setIsNotesModalOpen(false);
			setIsSaveBtnLoading(false);
			console.log(err.message);
		});
}

<<<<<<< HEAD
function getAllNotesOfFolder(folder, setAllNotes, setIsApiLoading, setMsg) {
	// console.log('folder', folder);
	const noteIds = folder.folderData.map((item) => item.notesId);
	console.log(noteIds);
=======
function getAllNotesOfFolder(folder, setAllNotes, setIsApiLoading, handleMsgShown) {
	const noteIds = folder.folderData.map((item) => item.notesId);
>>>>>>> 2d75ce5 (Refactor code and update folder functionality)

	const getDataQuery = query(colRef, where('__name__', 'in', noteIds));
	const unsubscribe = onSnapshot(
		getDataQuery,
		async (realSnapshot) => {
			let noteData = [];
			realSnapshot.forEach((doc) => {
				noteData.push({
					notesId: doc.id,
					notesTitle: decryptText(doc.data().notesTitle),
					noteData: JSON.parse(decryptText(doc.data().noteData)),
					updatedOn: doc.data().updatedOn,
					noteSharedUsers: doc.data().noteSharedUsers || [],
					isNoteSharedWithAll: doc.data().isNoteSharedWithAll,
				});
			});
<<<<<<< HEAD
			console.log(noteData);
=======
			setAllNotes(noteData);

			const encryptNotesData = encryptText(JSON.stringify(noteData));
			localStorage.setItem(folder.folderName, encryptNotesData);
>>>>>>> 2d75ce5 (Refactor code and update folder functionality)

			unsubscribeFunctionsArray.push(unsubscribe);
		},
		(err) => {
<<<<<<< HEAD
			// setIsApiLoading(false);
			console.log(err);
			// setMsg(err.code);
=======
			setIsApiLoading(false);
			console.log(err);
			handleMsgShown(err.code);
>>>>>>> 2d75ce5 (Refactor code and update folder functionality)
		}
	);
}

function unsubscribeAll() {
<<<<<<< HEAD
	console.log('unsubscribeFunctions', unsubscribeFunctionsArray);
=======
>>>>>>> 2d75ce5 (Refactor code and update folder functionality)
	unsubscribeFunctionsArray.forEach((unsubscribe) => unsubscribe());
	// Clear the array after unsubscribing all listeners
	unsubscribeFunctionsArray = [];
}

// console.log(getAllNotesOfFolder().unsubscribe);

export {
	getUserAllNoteData,
	addNewNote,
	deleteData,
	updateDocument,
	getAllNotesOfFolder,
	unsubscribeAll,
	unsubscribeFunctionsArray,
};
