import React from 'react';

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';

import CircularProgress from '@mui/material/CircularProgress';

import './noteContainerBar.css';

function NoteContainerBar({
	handleNotesModalClosing,
	isSaveBtnLoading,
	handleAddTodoBtn,
	handleSaveBtnClick,
	openConfirmationDialog,
}) {
	return (
		<div id="noteContainerBar">
			<div id="backAndTitleSection">
				<IconButton
					id="arrowBackIcon"
					color="inherit"
					aria-label="backBtn"
					aria-haspopup="true"
					onClick={handleNotesModalClosing}
				>
					<ArrowBackIcon fontSize="inherit" />
				</IconButton>

				<Tooltip title="Delete" arrow>
					<IconButton
						id="deleteBtn"
						color="inherit"
						aria-label="delete"
						aria-haspopup="true"
						onClick={openConfirmationDialog}
						sx={{ ml: 1 }}
					>
						<DeleteIcon fontSize="inherit" />
					</IconButton>
				</Tooltip>
			</div>

			<div id="addNoteAndTodoSection">
				<Tooltip title="Add Todo" arrow>
					<IconButton onClick={handleAddTodoBtn} color="inherit" aria-label="addTodoBtn" aria-haspopup="true">
						<FormatListBulletedIcon fontSize="inherit" />
					</IconButton>
				</Tooltip>
			</div>

			<div id="deleteAndSaveBtnSection">
				<Tooltip title="Save" arrow>
					<IconButton color="inherit" aria-label="save" onClick={handleSaveBtnClick} sx={{ mr: 1 }}>
						{isSaveBtnLoading ? <CircularProgress size={24} /> : <SaveIcon fontSize="inherit" />}
					</IconButton>
				</Tooltip>
			</div>
		</div>
	);
}

export default NoteContainerBar;
