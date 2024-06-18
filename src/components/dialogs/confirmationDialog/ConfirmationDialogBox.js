import React, { useEffect, useCallback, useRef } from 'react';
import { Button } from '@mui/material';

// import './confirmationDialogBox.css';

function ConfirmationDialogBox({ title, message, onYesClick, toggleConfirmationDialog, sx }) {
	const backgroundRef = useRef();

	const handleClickOutside = useCallback(
		(e) => {
			if (backgroundRef.current && !backgroundRef.current.contains(e.target)) {
				toggleConfirmationDialog();
			}
		},
		[toggleConfirmationDialog]
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
		<div className="dialogBoxBg">
			<div className="dialogBox" ref={backgroundRef} style={sx}>
				<div className="dialogBoxTitle">{title}</div>
				<div className="dialogBoxMessage">{message}</div>

				<div className="dailog2BtnsFlex">
					<Button
						className="ConfirmationDialogBoxYesBtn"
						variant="contained"
						color="error"
						fullWidth
						sx={{ mr: 2, fontSize: '17px' }}
						onClick={onYesClick}
					>
						Yes
					</Button>
					<Button
						className="ConfirmationDialogBoxNoBtn"
						variant="contained"
						color="info"
						fullWidth
						sx={{ fontSize: '17px' }}
						onClick={toggleConfirmationDialog}
					>
						No
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmationDialogBox;
