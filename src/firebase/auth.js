import { database, auth } from './initFirebase';

import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	sendEmailVerification,
	signOut,
	onAuthStateChanged,
	sendPasswordResetEmail,
} from 'firebase/auth';

import { getDoc, setDoc, addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';

import { encryptText, USER_DETAILS } from '../utils';

function handleLoginForm(e, setMsg, setIsApiLoading) {
	e.preventDefault();
	const email = e.target.email.value;
	const password = e.target.password.value;

	if (!email || !password) return setMsg('Please Enter Your Email and Password');
	setIsApiLoading(true);

	signInWithEmailAndPassword(auth, email, password)
		.then((cred) => {
			setIsApiLoading(false);
			localStorage.setItem('user_profile_img', cred?.user?.photoURL);
			localStorage.setItem(
				'user_details',
				encryptText(
					JSON.stringify({
						userName: cred?.user?.displayName,
						email,
						userId: cred?.user?.uid,
					})
				)
			);
			document.location.href = '/';
		})
		.catch((err) => {
			setIsApiLoading(false);
			setMsg(err.code);
		});
}

async function handleSignUpForm(e, setMsg, setIsApiLoading) {
	e.preventDefault();

	const email = e.target.email.value;
	const password = e.target.password.value;
	const confPassword = e.target.confPassword.value;
	const userName = e.target.userName.value;

	if (!email || !password || !confPassword || !userName) return setMsg('Please enter all data');
	if (password !== confPassword) return setMsg("Passwords didn't match.");

	setIsApiLoading(true);

	const docRef = doc(database, 'user_details', email);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		setMsg('Email already exists');
		console.log('Email already exists');
		setIsApiLoading(false);
	} else {
		createUserWithEmailAndPassword(auth, email, password)
			.then((cred) => {
				sendEmailVerification(cred.user).then(() => {
					// setMsg('Email verification sent. Please also check in spam');
				});

				addDoc(collection(database, 'user_notes'), {
					userId: cred?.user?.uid,
					noteTitle: encryptText('Welcome to Bhemu Notes'),
					noteText:
						'U2FsdGVkX1/fwTR0hPGpV/eoPnACYhAfSp18C/5NtFq2E1SQ7WODpF7AFhjuc4udRgx/kY2pafeLx/cUewGPbsWsqajwCNOUu+GpcYpyxnX1x/r9cEd5GEmkOsHctQ5WgFlenGjNEvNFIryrtBOcvCzpURf4o754axdlrobrG0lvKNQG40ZhYHvhXEtiqNKVaaIAP+CZ5SpiSMCvpG+Sma54IMNKyLgiRMYFGGyD3+Nq9GXnCA84ml7g6erN/poyUdOrMfLFr/p0NWHEfwbmPu0taieEdNytzFHnYX6YeTkjumF0Sy/NM/gB+I3dLMlMjWpz6gTWjPBJ6K4qyOa8CyzNRIEv5Cx5xScT0Mqluz34E8XhCQ+GWtiN5p+utM6YiJn2tBL6JnVk4VfPcMuPOlpDxNork0fX6MOytWKtKoPjYpV60lqK28gdi/cindT6hGZ1zsHuWdGgQFy09aqc8mIWRb5CpKuiTUjxB8WNm07do3KrYXGkpZrFBZmmqAUIxQ3fVBxm6ndu9FzrBjHa9ojJ+tnQQf4YtkukfdztvN0rLFr+dQDs9QjN1Al3oDVv5HZCe7Q/OO/GqqVAg/+5djOLIgrGPE+SuV7pA5s/Pgg=',

					noteData: encryptText(
						`<h1>Welcome to <em>Bhemu Notes</em></h1>
						<p><br></p><h3>This is an advanced notes app called <em>Bhemu Notes.</em></h3>
						<h3>User data and their notes are stored securely in <em><u>encrypted</u></em> form on the server.</h3>
						<p><br></p><h2>New Features:</h2><ul><li>Now you can organise your notes in a folder</li>
						<li>You can send a particular note to anyone</li><li>Introduce new features in the in the rice text editor.</li></ul>
						<p><br></p><p>Know more: <a href="https://bhemu.me/works" rel="noopener noreferrer" target="_blank" style="color: rgb(102, 163, 224);">https://bhemu.me/works</a></p>
						<p>About developer:<span style="color: rgb(102, 163, 224);"> </span><a href="https://www.bhemu.me/about" rel="noopener noreferrer" target="_blank" style="color: rgb(102, 163, 224);">https://www.bhemu.me/about</a>
						</p><p><br></p><p><br></p><h1 class="ql-align-center"><span style="color: rgb(194, 133, 255);">-----Thank you for joining-----</span></h1>`
					),
					isNoteSharedWithAll: false,
					createdAt: serverTimestamp(),
					updatedOn: serverTimestamp(),
				});

				updateProfile(cred.user, { displayName: userName })
					.then(() => {
						setDoc(docRef, {
							userName,
							email,
							userId: cred?.user?.uid,
							createdOn: serverTimestamp(),
							lastloginedOn: serverTimestamp(),
						})
							.then(() => {
								setIsApiLoading(false);
								localStorage.setItem(
									'user_details',
									encryptText(
										JSON.stringify({
											userName,
											email,
											userId: cred?.user?.uid,
										})
									)
								);
								document.location.href = '/';
							})
							.catch((err) => {
								setIsApiLoading(false);
								setMsg(err.code);
								console.log(err.code);
							});
					})
					.catch((err) => {
						setIsApiLoading(false);
						setMsg(err.code);
						console.log(err.code);
					});
			})
			.catch((err) => {
				setIsApiLoading(false);
				setMsg(err.code);
				console.log('createUserWithEmailAndPassword', err);
			});
	}
}

function handleSignOut() {
	signOut(auth)
		.then(() => {
			localStorage.clear();
			document.location.href = '/login';
		})
		.catch((err) => {
			console.log(err.code);
			alert(err.code);
		});
}

function handleForgetPassword(e, setMsg, setIsOTPApiLoading) {
	e.preventDefault();

	const email = e.target.email.value;
	sendPasswordResetEmail(auth, email)
		.then(() => {
			setIsOTPApiLoading(false);
			setMsg('Password reset email sent. Please also check spam');
		})
		.catch((error) => {
			setIsOTPApiLoading(false);
			setMsg(error.code);
			console.log(error.code);
		});
}

function handleUserState(currentPage) {
	if (!currentPage) return console.log('Missing currentPage');

	onAuthStateChanged(auth, (user) => {
		if (currentPage && user === null) {
			handleSignOut();
		} else if (USER_DETAILS?.email !== user?.email || USER_DETAILS?.userId !== user?.uid) {
			handleSignOut();
		}
	});
}

export { handleSignUpForm, handleLoginForm, handleSignOut, handleUserState, handleForgetPassword };
