import React, { useState, useEffect, useCallback, useRef } from 'react';

import { handleUserState } from '../firebase/auth';
import { getUserAllNoteData, addNewNote, deleteData, updateDocument } from '../firebase/notes';
import { decryptText, userDeviceType } from '../utils';

import NavBar from '../components/homePage/navBar/NavBar';
import RenderNotesTitle from '../components/homePage/renderNotesTitle/RenderNotesTitle';
import RenderNoteContent from '../components/homePage/renderNoteContent/RenderNoteContent';
import ConfirmationDialog from '../components/confirmationDialog/ConfirmationDialogBox';
import ShareDialogBox from '../components/shareDialog/ShareDialogBox';
import ShowMsg from '../components/showMsg/ShowMsg';

import { useHotkeys } from 'react-hotkeys-hook';

import '../styles/homePage.css';

document.addEventListener(
	'keydown',
	(e) => {
		if (e.key === 's' && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
			e.preventDefault();
		}
	},
	true
);

const localStorageNotesData = JSON.parse(decryptText(localStorage.getItem('note_data')));
const user_details = JSON.parse(localStorage.getItem('user_details'));

function HomePage() {
	const [msg, setMsg] = useState({ text: '', type: '' });
	const [allNotes, setAllNotes] = useState(localStorageNotesData || []);

	const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
	const [myNotesId, setMyNotesId] = useState('');
	const [notesTitle, setNotesTitle] = useState('');
	const [openedNoteData, setOpenedNoteData] = useState([]);
	const [noteSharedUsers, setNoteSharedUsers] = useState([]);
	const [isNoteSharedWithAll, setIsNoteSharedWithAll] = useState(false);

	const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
	const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
	const [isShareDialogBoxOpen, setIsShareDialogBoxOpen] = useState(false);

	const [isPageLoaded, setIsPageLoaded] = useState(false);
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
	const [isApiLoading, setIsApiLoading] = useState(false);
	const [focusedInput, setfocusedInput] = useState(null);
	const todoRef = useRef();
	const lastTextBoxRef = useRef();

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

	const openFirstNote = useCallback(function (allNotesAtr) {
		if (allNotesAtr.length === 0) return;
		setOpenedNoteData(allNotesAtr[0]?.noteData || []);
		setNotesTitle(allNotesAtr[0]?.notesTitle || '');
		setMyNotesId(allNotesAtr[0]?.notesId || '');
		setNoteSharedUsers(allNotesAtr[0]?.noteSharedUsers || []);
		setIsNoteSharedWithAll(allNotesAtr[0]?.isNoteSharedWithAll || false);
		setCurrentNoteIndex(0);
	}, []);

	// fetch All noteData
	useEffect(() => {
		handleUserState(true);
		if (JSON.parse(localStorage.getItem('user_details'))) {
			getUserAllNoteData(setAllNotes, setIsApiLoading, handleMsgShown);
			setIsPageLoaded(true);
			document.title = 'Bhemu Notes';
		}
	}, [handleMsgShown]);

	useEffect(() => {
		if (isNotesModalOpen === false && userDeviceType().desktop) {
			setIsNotesModalOpen(true);
			openFirstNote(allNotes);
		}
	}, [openFirstNote, allNotes, isNotesModalOpen]);

	const handleNoteOpening = useCallback(
		(index, noteId, title, data, shareWith, userPermission) => {
			if (noteId) setMyNotesId(noteId);
			setNotesTitle(title);
			setOpenedNoteData(data);
			setIsNotesModalOpen(true);
			setNoteSharedUsers(shareWith || []);
			setIsNoteSharedWithAll(userPermission || false);
			setCurrentNoteIndex(index);
			if (userDeviceType().mobile) document.querySelector('body').style.overflow = 'hidden';
		},
		[setNotesTitle, setOpenedNoteData, setIsNotesModalOpen]
	);

	const handleNotesModalClosing = useCallback(() => {
		setIsNotesModalOpen(false);
		if (userDeviceType().mobile) document.querySelector('body').style.overflow = 'auto';
	}, []);

	//add Note Function
	const addNotes = useCallback(
		(e, notesTitle) => {
			setIsApiLoading(true);
			const newNotesTitle = notesTitle ? notesTitle : 'Enter Notes Title';
			const newNoteData = [{ element: '', type: 'note' }];

			const toSendNoteData = { newNotesTitle, newNoteData };
			handleNoteOpening(0, '', newNotesTitle, newNoteData);
			addNewNote(toSendNoteData, setMyNotesId, handleMsgShown, setIsApiLoading);
		},
		[handleNoteOpening, handleMsgShown]
	);

	const handleAddNoteInputBox = useCallback(
		(e) => {
			e.preventDefault();
			const newNotesTitle = e.target.noteTitle.value.trim();
			if (newNotesTitle) {
				setIsApiLoading(true);
				const newNoteData = [{ element: '', type: 'note' }];

				const toSendNoteData = { newNotesTitle, newNoteData };
				handleNoteOpening(0, '', newNotesTitle, newNoteData);
				addNewNote(toSendNoteData, setMyNotesId, handleMsgShown, setIsApiLoading);
				e.target.reset();
			}
		},
		[handleNoteOpening, handleMsgShown]
	);

	//handle note or todo save
	const handleSaveBtnClick = useCallback(async () => {
		setIsSaveBtnLoading(true);
		const toSendData = {
			noteId: myNotesId,
			notesTitle: document.getElementById('titleTextBox')?.innerText,
			noteData: openedNoteData,
		};
		updateDocument(toSendData, setIsSaveBtnLoading, setIsNotesModalOpen, handleMsgShown);
	}, [handleMsgShown, myNotesId, openedNoteData]);

	//handle note or todo delete
	const handleDeleteBtnClick = useCallback(async () => {
		handleNotesModalClosing();
		setIsConfirmationDialogOpen(false);

		deleteData(myNotesId, setIsApiLoading, handleMsgShown);
	}, [handleMsgShown, myNotesId, handleNotesModalClosing]);

	//handle todo checkbo click
	const handleCheckboxClick = useCallback(
		(index, isDone) => {
			const newToDos = openedNoteData.map(function (toDo, i) {
				return i === index ? { ...toDo, isDone: isDone ? false : true } : toDo;
			});
			setOpenedNoteData(newToDos);
		},
		[openedNoteData]
	);

	const handleNoteTextChange = useCallback(
		(index, e) => {
			const newToDos = openedNoteData.map(function (item, i) {
				return i === index ? { ...item, element: e.target.value } : item;
			});
			setOpenedNoteData(newToDos);
		},
		[openedNoteData]
	);

	const handleDeleteToDoBtnClick = useCallback(
		(index) => {
			let newToDos = openedNoteData.filter((data, i) => {
				return i !== index ? data : null;
			});

			setOpenedNoteData(newToDos);
		},
		[openedNoteData]
	);

	//handle Save when "ctrl + s" is pressed
	useHotkeys(
		['ctrl + s', 'meta + s'],
		() => {
			if (isNotesModalOpen) {
				handleSaveBtnClick();
			}
		},
		{ enableOnFormTags: true }
	);

	const handleAddTodoBtn = useCallback(
		(e) => {
			let tempData = [...openedNoteData];
			if (lastTextBoxRef?.current) {
				lastTextBoxRef.current.style.minHeight = '';
				if (!lastTextBoxRef.current?.value.trim()) {
					tempData.splice(openedNoteData.length - 1, 0, { element: '', isDone: false, type: 'todo' });
					setfocusedInput(openedNoteData.length - 1);
				} else {
					tempData.push({ element: '', isDone: false, type: 'todo' }, { element: '', type: 'note' });
					setfocusedInput(openedNoteData.length);
				}
			}

			setOpenedNoteData(tempData);
		},
		[openedNoteData]
	);

	/// handle add share note user
	const handleAddShareNoteUser = useCallback(
		(e) => {
			e.preventDefault();
			const email = e.target.shareEmailInput.value.trim();
			if (email === '' || user_details?.email === email) return;

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

	const handleTodoEnterClick = useCallback(
		(e, index) => {
			e.preventDefault();
			if (e?.target?.value) {
				const tempData = [...openedNoteData];
				tempData.splice(index + 1, 0, { element: '', isDone: false, type: 'todo' });

				setOpenedNoteData(tempData);
			}
			document.getElementById('textbox_' + (index + 1)).focus();
			setfocusedInput(index + 1);
		},
		[openedNoteData]
	);

	// handleBackspaceClick in todo and note
	const handleBackspaceClick = useCallback(
		(e, index) => {
			if (e.target.value.trim() === '') {
				e.preventDefault();

				if (openedNoteData.length - 1 !== index) {
					//for last textbox
					let newToDos = openedNoteData.filter((data, i) => {
						return i !== index ? data : null;
					});
					setOpenedNoteData(newToDos);
				}
				if (openedNoteData.length - 1 !== index) {
					document.getElementById('textbox_' + (index - 1))?.focus();
				} else {
					setfocusedInput(index - 1);
				}
			}
		},
		[openedNoteData]
	);

	const toggleShareDialogBox = useCallback(() => {
		if (isShareDialogBoxOpen) {
			setIsNoteSharedWithAll(allNotes[currentNoteIndex]?.isNoteSharedWithAll || false);
			setNoteSharedUsers(allNotes[currentNoteIndex]?.noteSharedUsers || []);
		}
		setIsShareDialogBoxOpen((prev) => !prev);
	}, [allNotes, currentNoteIndex, isShareDialogBoxOpen]);

	return (
		isPageLoaded && (
			<>
				<div id="homePage">
					<NavBar NavBarType="homePage" addNotes={addNotes} />

					<div id="allContent">
						<div id="notesTitleContainer">
							<RenderNotesTitle
								allNotes={allNotes}
								handleNoteOpening={handleNoteOpening}
								isApiLoading={isApiLoading}
								handleAddNoteInputBox={handleAddNoteInputBox}
							/>
						</div>
						{isNotesModalOpen && (
							<div id="noteContentContainer">
								{userDeviceType().mobile && <NavBar NavBarType="notesModal" addNotes={addNotes} />}
								<RenderNoteContent
									isSaveBtnLoading={isSaveBtnLoading}
									handleNotesModalClosing={handleNotesModalClosing}
									openConfirmationDialog={() => setIsConfirmationDialogOpen(true)}
									toggleShareDialogBox={toggleShareDialogBox}
									myNotesId={myNotesId}
									notesTitle={notesTitle}
									openedNoteData={openedNoteData}
									handleSaveBtnClick={handleSaveBtnClick}
									handleDeleteBtnClick={handleDeleteBtnClick}
									handleNoteTextChange={handleNoteTextChange}
									handleCheckboxClick={handleCheckboxClick}
									handleDeleteToDoBtnClick={handleDeleteToDoBtnClick}
									handleAddTodoBtn={handleAddTodoBtn}
									handleAddShareNoteUser={handleAddShareNoteUser}
									handleTodoEnterClick={handleTodoEnterClick}
									handleBackspaceClick={handleBackspaceClick}
									todoRef={todoRef}
									focusedInput={focusedInput}
									setfocusedInput={setfocusedInput}
									lastTextBoxRef={lastTextBoxRef}
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
						myNotesId={myNotesId}
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
