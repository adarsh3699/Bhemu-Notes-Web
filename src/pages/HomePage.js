import React, { useState, useEffect, useCallback, useRef } from 'react';

import { handleUserState } from '../firebase/auth';
import { getUserAllNoteData, addNewNote, deleteData, updateDocument } from '../firebase/notes';

import NavBar from '../components/homePage/navBar/NavBar';
import RenderNotesTitle from '../components/homePage/renderNotesTitle/RenderNotesTitle';
import RenderNoteContent from '../components/homePage/renderNoteContent/RenderNoteContent';
import ConfirmationDialog from '../components/confirmationDialog/ConfirmationDialogBox';
import ErrorMsg from '../components/errorMsg/ErrorMsg';

import Hotkeys from 'react-hot-keys';

import '../styles/homePage.css';

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;
	return { width, height };
}

document.addEventListener(
	'keydown',
	(e) => {
		if (e.key === 's' && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
			e.preventDefault();
		}
	},
	true
);

function HomePage() {
	const [msg, setMsg] = useState('');
	const [allNotes, setAllNotes] = useState([]);

	const [myNotesId, setMyNotesId] = useState('');
	const [notesTitle, setNotesTitle] = useState('');
	const [openedNoteData, setOpenedNoteData] = useState([]);

	const [isNotesModalOpen, setIsNotesModalOpen] = useState(getWindowDimensions()?.width > 768 ? true : false);
	const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
	const [isPageLoaded, setIsPageLoaded] = useState(false);
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
	const [isApiLoading, setIsApiLoading] = useState(false);
	const [focusedInput, setfocusedInput] = useState(null);
	const todoRef = useRef();
	const lastTextBoxRef = useRef();

	useEffect(() => {
		handleUserState('homePage');
		if (JSON.parse(localStorage.getItem('user_details'))) {
			getUserAllNoteData(setAllNotes, setIsApiLoading, setMsg);
			setIsPageLoaded(true);
			document.title = 'Bhemu Notes';
		}
	}, []);

	// useEffect(function () {
	// 	setOpenedNoteData(allNotes[0]?.noteData || [])
	// 	setNotesTitle(allNotes[0]?.notesTitle || '')
	// 	setMyNotesId(allNotes[0]?.notesId || '')
	// }, [allNotes]);

	const handleErrorShown = useCallback((msgText) => {
		if (msgText) {
			setMsg(msgText);
			setTimeout(() => {
				setMsg('');
			}, 2500);
		} else {
			console.log('Please Provide Text Msg');
		}
	}, []);

	const handleNoteOpening = useCallback(
		(noteId, title, data) => {
			if (noteId) setMyNotesId(noteId);
			setNotesTitle(title);
			setOpenedNoteData(data);
			setIsNotesModalOpen(true);
			setfocusedInput(null);
		},
		[setNotesTitle, setOpenedNoteData, setIsNotesModalOpen]
	);

	//add Note Function
	const addNotes = useCallback(
		(e, notesTitle) => {
			setIsApiLoading(true);
			const newNotesTitle = notesTitle ? notesTitle : 'Enter Notes Title';
			const newNoteData = [{ element: '', type: 'note' }];

			const toSendNoteData = { newNotesTitle, newNoteData };
			handleNoteOpening('', newNotesTitle, newNoteData);
			addNewNote(toSendNoteData, setMyNotesId, handleErrorShown, setIsApiLoading);
		},
		[handleNoteOpening, handleErrorShown]
	);

	const handleAddNoteInputBox = useCallback(
		(e) => {
			e.preventDefault();
			const newNotesTitle = e.target.noteTitle.value.trim();
			if (newNotesTitle) {
				setIsApiLoading(true);
				const newNoteData = [{ element: '', type: 'note' }];

				const toSendNoteData = { newNotesTitle, newNoteData };
				handleNoteOpening('', newNotesTitle, newNoteData);
				addNewNote(toSendNoteData, setMyNotesId, handleErrorShown, setIsApiLoading);
				e.target.reset();
			}
		},
		[handleNoteOpening, handleErrorShown]
	);

	// handle note or todo title change
	const handleTitleChange = useCallback(
		(e) => {
			setNotesTitle(e.target.value);
		},
		[setNotesTitle]
	);

	//handle note or todo save
	const handleSaveBtnClick = useCallback(async () => {
		setIsSaveBtnLoading(true);
		const toSendData = {
			noteId: myNotesId,
			notesTitle: document.getElementById('titleTextBox')?.innerText,
			noteData: openedNoteData,
		};
		updateDocument(toSendData, setIsSaveBtnLoading, setIsNotesModalOpen, handleErrorShown);
	}, [handleErrorShown, myNotesId, openedNoteData]);

	//handle note or todo delete
	const handleDeleteBtnClick = useCallback(async () => {
		setIsApiLoading(true);
		setIsNotesModalOpen(false);
		setIsConfirmationDialogOpen(false);

		deleteData(myNotesId, setIsApiLoading, handleErrorShown);
	}, [handleErrorShown, myNotesId]);

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

	//function to handle when "ctrl + s" is pressed
	const handleShortcutKeyPress = useCallback(() => {
		if (isNotesModalOpen) {
			handleSaveBtnClick();
		}
	}, [handleSaveBtnClick, isNotesModalOpen]);

	const handleNotesModalClosing = useCallback(() => {
		setIsNotesModalOpen(false);
		setfocusedInput(null);
	}, []);

	const handleAddTodoBtn = useCallback(
		(e) => {
			let tempData = [...openedNoteData];
			if (lastTextBoxRef?.current) {
				lastTextBoxRef.current.style.minHeight = '';
				if (!lastTextBoxRef.current?.value.trim()) {
					tempData.splice(openedNoteData.length - 1, 0, { element: '', isDone: false, type: 'todo' });
				} else {
					tempData.push({ element: '', isDone: false, type: 'todo' }, { element: '', type: 'note' });
				}
			}

			setOpenedNoteData(tempData);
		},
		[openedNoteData]
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

	const handleBackspaceClick = useCallback(
		(e, index) => {
			if (e.target.value.trim() === '') {
				e.preventDefault();
				let newToDos = openedNoteData.filter((data, i) => {
					return i !== index ? data : null;
				});

				setOpenedNoteData(newToDos);

				if (openedNoteData.length - 1 !== index) {
					document.getElementById('textbox_' + (index - 1))?.focus();
				} else {
					setfocusedInput(index - 1);
				}
			}
		},
		[openedNoteData]
	);

	return (
		isPageLoaded && (
			<>
				<div id="homePage">
					<NavBar addNotes={addNotes} />

					{/* <div id="msg">{msg}</div> */}

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
								<RenderNoteContent
									isNotesModalOpen={isNotesModalOpen}
									isSaveBtnLoading={isSaveBtnLoading}
									handleNotesModalClosing={handleNotesModalClosing}
									toggleConfirmationDialogClosing={() => setIsConfirmationDialogOpen(true)}
									notesTitle={notesTitle}
									handleTitleChange={handleTitleChange}
									handleDeleteBtnClick={handleDeleteBtnClick}
									handleSaveBtnClick={handleSaveBtnClick}
									openedNoteData={openedNoteData}
									handleNoteTextChange={handleNoteTextChange}
									handleCheckboxClick={handleCheckboxClick}
									handleDeleteToDoBtnClick={handleDeleteToDoBtnClick}
									handleAddTodoBtn={handleAddTodoBtn}
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

				<Hotkeys
					keyName="ctrl+s,control+s,⌘+s,ctrl+⇪+s,control+⇪+s,⌘+⇪+s"
					onKeyDown={handleShortcutKeyPress}
					// onKeyUp={onKeyUp}
					filter={(event) => {
						return true; //to enable shortcut key inside input, textarea and select too
					}}
				/>
				{isConfirmationDialogOpen && (
					<ConfirmationDialog
						title="Are You Sure?"
						message="You can't undo this action."
						isOpen={isConfirmationDialogOpen}
						onCancel={() => setIsConfirmationDialogOpen(false)}
						onYesClick={handleDeleteBtnClick}
					/>
				)}
				{msg && <ErrorMsg isError={msg ? true : false} msgText={msg} />}
			</>
		)
	);
}

export default HomePage;
