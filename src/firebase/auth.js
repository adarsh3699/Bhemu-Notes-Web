import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

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

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAtcW8upslh33YFtZXJxhJ5x_9xGLNEYZg',
    authDomain: 'bhemu-notes-13b4a.firebaseapp.com',
    projectId: 'bhemu-notes-13b4a',
    storageBucket: 'bhemu-notes-13b4a.appspot.com',
    messagingSenderId: '1042432055409',
    appId: '1:1042432055409:web:e918dec9c2a3119555e3d0',
    measurementId: 'G-84Y76BPWW3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

getAnalytics(app);

function handleLoginForm(e, setMsg) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) return setMsg('Please Enter Your Email and Password');

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            localStorage.setItem('user_details', JSON.stringify({ userName: cred?.user?.displayName, email }));
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
                    localStorage.setItem('user_details', JSON.stringify({ userName, email }));
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
            console.log('sgin out');
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
            console.log('if');
            document.location.href = '/home';
        } else if (currentPage === 'homePage' && user === null) {
            document.location.href = '/';
            console.log('else');
        }
    });
}

export { handleSignUpForm, handleLoginForm, handleSignOut, handleUserState, handleForgetPassword };
