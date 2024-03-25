import React, { useState, useCallback, useEffect } from 'react';

import ShowMsg from '../components/showMsg/ShowMsg.js';
import { getSearchedNoteData } from '../firebase/features.js';
import { userDeviceType } from '../utils';

import NavBar from '../components/homePage/navBar/NavBar';
import RenderAllNotes from '../components/homePage/renderAllNotes/RenderAllNotes';
import RenderNoteContent from '../components/homePage/renderNoteContent/RenderNoteContent';

import '../styles/shareNotePage.css';

document.title = 'Bhemu Notes | Share';

function ShareNotePage() {
	const [msg, setMsg] = useState({ text: '', type: '' });
	const [searchedNoteData, setSearchedNoteData] = useState({});

	const [isGetApiLoading, setIsGetApiLoading] = useState(true);
	const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

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

	useEffect(() => {
		const noteId = window.location?.pathname?.split('/')?.[2];
		getSearchedNoteData(noteId, setSearchedNoteData, handleMsgShown, setIsGetApiLoading);

		if (isNotesModalOpen === false && userDeviceType().desktop) {
			setIsNotesModalOpen(true);
		}
	}, [handleMsgShown, isNotesModalOpen, setIsNotesModalOpen]);

	const handleNotesModalClosing = useCallback(() => {
		setIsNotesModalOpen(false);
		if (userDeviceType().mobile) document.querySelector('body').style.overflow = 'auto';
	}, []);

	const handleNoteOpening = useCallback(() => {
		if (searchedNoteData?.noteId) setIsNotesModalOpen(true);
	}, [setIsNotesModalOpen, searchedNoteData]);

	return (
		<div id="shareNotePage">
			<NavBar NavBarType="shareNotePage" handleMsgShown={handleMsgShown} />

			<div id="allContent">
				<div id="notesTitleContainer">
					<RenderAllNotes
						isShareNoteType={true}
						userAllNotes={[searchedNoteData]}
						isApiLoading={isGetApiLoading}
						handleNoteOpening={handleNoteOpening}
						handleMsgShown={handleMsgShown}
						// handleAddNoteInputBox={handleAddNoteInputBox}
					/>
				</div>
				{isNotesModalOpen && (
					<div id="noteContentContainer">
						{userDeviceType().mobile && (
							<NavBar NavBarType="shareNotePage" handleMsgShown={handleMsgShown} />
						)}
						<RenderNoteContent
							isShareNoteType={true}
							// isSaveBtnLoading={isSaveBtnLoading}
							handleNotesModalClosing={handleNotesModalClosing}
							// openConfirmationDialog={() => setIsConfirmationDialogOpen(true)}
							// toggleShareDialogBox={toggleShareDialogBox}

							currentNoteId={searchedNoteData?.noteId}
							// notesTitle={searchedNoteData?.notesTitle}
							openedNoteData={searchedNoteData?.noteData || ''}
							handleMsgShown={handleMsgShown}

							// handleSaveBtnClick={handleSaveBtnClick}
							// handleDeleteBtnClick={handleDeleteBtnClick}
							// handleNoteTextChange={handleNoteTextChange}
							// handleCheckboxClick={handleCheckboxClick}
							// handleDeleteToDoBtnClick={handleDeleteToDoBtnClick}
							// handleAddTodoBtn={handleAddTodoBtn}
							// handleAddShareNoteUser={handleAddShareNoteUser}
							// handleTodoEnterClick={handleTodoEnterClick}
							// handleBackspaceClick={handleBackspaceClick}
							// todoRef={todoRef}
							// focusedInput={focusedInput}
							// setfocusedInput={setfocusedInput}
							// lastTextBoxRef={lastTextBoxRef}
						/>
					</div>
				)}
			</div>

			{msg && <ShowMsg msgText={msg?.text} type={msg?.type} />}
		</div>
	);
}

export default ShareNotePage;
