import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleUserState } from '../firebase/auth';
import {
	getUserAllNoteData,
	addNewNote,
	deleteData,
	updateDocument,
	unsubscribeAll,
	getAllNotesOfFolder,
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

const localStorageNotesData = JSON.parse(decryptText(localStorage.getItem('note_data')));
const localFolderData = window.location?.hash?.slice(1)
	? JSON.parse(decryptText(localStorage.getItem(window.location?.hash?.slice(1))))
	: undefined;

function HomePage() {
	const [msg, setMsg] = useState({ text: '', type: '' });
	const [userAllNotes, setAllNotes] = useState(localStorageNotesData || []);
	const [userAllDetails, setUserAllDetails] = useState(USER_DETAILS || {});
	const [currentFolderNotes, setCurrentFolderNotes] = useState(localFolderData || []);

	const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
	const [currentNoteId, setCurrentNoteId] = useState('');
	const [noteText, setnoteText] = useState('');
	const [openedNoteData, setOpenedNoteData] = useState('');
	const [noteSharedUsers, setNoteSharedUsers] = useState([]);
	const [isNoteSharedWithAll, setIsNoteSharedWithAll] = useState(false);

	const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
	const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
	const [isShareDialogBoxOpen, setIsShareDialogBoxOpen] = useState(false);

	const [isPageLoaded, setIsPageLoaded] = useState(false);
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
	const [isApiLoading, setIsApiLoading] = useState(false);
	const navigate = useNavigate();

	const folderName = window.location.hash.slice(1);

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

	const openFirstNote = useCallback(function (allNotesAtr, index) {
		if (allNotesAtr.length === 0) return;

		setOpenedNoteData(allNotesAtr[index]?.noteData || '');
		// setnoteText(allNotesAtr[index]?.noteText || '');
		setCurrentNoteId(allNotesAtr[index]?.noteId || '');
		setNoteSharedUsers(allNotesAtr[index]?.noteSharedUsers || []);
		setIsNoteSharedWithAll(allNotesAtr[index]?.isNoteSharedWithAll || false);
		setCurrentNoteIndex(index);
	}, []);

	// fetch All noteData
	useEffect(() => {
		handleUserState(true);
		if (USER_DETAILS?.userId) {
			getUserAllNoteData(setAllNotes, setIsApiLoading, handleMsgShown);
			getUserAllData(setUserAllDetails, setIsApiLoading, handleMsgShown);
			setIsPageLoaded(true);
		}
	}, [handleMsgShown]);

	useEffect(() => {
		if (isNotesModalOpen === false && userDeviceType().desktop) {
			setIsNotesModalOpen(true);
			if (!folderName) {
				openFirstNote(userAllNotes, 0);
			} else {
				openFirstNote(currentFolderNotes, 0);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleNoteOpening = useCallback((index, item) => {
		const { noteId, noteText, noteData, noteSharedUsers, isNoteSharedWithAll } = item;
		if (noteId) setCurrentNoteId(noteId);
		setnoteText(noteText);
		setOpenedNoteData(noteData);
		setNoteSharedUsers(noteSharedUsers || []);
		setIsNoteSharedWithAll(isNoteSharedWithAll || false);
		setCurrentNoteIndex(index);
		setIsNotesModalOpen(true);
		if (userDeviceType().mobile) document.querySelector('body').style.overflow = 'hidden';
	}, []);

	const handleNotesModalClosing = useCallback(() => {
		setIsNotesModalOpen(false);
		if (userDeviceType().mobile) document.querySelector('body').style.overflow = 'auto';
	}, []);

	const handleFolderChange = useCallback(
		(item) => {
			unsubscribeAll();
			navigate('#' + item?.folderName);
			getAllNotesOfFolder(item, setCurrentFolderNotes, setIsApiLoading, handleMsgShown);
		},
		[handleMsgShown, navigate]
	);

	//add Note Function
	const handleAddNewNote = useCallback(
		(e) => {
			e.preventDefault();
			const newNoteText = e.target?.noteTitle?.value?.trim() || 'Enter Notes Title';
			const newNoteData = newNoteText
				? `<h1>${newNoteText}</h1><p><br></p>`
				: `<h1>Enter Notes Title</h1><p><br></p>`;

			const toSendNoteData = { newNoteText, newNoteData };
			handleNoteOpening(0, { noteText: newNoteText, noteData: newNoteData });
			addNewNote(toSendNoteData, setCurrentNoteId, handleMsgShown, setIsApiLoading);
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
			noteId: currentNoteId,
			noteTitle: noteTitleValue || 'Enter Notes Title',
			noteText: document.querySelector('.ql-editor')?.innerText || '',
			noteData: openedNoteData,
		};

		updateDocument(toSendData, setIsSaveBtnLoading, setIsNotesModalOpen, handleMsgShown);
	}, [getTitleValue, handleMsgShown, currentNoteId, openedNoteData]);

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

		deleteData(currentNoteId, setIsApiLoading, handleMsgShown, openFirstNote, userAllNotes, currentNoteIndex);
	}, [currentNoteId, handleMsgShown, openFirstNote, userAllNotes, currentNoteIndex]);

	//toggle share dialog box
	const toggleShareDialogBox = useCallback(() => {
		if (isShareDialogBoxOpen) {
			setIsNoteSharedWithAll(userAllNotes[currentNoteIndex]?.isNoteSharedWithAll || false);
			setNoteSharedUsers(userAllNotes[currentNoteIndex]?.noteSharedUsers || []);
		}
		setIsShareDialogBoxOpen((prev) => !prev);
	}, [userAllNotes, currentNoteIndex, isShareDialogBoxOpen]);

	/// handle add share note user
	const handleAddShareNoteUser = useCallback(
		(e) => {
			e.preventDefault();
			const email = e.target.shareEmailInput.value.trim();
			if (email === '' || USER_DETAILS?.email === email) return;

			for (let i = 0; i < noteSharedUsers.length; i++) {
				if (noteSharedUsers[i]?.email === email) {
					handleMsgShown('User Already Added');
					return;
				}
			}

			setNoteSharedUsers([{ email, canEdit: false }, ...noteSharedUsers]);
			e.target.reset();
		},
		[noteSharedUsers, handleMsgShown]
	);

	return (
		isPageLoaded && (
			<>
				<div id="homePage">
					<NavBar
						NavBarType="homePage"
						handleAddNewNote={handleAddNewNote}
						userAllNotes={userAllNotes}
						handleFolderChange={handleFolderChange}
						userAllDetails={userAllDetails}
						handleMsgShown={handleMsgShown}
					/>

					<div id="allContent">
						<div id="notesTitleContainer">
							<RenderAllNotes
								userAllNotes={folderName ? currentFolderNotes : userAllNotes}
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
									currentNoteId={currentNoteId}
									noteText={noteText}
									openedNoteData={openedNoteData}
									setOpenedNoteData={setOpenedNoteData}
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
						currentNoteId={currentNoteId}
						noteSharedUsers={noteSharedUsers}
						setNoteSharedUsers={setNoteSharedUsers}
						isNoteSharedWithAll={isNoteSharedWithAll}
						setIsNoteSharedWithAll={setIsNoteSharedWithAll}
						handleMsgShown={handleMsgShown}
					/>
				)}

				{msg && <ShowMsg msgText={msg?.text} type={msg?.type} />}
			</>
		)
	);
}

export default HomePage;
