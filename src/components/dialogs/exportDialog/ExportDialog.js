import React, { useEffect, useCallback, useRef } from 'react';

// import Button from '@mui/material/Button';
// import CircularProgress from '@mui/material/CircularProgress';

import './exportDialog.css';

function ExportDialog({ title, handleMsgShown, toggleBtn, sx }) {
	const backgroundRef = useRef();
	// const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);

	const handleClickOutside = useCallback(
		(e) => {
			if (backgroundRef.current && !backgroundRef.current.contains(e.target)) {
				toggleBtn();
			}
		},
		[toggleBtn]
	);

	useEffect(
		function () {
			// document.body.style.overflow = 'hidden';
			document.addEventListener('click', handleClickOutside, true);

			//component did un-mount
			return function () {
				document.removeEventListener('click', handleClickOutside, true);
			};
		},
		[handleClickOutside]
	);

	return (
		<div className="shareDialogBoxBg">
			<div className="shareDialogBox" ref={backgroundRef} style={sx}>
				<div className="ConfirmationDialogBoxTitle">{title}</div>
				{/* <div className="ConfirmationDialogBoxMessage">{message}</div> */}
			</div>
		</div>
	);
}

export default ExportDialog;
