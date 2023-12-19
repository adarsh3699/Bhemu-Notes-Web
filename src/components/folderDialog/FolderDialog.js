import React, { useEffect, useState, useCallback, useRef } from 'react';

import { updateNoteShareAccess, updateUserShareList } from '../../firebase/shareNote';

import Button from '@mui/material/Button';
import NotesIcon from '@mui/icons-material/Notes';
import CircularProgress from '@mui/material/CircularProgress';
import FolderIcon from '@mui/icons-material/Folder';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import userProflie from '../../img/userProfile.svg';

import './folderDialog.css';

const userDetails = JSON.parse(localStorage.getItem('user_details')) || {};
const userProfileImg = localStorage.getItem('user_profile_img');

function FolderDialog({
	title,
	message,
	handleMsgShown,
	toggleFolderDialog,
	myNotesId,
	noteSharedUsers,
	isNoteSharedWithAll,
	noteFolders,
	sx,
}) {
	const backgroundRef = useRef();
	const [isDrawerAllNoteOpen, setIsDrawerAllNoteOpen] = useState(false);
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
	const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);

	const handleClickOutside = useCallback(
		(e) => {
			if (backgroundRef.current && !backgroundRef.current.contains(e.target) && !isDrawerAllNoteOpen) {
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
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<CreateNewFolderIcon sx={{ fontSize: 30, mr: 2 }} />
						Add Folder
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
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<FolderIcon sx={{ fontSize: 30, mr: 2 }} />
								{item}
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

	const list = () => (
		<Box sx={{ width: 'auto' }} role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
			<List>
				{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<Divider />
			<List>
				{['All mail', 'Trash', 'Spam'].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
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
					anchor={'bottom'}
					open={isDrawerAllNoteOpen}
					onClose={toggleDrawer}
					onOpen={toggleDrawer}
					className="huhuhu"
					name="sdfbg"
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					{list()}
				</SwipeableDrawer>
			</div>
		</div>
	);
}

export default FolderDialog;
