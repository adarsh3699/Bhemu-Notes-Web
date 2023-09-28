// import { getAuth } from 'firebase/auth';
// import { encryptText, decryptText } from '../utils';

import {
	getFirestore,
	// collection,
	// onSnapshot,
	getDoc,
	// addDoc,
	// deleteDoc,
	updateDoc,
	doc,
	// arrayUnion,
	// arrayRemove,
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

function updateNoteShareAccess(incomingData, setIsSaveBtnLoading, handleErrorShown) {
	const { noteId, noteSharedUsers, isNoteSharedWithAll } = incomingData;

	if (!noteId || noteSharedUsers === '') {
		handleErrorShown('Please Provide all details (noteId, isNoteSharedWithAll)');
		// setIsSaveBtnLoading(false);
		return;
	}
	// setIsSaveBtnLoading(true);

	const docRef = doc(database, 'user_notes', noteId);

	updateDoc(docRef, {
		isNoteSharedWithAll,
		noteSharedUsers,
		lastSharedAt: serverTimestamp(),
	})
		.then(() => {
			// setIsSaveBtnLoading(false);
		})
		.catch((err) => {
			// setIsSaveBtnLoading(false);
			console.log(err.message);
		});
}

function updateUserShareList(incomingData, setIsSaveBtnLoading, handleErrorShown) {
	const { noteId, noteSharedUsers } = incomingData;

	if (!noteId || noteSharedUsers === '') {
		handleErrorShown('Please Provide all details (noteId, noteSharedUsers)');
		console.log('Please Provide all details (noteId, noteSharedUsers)');
		setIsSaveBtnLoading(false);
		return;
	}
	setIsSaveBtnLoading(true);

	noteSharedUsers.forEach(async (user) => {
		const docRef = doc(database, 'user_details', user.email);
		setIsSaveBtnLoading(true);
		console.log(user);

		await getDoc(docRef)
			.then((e) => {
				const oldNotesSharedWithYou = e.data()?.notesSharedWithYou || [];
				// console.log(oldNotesSharedWithYou);

				if (!e.exists()) {
					return setIsSaveBtnLoading(false);
				} else if (oldNotesSharedWithYou?.length !== 0 && oldNotesSharedWithYou !== undefined) {
					for (let i = 0; i < oldNotesSharedWithYou?.length; i++) {
						if (oldNotesSharedWithYou[i]?.noteId === noteId) {
							console.log(oldNotesSharedWithYou[i]);
							return setIsSaveBtnLoading(false);
						}
					}

					updateDoc(docRef, {
						notesSharedWithYou: [{ noteId, canEdit: user.canEdit }, ...oldNotesSharedWithYou],
					})
						.then(() => {
							setIsSaveBtnLoading(false);
							console.log('User Updated');
						})
						.catch((err) => {
							setIsSaveBtnLoading(false);
							console.log(err.message);
						});
				} else {
					updateDoc(docRef, {
						notesSharedWithYou: [{ noteId, canEdit: user.canEdit }],
					})
						.then(() => {
							setIsSaveBtnLoading(false);
							console.log('User Updated');
						})
						.catch((err) => {
							setIsSaveBtnLoading(false);
							console.log(err.message);
						});
				}
			})
			.catch((err) => {
				console.log(err.message);
			});
	});
}

// async function addNoteToUserShareList(noteId, email, handleErrorShown) {
// 	console.log(noteId, email);

// 	if (!noteId || !email) {
// 		handleErrorShown('Please Provide all details (userId, email)');
// 		// setIsSaveBtnLoading(false);
// 		return;
// 	}

// 	// setIsSaveBtnLoading(true);

// 	const docRef = doc(database, 'user_details', email);

// 	await updateDoc(docRef, {
// 		notesSharedWithYou: arrayUnion({ noteId, canEdit: false }),
// 	})
// 		.then(() => {
// 			// setIsSaveBtnLoading(false);
// 			console.log('User Updated');
// 		})
// 		.catch((err) => {
// 			// setIsSaveBtnLoading(false);
// 			console.log(err.message);
// 		});
// }

export { updateNoteShareAccess, updateUserShareList };
