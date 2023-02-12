import React from 'react';

import './errorMsg.css';

function ErrorMsg({ isError, msgText }) {
	return (
		isError && (
			<div id="errorBox">
				<div id="errorMsg">{msgText}</div>
			</div>
		)
	);
}

export default ErrorMsg;
