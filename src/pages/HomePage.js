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

let params = new URL(document.location).searchParams;

const localFolderData = params.get('folder')
	? localStorage.getItem(params.get('folder')) && JSON.parse(decryptText(localStorage.getItem(params.get('folder'))))
	: undefined;

const sharedNoteId = window.location?.pathname?.split('share/')?.[1];
const isSharedNoteType = sharedNoteId ? true : false;

function HomePage() {
	const [msg, setMsg] = useState({ text: '', type: '' });

	const [userAllDetails, setUserAllDetails] = useState(USER_DETAILS || {});
	const [userAllNotes, setAllNotes] = useState(
		(localStorage.getItem('note_data') && JSON.parse(decryptText(localStorage.getItem('note_data')))) || []
	);
	const [currentFolderNotes, setCurrentFolderNotes] = useState(localFolderData || []);

	const [openedNoteIndex, setOpenedNoteIndex] = useState(0);
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
		if (!isSharedNoteType) handleUserState(true);
		if (isNotesModalOpen === false && userDeviceType().desktop) setIsNotesModalOpen(true);
		if (USER_DETAILS?.userId) {
			getUserAllNoteData(setAllNotes, setIsApiLoading, handleMsgShown, handleNoteOpening);
			getUserAllData(setUserAllDetails, setIsApiLoading, handleMsgShown);

			urlNoteId &&
				getOpenNoteData(
					urlNoteId,
					setOpenedNoteAllData,
					setOpenedNoteText,
					setIsApiLoading,
					handleMsgShown,
					handleNoteOpening
				);
		}
		if (sharedNoteId) {
			getOpenNoteData(
				sharedNoteId,
				setOpenedNoteAllData,
				setOpenedNoteText,
				setIsApiLoading,
				handleMsgShown,
				navigate,
				isSharedNoteType
			);
		}
		setIsPageLoaded(false);
		const isNoteTitlePresent = userAllDetails?.userFolders?.some((folder) => {
			return folder.folderName === folderName;
		});

		if (!isNoteTitlePresent && folderName) {
			navigate('/');
			handleNoteOpening(0, userAllNotes?.[0] || []);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleNoteOpening = useCallback(
		(index, item, folder) => {
			// if (isSharedNoteType) return;
			let { noteId, noteData } = item || {};
			if (!noteId) return navigate('/');

			if (urlNoteId === noteId || !noteId) return;
			folder = folder || folderName;

			navigate(folder ? `/?folder=${folder}#${noteId}` : `#${noteId}`);
			unsubscribeAllNotes();
			setOpenedNoteText(noteData);
			getOpenNoteData(
				item?.noteId,
				setOpenedNoteAllData,
				setOpenedNoteText,
				setIsApiLoading,
				handleMsgShown,
				handleNoteOpening
			);

			setOpenedNoteAllData(item);
			setIsNotesModalOpen(true);
			setOpenedNoteIndex(index);
			if (userDeviceType().mobile) document.querySelector('body').style.overflow = 'hidden';
		},
		[navigate, urlNoteId, folderName, handleMsgShown]
	);

	const handleNotesModalClosing = useCallback(() => {
		setIsNotesModalOpen(false);
		if (userDeviceType().mobile) document.querySelector('body').style.overflow = 'auto';
	}, []);

	const handleFolderChange = useCallback(
		(item) => {
			if (folderName === item?.folderName) return;

			setSearchParams({ folder: item?.folderName });
			unsubscribeAllFolders();

			getAllNotesOfFolder(
				item,
				setCurrentFolderNotes,
				setIsApiLoading,
				handleMsgShown,
				item?.folderName,
				handleNoteOpening
			);
		},
		[folderName, handleMsgShown, handleNoteOpening, setSearchParams]
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

	const checkShareUserPermission = useCallback(() => {
		if (USER_DETAILS.userId) {
			if (!openedNoteAllData?.canEdit) {
				handleMsgShown('Insufficient permissions. Contact the onwer for edit permission.', 'warning');
				return true;
			}
		} else {
			handleMsgShown('Please create a account to edit this note.', 'warning');
			return true;
		}
	}, [handleMsgShown, openedNoteAllData?.canEdit]);

	//handle note or todo save
	const handleSaveBtnClick = useCallback(() => {
		if (isSharedNoteType) if (checkShareUserPermission()) return;

		setIsSaveBtnLoading(true);
		const html = document.querySelector('.ql-editor').innerHTML;
		const noteTitleValue = getTitleValue(html);

		const toSendData = {
			noteId: openedNoteAllData.noteId,
			noteTitle: noteTitleValue || 'Enter Notes Title',
			noteText: document.querySelector('.ql-editor')?.innerText || '',
			noteData: openedNoteText,
		};

		updateDocument(toSendData, setIsSaveBtnLoading, handleMsgShown);
	}, [checkShareUserPermission, getTitleValue, openedNoteAllData?.noteId, openedNoteText, handleMsgShown]);

	//add Note Function
	const handleAddNewNote = useCallback(
		(e) => {
			e?.preventDefault();
			const newNoteText = e?.target?.noteTitle?.value?.trim() || 'Enter Notes Title';
			const newNoteData = `<h1>${newNoteText}</h1><p><br></p><p><br></p><p><br></p>`;

			const toSendNoteData = { newNoteText, newNoteData };
			handleNoteOpening(0, { noteText: newNoteText, noteData: newNoteData });
			addNewNote(toSendNoteData, handleMsgShown, setIsApiLoading, isSharedNoteType);
			if (e?.target?.noteTitle?.value?.trim()) e?.target?.reset();
		},
		[handleMsgShown, handleNoteOpening]
	);

	//handle note delete
	const handleDeleteBtnClick = useCallback(async () => {
		if (isSharedNoteType) return handleMsgShown('Only the owner can delete this note.', 'warning');
		setIsConfirmationDialogOpen(false);

		deleteData(
			openedNoteAllData.noteId,
			setIsApiLoading,
			handleMsgShown,
			openedNoteIndex,
			userAllNotes,
			handleNoteOpening
		);
	}, [openedNoteAllData, handleMsgShown, openedNoteIndex, userAllNotes, handleNoteOpening]);

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
		[openedNoteAllData, handleMsgShown]
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
								// handleMsgShown={handleMsgShown}
								SharedUserCanEdit={isSharedNoteType ? openedNoteAllData?.canEdit : true}
								isSharedNoteType={isSharedNoteType}
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
