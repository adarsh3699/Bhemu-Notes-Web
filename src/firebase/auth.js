import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
} from 'firebase/auth';

const auth = getAuth();

const userId = JSON.parse(localStorage.getItem('user_details'))?.userId || '';

function handleLoginForm(e, setMsg) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) return setMsg('Please Enter Your Email and Password');

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            localStorage.setItem(
                'user_details',
                JSON.stringify({ userName: cred?.user?.displayName, email, userId: cred?.user?.uid })
            );
            document.location.href = '/home';
        })
        .catch((err) => {
            setMsg(err.code);
        });
}

function handleSignUpForm(e, setMsg) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const confPassword = e.target.confPassword.value;
    const userName = e.target.userName.value;

    if (!email || !password || !confPassword || !userName) return setMsg('Please enter all data');
    if (password !== confPassword) return setMsg("Passwords didn't match.");

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            sendEmailVerification(cred.user).then(() => {
                // setMsg('Email verification sent. Please also check in spam');
            });

            updateProfile(cred.user, { displayName: userName })
                .then(() => {
                    console.log('user signed');
                    localStorage.setItem('user_details', JSON.stringify({ userName, email, userId: cred?.user?.uid }));
                    document.location.href = '/home';
                })
                .catch((err) => {
                    setMsg(err.code);
                });
        })
        .catch((err) => {
            setMsg(err.code);
        });
}

function handleSignOut() {
    signOut(auth)
        .then(() => {
            document.location.href = '/';
            console.log('sgined out');
        })
        .catch((err) => {
            console.log(err.code);
        });
}

function handleForgetPassword(e, setMsg) {
    e.preventDefault();

    const email = e.target.email.value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            setMsg('Password reset email sent. Please also check spam');
        })
        .catch((error) => {
            console.log(error.code);
            setMsg(error.code);
        });
}

function handleUserState(currentPage) {
    if (!currentPage) return console.log('Missing currentPage');
    onAuthStateChanged(auth, (user) => {
        console.log(user);
        if (currentPage === 'loginPage' && user !== null) {
            document.location.href = '/home';
        } else if (
            (currentPage === 'homePage' && user === null) ||
            (currentPage === 'homePage' && !userId) ||
            (currentPage === 'settingsPage' && user === null) ||
            (currentPage === 'settingsPage' && !userId)
        ) {
            handleSignOut();
        }
    });
}

export { handleSignUpForm, handleLoginForm, handleSignOut, handleUserState, handleForgetPassword };
