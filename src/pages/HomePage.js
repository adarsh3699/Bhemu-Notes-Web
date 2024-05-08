import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { handleUserState } from '../firebase/auth';

import {
	getUserAllNoteData,
	addNewNote,
	deleteData,
	updateDocument,
	getOpenNoteData,
	getAllNotesOfFolder,
	unsubscribeAllFolders,
	unsubscribeAllNotes,
} from '../firebase/notes';
import { getUserAllData } from '../firebase/features';
import { decryptText, USER_DETAILS, userDeviceType } from '../utils';

import NavBar from '../components/homePage/navBar/NavBar';
import RenderAllNotes from '../components/homePage/renderAllNotes/RenderAllNotes';
import RenderNoteContent from '../components/homePage/renderNoteContent/RenderNoteContent';
import ConfirmationDialog from '../components/confirmationDialog/ConfirmationDialogBox';
import ShareDialogBox from '../components/shareDialog/ShareDialogBox';
import ShowMsg from '../components/showMsg/ShowMsg';

import { useHotkeys } from 'react-hotkeys-hook';

import '../styles/homePage.css';

document.title = 'Bhemu Notes';

let params = new URL(document.location).searchParams;

const localFolderData = params.get('folder')
	? JSON.parse(decryptText(localStorage.getItem(params.get('folder'))))
	: undefined;

const sharedNoteId = window.location?.pathname?.split('share/')?.[1];

