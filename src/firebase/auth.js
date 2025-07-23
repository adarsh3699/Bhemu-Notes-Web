import { database, auth } from "./initFirebase";

import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	sendEmailVerification,
	signOut,
	onAuthStateChanged,
	sendPasswordResetEmail,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";

import { getDoc, setDoc, addDoc, collection, doc, serverTimestamp } from "firebase/firestore";

import { encryptText, USER_DETAILS } from "../utils";

// Common function to create welcome note for new users
async function createWelcomeNote(userId) {
	const welcomeNoteRef = collection(database, "user_notes");
	await addDoc(welcomeNoteRef, {
		userId: userId,
		noteTitle: encryptText("🎉 Welcome to Bhemu Notes!"),
		noteText:
			"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",

		noteData: encryptText(
			`<h1 class="ql-align-center">🎉 <strong>Welcome to <em><u>Bhemu Notes</u></em>!</strong></h1><p><br></p><p>
			</p><h2>🚀 <strong>Quick Start Guide</strong>
			</h2><ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span><strong>Create a new note</strong> - Click the "+" button or use <strong>Ctrl/Cmd + Alt + N</strong></li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span><strong>Start typing</strong> - Your notes auto-save as you write (or press <strong>Ctrl/Cmd + S</strong>)</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span><strong>Organize with folders</strong> - Group related notes together for better organization</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span><strong>Share with others</strong> - Collaborate by sharing notes with view or edit permissions</li></ol><p><br></p><h2>✨ <strong>Powerful Features</strong></h2>
			<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>🎨 Rich Text Editor</strong> - Format with bold, italic, colors, lists, links, and more</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>📁 Smart Folders</strong> - Organize your notes by projects, topics, or any way you like</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>🤝 Real-time Collaboration</strong> - Share notes and edit together in real-time</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>📤 Export Options</strong> - Save your notes as PDF for sharing or archiving</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>🔒 End-to-End Security</strong> - All your notes are encrypted and stored securely</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>⚡ Lightning Fast</strong> - Instant sync across all your devices</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>📱 Mobile Friendly</strong> - Works perfectly on desktop, tablet, and mobile</li></ol><p>			</p><h2>⌨️ <strong>Keyboard Shortcuts</strong></h2><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Ctrl/Cmd + S</strong> - Save current note</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Ctrl/Cmd + Alt + N</strong> - Create new note</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Ctrl/Cmd + B</strong> - Bold text</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Ctrl/Cmd + I</strong> - Italic text</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>Ctrl/Cmd + U</strong> - Underline text</li></ol><p>
			</p><h2>💡 <strong>Pro Tips</strong></h2><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>📍 Pin important notes</strong> - Keep frequently used notes at the top</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>🔍 Use descriptive titles</strong> - Makes finding notes super easy later</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>🏷️ Create themed folders</strong> - "Work", "Personal", "Ideas", "Research", etc.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>📧 Share strategically</strong> - Give edit access only when needed, view access otherwise</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><strong>💾 Regular exports</strong> - Backup important notes as PDFs</li></ol><p>
			</p><blockquote><em>"Your ideas deserve a beautiful home. Welcome to Bhemu Notes - where thoughts become organized, shareable, and secure digital assets."</em></blockquote><p>
			</p><h3>🔗 <strong>Connect &amp; Support</strong></h3><p><strong>Developer:</strong> <a href="https://www.bhemu.me/" rel="noopener noreferrer" target="_blank">www.bhemu.me</a></p><p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/adarsh3699/" rel="noopener noreferrer" target="_blank">www.linkedin.com/in/adarsh3699/</a></p><p><strong>GitHub:</strong> <a href="https://github.com/adarsh3699" rel="noopener noreferrer" target="_blank">github.com/adarsh3699</a></p><p><br></p><p>	</p><h1 class="ql-align-center"><span style="color: rgb(46, 204, 113);">🎊 Ready to create something amazing? Let's go! 🎊</span></h1><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><em>Feel free to delete this note when you're ready to start your note-taking journey!</em></p>`
		),
		isNoteSharedWithAll: false,
		createdAt: serverTimestamp(),
		updatedOn: serverTimestamp(),
	});
}

