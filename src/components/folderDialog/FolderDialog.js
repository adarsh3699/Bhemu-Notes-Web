import React, { useEffect, useState, useCallback, useRef } from 'react';

import { updateUserFolder } from '../../firebase/features';
import { uid } from 'uid';

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

function FolderDialog({ handleMsgShown, toggleFolderDialog, userAllNotes, noteFolders, sx }) {
	const backgroundRef = useRef();
	const [isDrawerAllNoteOpen, setIsDrawerAllNoteOpen] = useState(false);
	const [allNoteFolders, setAllNoteFolders] = useState(noteFolders || []);
	const [currentFolderId, setCurrentFolderId] = useState('');
	const [selectedNotes, setSelectedNotes] = useState(userAllNotes || []);
	const [folderName, setFolderName] = useState('');
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
	const [isEditFolderDialogOpen, setIsEditFolderDialogOpen] = useState({ isOpen: false, openAsEdit: false });

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
		if (isEditFolderDialogOpen.isOpen) {
			setIsEditFolderDialogOpen({ isOpen: false, openAsEdit: false });
			setCurrentFolderId('');
			setSelectedNotes(userAllNotes);
			setAllNoteFolders(noteFolders);
			setFolderName('');
		} else {
			toggleFolderDialog();
		}
	}, [userAllNotes, isEditFolderDialogOpen.isOpen, noteFolders, toggleFolderDialog]);

	//handleCreateNewFolder btn click
	const handleCreateNewFolder = useCallback(() => {
		setCurrentFolderId(uid(16));
		setAllNoteFolders(noteFolders);
		setIsEditFolderDialogOpen({ isOpen: true, openAsEdit: false });
	}, [noteFolders]);

	const handleFolderEditBtnClick = useCallback(
		(itemOrg) => {
			setCurrentFolderId(itemOrg.folderId);
			setFolderName(itemOrg.folderName);
			setIsEditFolderDialogOpen({ isOpen: true, openAsEdit: true });
			const temp = userAllNotes.map((i) => itemOrg.folderData.find((j) => j.noteId === i.noteId) || i);
			setSelectedNotes(temp);
		},
		[userAllNotes]
	);

	const handleSelectNote = useCallback(
		(index, isSelected) => {
			const newToDos = selectedNotes.map(function (item, i) {
				return i === index
					? { isNoteSelected: isSelected ? false : true, noteTitle: item.noteTitle, noteId: item.noteId }
					: {
							isNoteSelected: item.isNoteSelected || false,
							noteTitle: item.noteTitle,
							noteId: item.noteId,
					  };
			});
			setSelectedNotes(newToDos);
		},
		[selectedNotes]
	);

	const handleSaveBtnClick = useCallback(() => {
		if (!folderName) return handleMsgShown('Folder name is required');
		if (!selectedNotes.filter((item) => item.isNoteSelected).length)
			return handleMsgShown('Please select atleast one note');

		let temp;
		if (!isEditFolderDialogOpen.openAsEdit) {
			temp = [
				{
					folderName,
					folderId: currentFolderId,
					folderData: selectedNotes.filter((item) => item.isNoteSelected),
				},
				...allNoteFolders,
			];
		} else {
			temp = allNoteFolders.map((item) =>
				item.folderId === currentFolderId
					? {
							folderName,
							folderId: currentFolderId,
							folderData: selectedNotes.filter((item) => item.isNoteSelected),
					  }
					: item
			);
		}

		updateUserFolder(temp, setIsSaveBtnLoading, handleMsgShown, handleBackBtnClick);
	}, [
		allNoteFolders,
		currentFolderId,
		folderName,
		handleBackBtnClick,
		handleMsgShown,
		isEditFolderDialogOpen.openAsEdit,
		selectedNotes,
	]);

	const handleDeleteFolderBtnClick = useCallback(() => {
		let temp = allNoteFolders.filter((item) => item.folderId !== currentFolderId);
		updateUserFolder(temp, setIsSaveBtnLoading, handleMsgShown, handleBackBtnClick, true);
	}, [allNoteFolders, currentFolderId, handleBackBtnClick, handleMsgShown]);

	const viewFolderContain = (
		<div className="folderDialogBoxContainer">
			<div className="folderDialogBoxMessage">Edit folders and quickly switch between them.</div>
			<div className="folderDialogTableTitle">Folders</div>

			<div className="folderDialogBoxTable">
				<div
					className="folderDialogBoxTableColAddBtn"
					style={{ justifyContent: 'space-between' }}
					onClick={handleCreateNewFolder}
				>
					<div className="colIconTitle">
						<CreateNewFolderIcon sx={{ fontSize: 30, mr: 2 }} />
						<div>Create New Folder</div>
					</div>
					<KeyboardArrowRightIcon sx={{ fontSize: 30, ml: 2 }} />
				</div>
				{noteFolders?.map((item, index) => {
					return (
						<div
							className="folderDialogBoxTableCol"
							style={{ justifyContent: 'space-between' }}
							key={index}
							onClick={() => handleFolderEditBtnClick(item, index)}
						>
							<div className="colIconTitle">
								<FolderIcon sx={{ fontSize: 30, mr: 2 }} />
								<div className="colTitle">{item.folderName}</div>
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
			<div className="folderDialogBoxMessage">
				Create new folders for different Notes and quickly switch between them.
			</div>
			<div className="folderDialogInputLable">Folder Name</div>
			<input
				type="text"
				className="folderDialogInput"
				value={folderName}
				onChange={(e) => setFolderName(e.target.value)}
				placeholder="Enter Folder Name"
			/>
			<div className="folderDialogInputLable">Add Notes</div>

			<div className="folderDialogBoxTable">
				<div className="folderDialogBoxTableColAddBtn" onClick={toggleDrawer}>
					<AddToPhotosIcon sx={{ fontSize: 30, mr: 2 }} />
					{isEditFolderDialogOpen.openAsEdit ? 'Edit Notes' : 'Select Notes'}
				</div>
				{selectedNotes.map((item, index) => {
					return (
						item.isNoteSelected && (
							<div className="folderDialogBoxTableCol" key={index}>
								<NotesIcon sx={{ fontSize: 30, mr: 2 }} />
								{item.noteTitle}
							</div>
						)
					);
				})}
				<div className="folderDialogBoxBtnAlign" style={{ justifyContent: 'space-between' }}>
					{isEditFolderDialogOpen.openAsEdit && (
						<Button
							variant="contained"
							onClick={handleDeleteFolderBtnClick}
							fullWidth
							color="error"
							disabled={isSaveBtnLoading}
							sx={{ my: 2, mr: 2, py: 1.2 }}
						>
							Delete
						</Button>
					)}
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
		</div>
	);

	return (
		<div className="folderDialogBoxBg">
			<div className="folderDialogBox" ref={backgroundRef} style={sx}>
				<div className="folderDialogBoxNavBar">
					<div className="folderDialogBoxTitle">Note Folders</div>
					<Button
						size="small"
						sx={{ color: '#2894d1' }}
						onClick={handleBackBtnClick}
						startIcon={<ArrowBackIcon />}
					>
						Back
					</Button>
				</div>

				{!isEditFolderDialogOpen.isOpen ? viewFolderContain : editFolderContain}

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
							{selectedNotes.map((item, index) => (
								<ListItem key={'list' + index} disablePadding>
									<ListItemButton onClick={() => handleSelectNote(index, item?.isNoteSelected)}>
										<ListItemIcon>
											<NotesIcon />
										</ListItemIcon>
										<ListItemText primary={item.noteTitle} />
										<Checkbox checked={item?.isNoteSelected || false} onChange={() => {}} />
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
