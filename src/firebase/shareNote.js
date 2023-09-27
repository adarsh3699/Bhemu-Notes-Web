// import { getAuth } from 'firebase/auth';
// import { encryptText, decryptText } from '../utils';

import {
	getFirestore,
	// collection,
	// onSnapshot,
	// getDocs,
	// addDoc,
	// deleteDoc,
	updateDoc,
	doc,
	// query,
	// where,
	serverTimestamp,
	// orderBy,
} from 'firebase/firestore';

// const auth = getAuth();
const database = getFirestore();
// collection ref
// const colRef = collection(database, 'user_notes');

// const userId = JSON.parse(localStorage.getItem('user_details'))?.userId || '';

function updateShareNote(incomingData, setIsSaveBtnLoading, handleErrorShown) {
	const { noteId, noteSharedUsers, isNoteSharedWithAll } = incomingData;

	if (!noteId || noteSharedUsers === '') {
		handleErrorShown('Please Provide all details (noteId, isNoteSharedWithAll)');
		setIsSaveBtnLoading(false);
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

export { updateShareNote };
