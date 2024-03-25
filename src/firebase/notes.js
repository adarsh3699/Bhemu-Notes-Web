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
			let allNotesData = [];
			realSnapshot.docs.forEach((doc) => {
				allNotesData.push({
					noteId: doc.id,
					noteData: decryptText(doc.data().noteData),
					noteText: decryptText(doc.data().noteText),
					noteTitle: decryptText(doc.data().noteTitle),
					updatedOn: doc.data().updatedOn,
					noteSharedUsers: doc.data().noteSharedUsers || [],
					isNoteSharedWithAll: doc.data().isNoteSharedWithAll,
				});
			});
			setIsApiLoading(false);
			setAllNotes(allNotesData);
			console.log(allNotesData);

			const encryptNotesData = encryptText(JSON.stringify(allNotesData));
			localStorage.setItem('note_data', encryptNotesData);
		},
		(err) => {
			setIsApiLoading(false);
			console.log('getUserAllNoteData', err);
			setMsg(err.code);
		}
	);
}

//Add Notes
function addNewNote(toSendNoteData, setMyNotesId, setMsg, setIsApiLoading) {
	const userId = auth?.currentUser?.uid;
	const { newNoteText, newNoteData } = toSendNoteData;
	if (!userId || !newNoteText || !newNoteData) return setMsg('addNewNote: Please Provide all details');
	setIsApiLoading(true);
	const encryptNoteText = encryptText(newNoteText?.trim());
	const encryptNoteData = encryptText(newNoteData);

	addDoc(colRef, {
		userId,
		noteTitle: encryptNoteText,
		noteText: encryptNoteText,
		noteData: encryptNoteData,
		isNoteSharedWithAll: false,
		createdAt: serverTimestamp(),
		updatedOn: serverTimestamp(),
	})
		.then((e) => {
			setMyNotesId(e?.id);
		})
		.catch((err) => {
			setMsg(err.code);
			console.log('addNewNote', err);
		})
		.finally(() => {
			setIsApiLoading(false);
		});
}
//delete Notes
function deleteData(noteId, setIsApiLoading, setMsg) {
	if (!noteId) return setMsg('deleteData: Please Provide noteId');
	const docRef = doc(database, 'user_notes', noteId);
	setIsApiLoading(true);
	deleteDoc(docRef)
		.then((e) => {
			console.log('Document successfully deleted!');
		})
		.catch((err) => {
			console.log('deleteData', err.message);
			setMsg(err.code);
		})
		.finally(() => {
			setIsApiLoading(false);
		});
}

//update notes
function updateDocument(upcomingData, setIsSaveBtnLoading, setIsNotesModalOpen, handleMsgShown) {
	const { noteId, noteTitle, noteText, noteData } = upcomingData;
	if (!noteId || !noteText || !noteData || !noteTitle) {
		handleMsgShown('Please Provide all details (noteId, noteText, noteData, noteTitle)');
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
			setIsNotesModalOpen(false);
			handleMsgShown(err.code);
			console.log(err.message);
		})
		.finally(() => {
			setIsSaveBtnLoading(false);
		});
}

function getAllNotesOfFolder(folder, setAllNotes, setIsApiLoading, handleMsgShown) {
	const noteIds = folder.folderData.map((item) => item.noteId);

	try {
		const getDataQuery = query(colRef, where('__name__', 'in', noteIds));
		const unsubscribe = onSnapshot(
			getDataQuery,
			async (realSnapshot) => {
				let folderAllNotesData = [];
				realSnapshot.forEach((doc) => {
					folderAllNotesData.push({
						noteId: doc.id,
						noteTitle: decryptText(doc.data().noteTitle),
						noteText: decryptText(doc.data().noteText),
						noteData: decryptText(doc.data().noteData),
						updatedOn: doc.data().updatedOn,
						noteSharedUsers: doc.data().noteSharedUsers || [],
						isNoteSharedWithAll: doc.data().isNoteSharedWithAll,
					});
				});

				setAllNotes(folderAllNotesData);

				const encryptNotesData = encryptText(JSON.stringify(folderAllNotesData));
				localStorage.setItem(folder.folderName, encryptNotesData);

				unsubscribeFunctionsArray.push(unsubscribe);
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

function unsubscribeAll() {
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
