import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updateProfile, updatePassword } from 'firebase/auth';

const auth = getAuth();

async function handleUserNameChange(userDetails, setMsg, setIsSaveBtnLoading) {
    setIsSaveBtnLoading(true);
    const userName = userDetails?.userName;
    if (!userName) return setMsg('User Name can not be empty');
    const user = auth.currentUser;
    updateProfile(user, { displayName: userName })
        .then(() => {
            localStorage.setItem('user_details', JSON.stringify({ userName, email: userDetails?.email }));
            setMsg('Changed successfully');
            setIsSaveBtnLoading(false);
        })
        .catch((err) => {
            setMsg(err.code);
            setIsSaveBtnLoading(false);
        });
}

function handlePasswordChange(changePasswordData, setChangePasswordMsg) {
    const { currentPassword, newPassword, confPassword } = changePasswordData;
    console.log(changePasswordData);

    if (!currentPassword || !newPassword || !confPassword) return setChangePasswordMsg('Please provide all detials');
    if (newPassword !== confPassword) return setChangePasswordMsg('Password does not match.');
    if (currentPassword.length < 8 || newPassword.length < 8 || confPassword.length < 8)
        return setChangePasswordMsg('Password must be 8 digits.');

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);

    reauthenticateWithCredential(user, credential)
        .then((cred) => {
            updatePassword(cred.user, newPassword)
                .then(() => {
                    setChangePasswordMsg('Update successful.');
                })
                .catch((err) => {
                    setChangePasswordMsg(err.code);
                    console.log(err.message);
                });
        })
        .catch((err) => {
            setChangePasswordMsg(
                err.code === 'auth/too-many-requests'
                    ? ' Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.'
                    : err.code
            );
            console.log(err.message);
        });
}

export { handleUserNameChange, handlePasswordChange };