function handleLoginForm(e, setMsg, setIsApiLoading) {
	e.preventDefault();
	const email = e.target.email.value;
	const password = e.target.password.value;

	if (!email || !password) return setMsg("Please Enter Your Email and Password");
	setIsApiLoading(true);

	signInWithEmailAndPassword(auth, email, password)
		.then((cred) => {
			setIsApiLoading(false);
			localStorage.setItem("user_profile_img", cred?.user?.photoURL);
			localStorage.setItem(
				"user_details",
				encryptText(
					JSON.stringify({
						userName: cred?.user?.displayName,
						email,
						userId: cred?.user?.uid,
					})
				)
			);
			document.location.href = "/";
		})
		.catch((err) => {
			setIsApiLoading(false);
			setMsg(err.code);
		});
}

async function handleGoogleLogin(setMsg, setIsApiLoading) {
	setIsApiLoading(true);
	const provider = new GoogleAuthProvider();

	try {
		const result = await signInWithPopup(auth, provider);
		const user = result.user;

		// Store user profile image
		localStorage.setItem("user_profile_img", user?.photoURL || "");

		// Store user details
		localStorage.setItem(
			"user_details",
			encryptText(
				JSON.stringify({
					userName: user?.displayName || user?.email?.split("@")[0],
					email: user?.email,
					userId: user?.uid,
				})
			)
		);

		// Check if user exists in Firestore, if not create user document
		const docRef = doc(database, "user_details", user.email);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			// Create user document for first-time Google users
			await setDoc(docRef, {
				userName: user?.displayName || user?.email?.split("@")[0],
				email: user?.email,
				userId: user?.uid,
				createdOn: serverTimestamp(),
				lastloginedOn: serverTimestamp(),
			});

			// Create welcome note for new Google users
			await createWelcomeNote(user?.uid);
		} else {
			// Update last login time for existing users
			await setDoc(
				docRef,
				{
					lastloginedOn: serverTimestamp(),
				},
				{ merge: true }
			);
		}

		setIsApiLoading(false);
		document.location.href = "/";
	} catch (error) {
		setIsApiLoading(false);
		console.error("Google sign-in error:", error);

		// Handle specific error cases
		if (error.code === "auth/popup-closed-by-user") {
			setMsg("Sign-in cancelled");
		} else if (error.code === "auth/popup-blocked") {
			setMsg("Popup blocked. Please allow popups for this site");
		} else {
			setMsg("Failed to sign in with Google. Please try again.");
		}
	}
}

async function handleSignUpForm(e, setMsg, setIsApiLoading) {
	e.preventDefault();

	const email = e.target.email.value;
	const password = e.target.password.value;
	const confPassword = e.target.confPassword.value;
	const userName = e.target.userName.value;

	if (!email || !password || !confPassword || !userName) return setMsg("Please enter all data");
	if (password !== confPassword) return setMsg("Passwords didn't match.");

	setIsApiLoading(true);

	const docRef = doc(database, "user_details", email);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		setMsg("Email already exists");
		console.log("Email already exists");
		setIsApiLoading(false);
	} else {
		createUserWithEmailAndPassword(auth, email, password)
			.then(async (cred) => {
				sendEmailVerification(cred.user).then(() => {
					// setMsg('Email verification sent. Please also check in spam');
				});

				// Create welcome note for new email/password users
				await createWelcomeNote(cred?.user?.uid);

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
									"user_details",
									encryptText(
										JSON.stringify({
											userName,
											email,
											userId: cred?.user?.uid,
										})
									)
								);
								document.location.href = "/";
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
				console.log("createUserWithEmailAndPassword", err);
			});
	}
}

function handleSignOut() {
	signOut(auth)
		.then(() => {
			localStorage.clear();
			document.location.href = "/login";
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
			setMsg("Password reset email sent. Please also check spam");
		})
		.catch((error) => {
			setIsOTPApiLoading(false);
			setMsg(error.code);
			console.log(error.code);
		});
}

function handleUserState(currentPage) {
	if (!currentPage) return console.log("Missing currentPage");

	onAuthStateChanged(auth, (user) => {
		if (currentPage && user === null) {
			handleSignOut();
		} else if (USER_DETAILS?.email !== user?.email || USER_DETAILS?.userId !== user?.uid) {
			handleSignOut();
		}
	});
}

export { handleSignUpForm, handleLoginForm, handleGoogleLogin, handleSignOut, handleUserState, handleForgetPassword };
