import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { handleForgetPassword } from '../firebase/auth';
import Loader from '../components/Loader';

import logo from '../img/newLogo.webp';
import '../styles/loginPage.css';

document.title = 'Bhemu Notes | Forget Password';

function ForgetPasswordPage() {
	const [msg, setMsg] = useState('');
	const [isOTPApiLoading, setIsOTPApiLoading] = useState(false);

	const handleForgetPasswordSubmit = useCallback((e) => {
		setIsOTPApiLoading(true);
		handleForgetPassword(e, setMsg, setIsOTPApiLoading);
	}, []);

	const handleMsgHideOnKeyUp = useCallback((e) => {
		setMsg('');
	}, []);

	return (
		<div className="authPage">
			<img id="myLogo" src={logo} alt="" />
			<div id="Title">Forget Password</div>
			<form className="form" onSubmit={handleForgetPasswordSubmit}>
				<input
					type="email"
					name="email"
					className="inputBottomMargin"
					placeholder="Email"
					required
					onChange={handleMsgHideOnKeyUp}
				/>

				<button className="button_2" style={{ marginTop: 'unset' }}>
					Send Link
				</button>

				<div className="error_msg">{msg}</div>
				<Loader isLoading={isOTPApiLoading} />
				<br />
			</form>

			<div className="botton_navBtn">
				Back to <NavLink to="/">LoginPage</NavLink>
			</div>
		</div>
	);
}

export default ForgetPasswordPage;
