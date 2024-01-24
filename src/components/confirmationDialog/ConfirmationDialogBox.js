import React, { useEffect, useCallback, useRef } from 'react';
import { Button } from '@mui/material';

import './confirmationDialogBox.css';

function ConfirmationDialogBox({ title, message, onYesClick, setIsConfirmationDialogOpen, sx }) {
	const backgroundRef = useRef();

	const handleDialogBoxClosing = useCallback(() => {
		setIsConfirmationDialogOpen(false);
	}, [setIsConfirmationDialogOpen]);

	const handleClickOutside = useCallback(
		(e) => {
			if (backgroundRef.current && !backgroundRef.current.contains(e.target)) {
				handleDialogBoxClosing();
			}
		},
		[handleDialogBoxClosing]
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
		<div className="ConfirmationDialogBoxBg">
			<div className="ConfirmationDialogBox" ref={backgroundRef} style={sx}>
				<div className="ConfirmationDialogBoxTitle">{title}</div>
				<div className="ConfirmationDialogBoxMessage">{message}</div>

				<div className="ConfirmationDialogBoxBtns">
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
						onClick={handleDialogBoxClosing}
					>
						No
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmationDialogBox;