function HomePage() {
	const [msg, setMsg] = useState({ text: '', type: '' });
	const [isSharedNoteType, setIsSharedNoteType] = useState(sharedNoteId ? true : false);

	const [userAllNotes, setAllNotes] = useState(
		(localStorage.getItem('note_data') && JSON.parse(decryptText(localStorage.getItem('note_data')))) || []
	);
	const [userAllDetails, setUserAllDetails] = useState(USER_DETAILS || {});
	const [currentFolderNotes, setCurrentFolderNotes] = useState(localFolderData || []);

	const [openedNoteText, setOpenedNoteText] = useState('');
	const [openedNoteAllData, setOpenedNoteAllData] = useState({});

	const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
	const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
	const [isShareDialogBoxOpen, setIsShareDialogBoxOpen] = useState(false);

	const [isPageLoaded, setIsPageLoaded] = useState(true);
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
	const [isApiLoading, setIsApiLoading] = useState(false);

	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const folderName = searchParams.get('folder');
	const urlNoteId = window.location.hash.slice(1);

	const handleMsgShown = useCallback((msgText, type) => {
		if (msgText) {
			setMsg({ text: msgText, type: type });
			setTimeout(() => {
				setMsg({ text: '', type: '' });
			}, 2500);
		} else {
			console.log('Please Provide Text Msg');
		}
	}, []);

	// fetch All noteData
	useEffect(() => {
		// handleUserState(true);

		if (USER_DETAILS?.userId) {
			getUserAllNoteData(setAllNotes, setIsApiLoading, handleMsgShown);
			getUserAllData(setUserAllDetails, setIsApiLoading, handleMsgShown);
			urlNoteId &&
				getOpenNoteData(urlNoteId, setOpenedNoteAllData, setOpenedNoteText, setIsApiLoading, handleMsgShown);
		} else if (sharedNoteId) {
			getOpenNoteData(sharedNoteId, setOpenedNoteAllData, setOpenedNoteText, setIsApiLoading, handleMsgShown);
			// console.log(sharedNoteId);
			// getSearchedNoteData(sharedNoteId, setAllNotes, setOpenedNoteAllData, handleMsgShown, setIsApiLoading);
		}
		setIsPageLoaded(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleMsgShown]);

	const openFirstNote = useCallback((allNotesAtr, index) => {
		if (allNotesAtr.length === 0) return;
		// console.log(allNotesAtr);
		setOpenedNoteText(allNotesAtr[index]?.noteData || '');
		setOpenedNoteAllData(allNotesAtr[index]);
		// setCurrentNoteIndex(index);
	}, []);

	//handle open 1st note on page Load
	useEffect(() => {
		// console.log(userAllNotes);
		if (isNotesModalOpen === false && userDeviceType().desktop) {
			setIsNotesModalOpen(true);
			// if (!folderName) {
			// 	openFirstNote(userAllNotes, 0);
			// 	// console.log('if');
			// } else {
			// 	// console.log('else');
			// 	openFirstNote(currentFolderNotes, 0);
			// }
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAllNotes]);

	const handleNoteOpening = useCallback(
		(index, item) => {
			console.log(item);
			navigate(folderName ? `/?folder=${folderName}#${item.noteId}` : `#${item.noteId}`);
			unsubscribeAllNotes();
			setOpenedNoteText(item.noteData);
			getOpenNoteData(item.noteId, setOpenedNoteAllData, setOpenedNoteText, setIsApiLoading, handleMsgShown);

			// setCurrentNoteIndex(index);
			setOpenedNoteAllData(item);
			setIsNotesModalOpen(true);
			if (userDeviceType().mobile) document.querySelector('body').style.overflow = 'hidden';
		},
		[handleMsgShown, navigate, folderName]
	);

	const handleNotesModalClosing = useCallback(() => {
		setIsNotesModalOpen(false);
		if (userDeviceType().mobile) document.querySelector('body').style.overflow = 'auto';
	}, []);

	const handleFolderChange = useCallback(
		(item) => {
			unsubscribeAllFolders();
			setSearchParams({ folder: item?.folderName });
			getAllNotesOfFolder(item, setCurrentFolderNotes, setIsApiLoading, handleMsgShown);
		},
		[handleMsgShown, setSearchParams]
	);

	//add Note Function
	const handleAddNewNote = useCallback(
		(e) => {
			e.preventDefault();
			const newNoteText = e.target?.noteTitle?.value?.trim() || 'Enter Notes Title';
			const newNoteData = `<h1>${newNoteText}</h1><p><br></p><p><br></p><p><br></p>`;

			const toSendNoteData = { newNoteText, newNoteData };
			handleNoteOpening(0, { noteText: newNoteText, noteData: newNoteData });
			addNewNote(toSendNoteData, setOpenedNoteAllData, handleMsgShown, setIsApiLoading);

			if (e.target?.noteTitle?.value?.trim()) e.target.reset();
		},
		[handleNoteOpening, handleMsgShown]
	);

	//get title value from html string
	const getTitleValue = useCallback((htmlString) => {
		// Create a temporary element to parse the HTML string
		const tempElement = document.createElement('div');
		tempElement.innerHTML = htmlString;

		for (let i = 0; i < tempElement.children.length; i++) {
			const element = tempElement.children[i]?.textContent.trim();
			if (element) {
				return element;
			}
		}
	}, []);

	//handle note or todo save
	const handleSaveBtnClick = useCallback(() => {
		setIsSaveBtnLoading(true);
		const html = document.querySelector('.ql-editor').innerHTML;
		const noteTitleValue = getTitleValue(html);

		const toSendData = {
			noteId: openedNoteAllData.noteId,
			noteTitle: noteTitleValue || 'Enter Notes Title',
			noteText: document.querySelector('.ql-editor')?.innerText || '',
			noteData: openedNoteText,
		};

		updateDocument(toSendData, setIsSaveBtnLoading, setIsNotesModalOpen, handleMsgShown);
	}, [getTitleValue, openedNoteAllData.noteId, openedNoteText, handleMsgShown]);

	//handle Save when "ctrl + s" is pressed
	useHotkeys(
		'ctrl + s, meta + s',
		() => {
			if (isNotesModalOpen) {
				handleSaveBtnClick();
			}
		},

		{
			enableOnFormTags: true,
			preventDefault: true,
			enableOnContentEditable: true,
		}
	);

	//handle note delete
	const handleDeleteBtnClick = useCallback(async () => {
		// userDeviceType().mobile && handleNotesModalClosing();
		setIsConfirmationDialogOpen(false);
		// console.log(openedNoteAllData.noteId);
		deleteData(
			openedNoteAllData.noteId,
			setIsApiLoading,
			handleMsgShown,
			openFirstNote,
			userAllNotes,
			openedNoteAllData.index
		);
	}, [openedNoteAllData, handleMsgShown, openFirstNote, userAllNotes]);

	//toggle share dialog box
	const toggleShareDialogBox = useCallback(() => {
		setIsShareDialogBoxOpen((prev) => !prev);
	}, []);

	/// handle add share note user
	const handleAddShareNoteUser = useCallback(
		(e) => {
			e.preventDefault();
			const email = e.target.shareEmailInput.value.trim();
			if (email === '' || USER_DETAILS?.email === email) return;
			console.log(email);

			for (let i = 0; i < openedNoteAllData.noteSharedUsers.length; i++) {
				if (openedNoteAllData.noteSharedUsers[i]?.email === email) {
					handleMsgShown('User Already Added');
					return;
				}
			}

			setOpenedNoteAllData((prev) => ({
				...prev,
				noteSharedUsers: [{ email, canEdit: false }, ...prev.noteSharedUsers],
			}));
			e.target.reset();
		},
		[openedNoteAllData.noteSharedUsers, handleMsgShown]
	);

	if (isPageLoaded) return;

	return (
		<>
			<div id="homePage">
				<NavBar
					isSharedNoteType={isSharedNoteType}
					handleAddNewNote={handleAddNewNote}
					userAllNotes={userAllNotes}
					handleFolderChange={handleFolderChange}
					userAllDetails={userAllDetails}
					handleMsgShown={handleMsgShown}
				/>

				<div id="allContent">
					<div id="notesTitleContainer">
						<RenderAllNotes
							userAllNotes={
								isSharedNoteType ? [openedNoteAllData] : folderName ? currentFolderNotes : userAllNotes
							}
							handleNoteOpening={handleNoteOpening}
							isApiLoading={isApiLoading}
							handleAddNewNote={handleAddNewNote}
						/>
					</div>
					{isNotesModalOpen && (
						<div id="noteContentContainer">
							{userDeviceType().mobile && (
								<NavBar NavBarType="notesModal" handleAddNewNote={handleAddNewNote} />
							)}
							<RenderNoteContent
								isSaveBtnLoading={isSaveBtnLoading}
								handleNotesModalClosing={handleNotesModalClosing}
								openConfirmationDialog={() => setIsConfirmationDialogOpen(true)}
								toggleShareDialogBox={toggleShareDialogBox}
								openedNoteAllData={openedNoteAllData}
								// noteText={noteText}
								openedNoteText={openedNoteText}
								setOpenedNoteText={setOpenedNoteText}
								handleSaveBtnClick={handleSaveBtnClick}
								handleDeleteBtnClick={handleDeleteBtnClick}
								handleAddShareNoteUser={handleAddShareNoteUser}
								handleMsgShown={handleMsgShown}
							/>
						</div>
					)}
				</div>
			</div>

			{isConfirmationDialogOpen && (
				<ConfirmationDialog
					title="Are You Sure?"
					message="You can't undo this action."
					isOpen={isConfirmationDialogOpen}
					setIsConfirmationDialogOpen={setIsConfirmationDialogOpen}
					onYesClick={handleDeleteBtnClick}
				/>
			)}

			{isShareDialogBoxOpen && (
				<ShareDialogBox
					title="Share Note"
					toggleBtn={toggleShareDialogBox}
					handleAddShareNoteUser={handleAddShareNoteUser}
					openedNoteAllData={openedNoteAllData}
					setOpenedNoteAllData={setOpenedNoteAllData}
					// noteSharedUsers={noteSharedUsers}
					// setNoteSharedUsers={setNoteSharedUsers}
					handleMsgShown={handleMsgShown}
				/>
			)}

			{msg && <ShowMsg msgText={msg?.text} type={msg?.type} />}
		</>
	);
}

export default HomePage;
