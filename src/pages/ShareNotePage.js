import React, { useState, useCallback, useEffect } from 'react';

import ShowMsg from '../components/showMsg/ShowMsg.js';
import { getSearchedNoteData } from '../firebase/shareNote.js';
import { userDeviceType } from '../utils';

import NavBar from '../components/homePage/navBar/NavBar';
import RenderNotesTitle from '../components/homePage/renderNotesTitle/RenderNotesTitle';
import RenderNoteContent from '../components/homePage/renderNoteContent/RenderNoteContent';

import '../styles/shareNotePage.css';

function ShareNotePage() {
	const [msg, setMsg] = useState({ text: '', type: '' });
	const [searchedNoteData, setSearchedNoteData] = useState([]);

	const [isGetApiLoading, setIsGetApiLoading] = useState(true);
	const [isNotesModalOpen, setIsNotesModalOpen] = useState(true);

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
		document.title = 'Bhemu Notes | Share';
	}, [handleMsgShown]);

	return (
		<div id="shareNotePage">
			<NavBar NavBarType="shareNotePage" />

			<div id="allContent">
				<div id="notesTitleContainer">
					<RenderNotesTitle
						isShareNoteType={true}
						allNotes={searchedNoteData}
						isApiLoading={isGetApiLoading}
						// handleNoteOpening={handleNoteOpening}
						// handleAddNoteInputBox={handleAddNoteInputBox}
					/>
				</div>
				{isNotesModalOpen && (
					<div id="noteContentContainer">
						{userDeviceType().mobile && <NavBar NavBarType="notesModal" />}
						<RenderNoteContent
							isShareNoteType={true}
							// isSaveBtnLoading={isSaveBtnLoading}
							// handleNotesModalClosing={handleNotesModalClosing}
							// openConfirmationDialog={() => setIsConfirmationDialogOpen(true)}
							// toggleShareDialogBox={toggleShareDialogBox}

							myNotesId={searchedNoteData[0]?.notesId}
							notesTitle={searchedNoteData[0]?.notesTitle}
							openedNoteData={searchedNoteData[0]?.noteData || []}

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
