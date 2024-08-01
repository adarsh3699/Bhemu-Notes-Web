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
						'U2FsdGVkX19ucr/GsG+FS0rif5anE16NH1AjLRJ7D9gEKXSUKMjtfULpOobNULVV/hgf7b8F/0jw/uIYq1BLOjzdLj2+StMgU1Qmrnk97M1ZQn/fv3mlYQMjd2X2fico0KeQBXD13/GvGGtNfDxFCo/2NcXSjuDdju0DdSvCDsx7nzj0eas2bIatdR2QBl1fYtIFgwUN/o+iO0dLY1YUFLyB51TLYYENYcWLV5EbWU00X8d5ET12ltZR+oZkLOk4zapN2fHytkxikELkbeY7bU5TAAwn9n5APGzTrvzAvou7mh6t5T31hE6JfqCABgJY2gbFYdYWNGCWnY93HG/yTNdghX1/UqEz3kTaIbc1+eBT3c6AJC+GYwp639KCL/4wPC08iox+/Cd2azEEGJZiCN/2t8i1AnoNssV1Iy8qB2Rrox13ks/Q1q7EcciVJlldofGc8zp51EreUaLRpXKH6udx24tpEIMOzSbOIZmkjQ2ikGF6D1/34oM8+BX7iUNkL3kZ12J+IzpYY+kvblbWJQEtNmHQDmoIOnEv0dFOqJHaq3zyGHvrejEQvweTGDBjaSjyHrKbDtc6NVgiF5Uz9E70ZqedEOMSGiLnVz0amPKPkD/Jq9E6FeGfynp07aGk7waVd0ntpm0qDw2Sy8T5fOIQ6rbS8MiyLBRmDJr3SZQraGwZUJyaUUNrNQu6Ie27',

					noteData: encryptText(
						`<h1>Welcome to <em>Bhemu Notes</em></h1><p><br></p><h3><em>Bhemu Notes</em> is an advanced note-taking app.</h3>
						<h3>User data and their notes are stored securely in <em><u>encrypted</u></em> form on the server.</h3>
						<p><br></p><h2>New Features:</h2><ul><li>Now you can organise your notes in a <strong>folder.</strong></li>
						<li>Now you can <strong>export</strong> a note as PDF.</li>
						<li>You can <strong>share</strong> a particular note with anyone as a viewer or editor.</li>
						<li>Introduce a new feature in the rice text editor for more creative notes.</li></ul><p><br></p>
						<p>About developer: <a href="https://adarshsuman.social/about" rel="noopener noreferrer" target="_blank">www.adarshsuman.social/about</a></p>
						<p>LinkedIn: <a href="https://www.linkedin.com/in/adarsh3699/" rel="noopener noreferrer" target="_blank"www.linkedin.com/in/adarsh3699/</a></p>
						<p><br></p><p><br></p><h1 class="ql-align-center"><span style="color: rgb(194, 133, 255);">-----Thank you for joining-----</span></h1>`
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
