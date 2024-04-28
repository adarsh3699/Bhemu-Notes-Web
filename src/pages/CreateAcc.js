import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import { handleSignUpForm } from '../firebase/auth';
import Loader from '../components/Loader';

import logo from '../img/newLogo.webp';
import '../styles/loginPage.css';

document.title = 'Bhemu Notes | Create Your Account';

function CreateAcc() {
	const [msg, setMsg] = useState('');
	const [isApiLoading, setIsApiLoading] = useState(false);

	const handleUserSignUpForm = useCallback((e) => {
		handleSignUpForm(e, setMsg, setIsApiLoading);
	}, []);

	const handleMsgHideOnKeyUp = useCallback(() => {
		setMsg('');
	}, []);

	return (
		<div className="authPage">
			<img id="myLogo" src={logo} alt="" />

			<div id="Title">Create Your Account</div>

			<form className="form" onSubmit={handleUserSignUpForm}>
				<input
					type="tet"
					name="userName"
					placeholder="Full Name"
					className="inputBottomMargin"
					required
					onChange={handleMsgHideOnKeyUp}
				/>

				<input
					type="email"
					name="email"
					placeholder="Email"
					className="inputBottomMargin"
					required
					onChange={handleMsgHideOnKeyUp}
				/>

				<input
					type="Password"
					name="password"
					placeholder="Password (8 digit)"
					pattern="().{8,}"
					className="inputBottomMargin"
					required
					onChange={handleMsgHideOnKeyUp}
				/>

				<input
					type="Password"
					name="confPassword"
					placeholder="Confirm Password (8 digit)"
					pattern="().{8,}"
					className="inputBottomMargin"
					required
					onChange={handleMsgHideOnKeyUp}
				/>

				<button className={isApiLoading ? 'isSignup button_2' : 'button_2'}>Sign Up</button>
				<div id="updateMsg" className="error_msg" style={isApiLoading ? { marginBottom: '0px' } : {}}>
					{msg}
				</div>
			</form>

			<Loader isLoading={isApiLoading} />

			<div className="botton_navBtn">
				Already have an Account <NavLink to="/login">Click here</NavLink>
			</div>
		</div>
	);
}

export default CreateAcc;
