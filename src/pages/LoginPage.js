import React, { useState, useEffect, useCallback } from 'react';
import { handleUserState, handleLoginForm } from '../firebase/auth';
import { USER_DETAILS } from '../utils';

import { NavLink } from 'react-router-dom';
import Loader from '../components/loader/Loader';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { amber } from '@mui/material/colors';

import logo from '../img/newLogo.webp';
import '../styles/loginPage.css';

document.title = 'Bhemu Notes | Sign in';

function LoginPage() {
	const [msg, setMsg] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isApiLoading, setIsApiLoading] = useState(false);
	const [ispasswordVisible, setIspasswordVisible] = useState(false);

	useEffect(() => {
		handleUserState(false);
		if (USER_DETAILS?.userId) {
			document.location.href = '/';
		} else {
			setIsLoading(false);
		}
	}, []);

	const handlePasswordVisibility = useCallback(() => {
		setIspasswordVisible(!ispasswordVisible);
	}, [ispasswordVisible]);

	const handleUserLogin = useCallback((e) => {
		handleLoginForm(e, setMsg, setIsApiLoading);
	}, []);

	const handleMsgHideOnKeyUp = useCallback((e) => {
		setMsg('');
	}, []);

	if (isLoading) return;

	return (
		<div className="authPage">
			<img id="myLogo" src={logo} alt="" />
			<div id="Title">Bhemu Notes</div>
			<form className="form" onSubmit={handleUserLogin}>
				<input
					type="email"
					name="email"
					placeholder="Email"
					disabled={isApiLoading}
					className="inputBottomMargin"
					onKeyDown={handleMsgHideOnKeyUp}
				/>
				<input
					type={ispasswordVisible ? 'text' : 'password'}
					name="password"
					placeholder="Password"
					disabled={isApiLoading}
					className=""
					onKeyDown={handleMsgHideOnKeyUp}
				/>

				<div id="showPassword">
					<FormControlLabel
						control={
							<Checkbox
								onClick={handlePasswordVisibility}
								sx={{
									color: amber[400],
									'&.Mui-checked': {
										color: amber[600],
									},
								}}
							/>
						}
						label="Show password"
					/>
				</div>

				<button id="login" className={isApiLoading ? 'isLoginBtnLoading' : ''}>
					LOGIN
				</button>
			</form>

			<div id="msg" className="error_msg" style={isApiLoading ? { marginBottom: '0px' } : {}}>
				{msg}
			</div>
			<Loader isLoading={isApiLoading} />
			<NavLink to="/forget-password" id="forgotPass">
				Forgotten Password
			</NavLink>

			<div className="botton_navBtn">
				Don't have an account yet? <NavLink to="/register">Signup</NavLink>
			</div>
		</div>
	);
}

export default LoginPage;
