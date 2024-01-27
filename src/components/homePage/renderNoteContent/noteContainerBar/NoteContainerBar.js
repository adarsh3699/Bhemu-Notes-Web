import React, { useState } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import { IconButton } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';

import CircularProgress from '@mui/material/CircularProgress';

import './noteContainerBar.css';

function NoteContainerBar({
	handleNotesModalClosing,
	isSaveBtnLoading,
	handleAddTodoBtn,
	handleSaveBtnClick,
	openConfirmationDialog,
	toggleShareDialogBox,
	isShareNoteType,
	showShareNoteError,
}) {
	const [settingMenuAnchorEl, setSettingMenuAddNotesAnchorEl] = useState(null);
	const isSettingsAnchorElopen = Boolean(settingMenuAnchorEl);

	const toggleSettingsMenu = (event) => {
		setSettingMenuAddNotesAnchorEl(event.currentTarget);
	};

	return (
		<>
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

					<Tooltip title="Save" arrow>
						<IconButton
							color="inherit"
							sx={{ ml: 1 }}
							aria-label="save"
							onClick={isShareNoteType ? showShareNoteError : handleSaveBtnClick}
						>
							{isSaveBtnLoading ? <CircularProgress size={24} /> : <SaveIcon fontSize="inherit" />}
						</IconButton>
					</Tooltip>
				</div>

				<div id="addNoteAndTodoSection">
					<Tooltip title="Add Todo" arrow>
						<IconButton
							onClick={isShareNoteType ? showShareNoteError : handleAddTodoBtn}
							color="inherit"
							aria-label="addTodoBtn"
							aria-haspopup="true"
						>
							<PlaylistAddIcon fontSize="inherit" />
						</IconButton>
					</Tooltip>
				</div>

				<div id="deleteAndSaveBtnSection">
					{isShareNoteType ? (
						<IconButton
							id="noteMenuBtn"
							color="inherit"
							aria-expanded={isSettingsAnchorElopen ? 'true' : undefined}
							aria-haspopup="true"
							onClick={showShareNoteError}
							aria-controls={isSettingsAnchorElopen ? 'account-menu' : undefined}
							sx={{ mr: 1.2 }}
						>
							<DeleteIcon fontSize="inherit" />
						</IconButton>
					) : (
						<IconButton
							id="noteMenuBtn"
							color="inherit"
							aria-expanded={isSettingsAnchorElopen ? 'true' : undefined}
							aria-haspopup="true"
							aria-controls={isSettingsAnchorElopen ? 'account-menu' : undefined}
							onClick={toggleSettingsMenu}
							sx={{ mr: 1.2 }}
						>
							<MenuIcon fontSize="inherit" />
						</IconButton>
					)}
				</div>
			</div>

			<Menu
				anchorEl={settingMenuAnchorEl}
				id="account-menu"
				open={isSettingsAnchorElopen}
				onClose={() => setSettingMenuAddNotesAnchorEl(null)}
				onClick={() => setSettingMenuAddNotesAnchorEl(null)}
				PaperProps={{
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1,
						'& .MuiMenuItem-root': {
							height: 45,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 10,
							width: 10,
							height: 10,
							bgcolor: '#121212',
							backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={toggleShareDialogBox}>
					<ListItemIcon>
						<ShareIcon fontSize="small" />
					</ListItemIcon>
					Share
				</MenuItem>

				<MenuItem onClick={openConfirmationDialog}>
					<ListItemIcon>
						<DeleteIcon fontSize="small" />
					</ListItemIcon>
					Delete
				</MenuItem>
			</Menu>
		</>
	);
}

export default NoteContainerBar;
