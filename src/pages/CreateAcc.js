import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { handleSignUpForm } from '../firebase/auth';
import Loader from '../components/Loader';

import '../styles/loginPage.css';

document.title = 'Bhemu Notes | Create Your Account';

function CreateAcc() {
    const [msg, setMsg] = useState('');
    const [isApiLoading, setIsApiLoading] = useState(false);

    return (
        <div id="background">
            <div id="wrapper">
                <div id="Title">Create Your Account</div>

                <form className="form" onSubmit={(e) => handleSignUpForm(e, setMsg)}>
                    <input type="tet" name="userName" placeholder="User Name" className="inputBottomMargin" required />

                    <input type="email" name="email" placeholder="Email" className="inputBottomMargin" required />

                    <input
                        type="Password"
                        name="password"
                        placeholder="Password (8 digit)"
                        pattern="().{8,}"
                        className="inputBottomMargin"
                        required
                    />

                    <input
                        type="Password"
                        name="confPassword"
                        placeholder="Confirm Password (8 digit)"
                        pattern="().{8,}"
                        className="inputBottomMargin"
                        required
                    />

                    <button id="signup" className={isApiLoading ? 'isSignup' : ''}>
                        Sign Up
                    </button>
                    <div id="updateMsg" className="red" style={isApiLoading ? { marginBottom: '0px' } : {}}>
                        {' '}
                        {msg}{' '}
                    </div>
                </form>

                <Loader isLoading={isApiLoading} />
                <hr />

                <div id="alreadyAcc" style={isApiLoading ? null : { margin: '25px 0px 5px 0px' }}>
                    <NavLink to="/">Already have an Account</NavLink>
                </div>
            </div>
        </div>
    );
}

export default CreateAcc;
