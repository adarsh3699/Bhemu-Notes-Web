import React from 'react';
import googleLogo from './googleLogo.svg';
import './googleLoginBtn.css';

function GoogleLoginBtn({ onClickFunction, sx }) {
    return (
        <button onClick={onClickFunction} style={sx} id="googleBtn">
            <img id="googleLogo" src={googleLogo} alt="" />
            <div id="googleBtnName">Sign in with Google</div>
        </button>
    );
}

export default GoogleLoginBtn;
