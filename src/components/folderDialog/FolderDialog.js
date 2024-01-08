import React, { useEffect, useState, useCallback, useRef } from 'react';

// import { updateNoteShareAccess, updateUserShareList } from '../../firebase/shareNote';

import Button from '@mui/material/Button';
import NotesIcon from '@mui/icons-material/Notes';
import CircularProgress from '@mui/material/CircularProgress';
import FolderIcon from '@mui/icons-material/Folder';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Checkbox from '@mui/material/Checkbox';

import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import './folderDialog.css';

// const userDetails = JSON.parse(localStorage.getItem('user_details')) || {};

function FolderDialog({ title, message, handleMsgShown, toggleFolderDialog, allNotes, noteFolders, sx }) {
	const backgroundRef = useRef();
	const [isDrawerAllNoteOpen, setIsDrawerAllNoteOpen] = useState(false);
	const [selectedNotes, setSelectedNotes] = useState([]);
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
	const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);

	// console.log(allNotes);

	const handleClickOutside = useCallback(
		(e) => {
			if (
				backgroundRef.current &&
				!backgroundRef.current.contains(e.target) &&
				!isDrawerAllNoteOpen &&
				e.target.ariaHidden !== 'true' &&
				e.target.localName !== 'body'
			) {
				toggleFolderDialog();
			}
		},
		[isDrawerAllNoteOpen, toggleFolderDialog]
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

	const toggleDrawer = (event) => {
		setIsDrawerAllNoteOpen((prevState) => !prevState);
	};

	const handleBackBtnClick = useCallback(() => {
		if (isEditFolderOpen) {
			setIsEditFolderOpen(false);
		} else {
			toggleFolderDialog();
		}
	}, [isEditFolderOpen, toggleFolderDialog]);

	const handleSaveBtnClick = useCallback(() => {}, []);

	const viewFolderContain = (
		<div className="folderDialogBoxContainer">
			<div className="folderDialogBoxMessage">{message}</div>
			<div className="folderDialogTableTitle">Folders</div>

			<div className="folderDialogBoxTable">
				<div
					className="folderDialogBoxTableColAddBtn"
					style={{ justifyContent: 'space-between' }}
					onClick={() => setIsEditFolderOpen(true)}
				>
					<div className="colIconTitle">
						<CreateNewFolderIcon sx={{ fontSize: 30, mr: 2 }} />
						<div>New Folder</div>
					</div>
					<KeyboardArrowRightIcon sx={{ fontSize: 30, ml: 2 }} />
				</div>
				{noteFolders?.map((item, index) => {
					return (
						<div
							className="folderDialogBoxTableCol"
							style={{ justifyContent: 'space-between' }}
							key={index}
						>
							<div className="colIconTitle">
								<FolderIcon sx={{ fontSize: 30, mr: 2 }} />
								<div className="colTitle">{item}</div>
							</div>
							<KeyboardArrowRightIcon sx={{ fontSize: 30, ml: 2 }} />
						</div>
					);
				})}
			</div>
		</div>
	);

	const editFolderContain = (
		<div className="folderDialogBoxContainer">
			<div className="folderDialogBoxMessage">{message}</div>
			<div className="folderDialogInputLable">Folder Name</div>
			<input type="text" className="folderDialogInput" placeholder="Enter Folder Name" />
			<div className="folderDialogInputLable">Add Notes</div>

			<div className="folderDialogBoxTable">
				<div className="folderDialogBoxTableColAddBtn" onClick={toggleDrawer}>
					<AddToPhotosIcon sx={{ fontSize: 30, mr: 2 }} />
					Add Notes
				</div>
				{noteFolders?.map((item, index) => {
					return (
						<div className="folderDialogBoxTableCol" key={index}>
							<NotesIcon sx={{ fontSize: 30, mr: 2 }} />
							{item}
						</div>
					);
				})}
				<Button
					variant="contained"
					onClick={handleSaveBtnClick}
					fullWidth
					color="success"
					disabled={isSaveBtnLoading}
					sx={{ my: 2 }}
				>
					{isSaveBtnLoading ? <CircularProgress color="success" size={30} /> : ' Save'}
				</Button>
			</div>
		</div>
	);

	return (
		<div className="folderDialogBoxBg">
			<div className="folderDialogBox" ref={backgroundRef} style={sx}>
				<div className="folderDialogBoxNavBar">
					<div className="folderDialogBoxTitle">{title}</div>
					<Button
						size="small"
						sx={{ color: '#2894d1' }}
						onClick={handleBackBtnClick}
						startIcon={<ArrowBackIcon />}
					>
						Back
					</Button>
				</div>

				{!isEditFolderOpen ? viewFolderContain : editFolderContain}

				<SwipeableDrawer
					anchor="bottom"
					open={isDrawerAllNoteOpen}
					onClose={() => setIsDrawerAllNoteOpen(false)}
					onOpen={toggleDrawer}
					className="huhuhu"
					sx={{
						'.MuiDrawer-paper': {
							sm: {
								boxSizing: 'border-box',
								margin: 'auto',
								width: '700px',
								borderTopLeftRadius: 10,
								borderTopRightRadius: 10,
							},
						},
					}}
				>
					<Box sx={{ width: 'auto' }} role="presentation">
						<div className="allNotesListDrawer">
							<div>Select Notes</div>
							<Button variant="text" onClick={toggleDrawer}>
								Done
							</Button>
						</div>
						<Divider />
						<List sx={{ mb: 5 }}>
							{allNotes.map((item, index) => (
								<ListItem key={'list' + index} disablePadding>
									<ListItemButton>
										<ListItemIcon>
											<NotesIcon />
										</ListItemIcon>
										<ListItemText primary={item.notesTitle} />
										<Checkbox />
									</ListItemButton>
								</ListItem>
							))}
						</List>
					</Box>
				</SwipeableDrawer>
			</div>
		</div>
	);
}

export default FolderDialog;
