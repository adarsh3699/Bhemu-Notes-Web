import React, { useEffect, useRef } from 'react';
import NoteContainerBar from './noteContainerBar/NoteContainerBar';

import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import TextareaAutosize from 'react-textarea-autosize';

import './renderNoteContent.css';

function RenderNoteContent({
	isSaveBtnLoading,
	handleNotesModalClosing,
	openConfirmationDialog,
	toggleShareDialogBox,

	myNotesId,
	notesTitle,
	openedNoteData,

	handleSaveBtnClick,
	handleDeleteToDoBtnClick,
	handleNoteTextChange,
	handleCheckboxClick,
	handleAddTodoBtn,
	handleAddNoteBtn,
	handleTodoEnterClick,
	handleBackspaceClick,
	handleAddShareNoteUser,

	todoRef,
	focusedInput,
	setfocusedInput,
	lastTextBoxRef,
}) {
	const lastTodoRef = useRef(null);
	console.log(openedNoteData);
	useEffect(() => {
		if ((lastTextBoxRef?.current && lastTextBoxRef?.current.value !== '') || openedNoteData?.length === 1) {
			lastTextBoxRef?.current?.focus();
		} else if (lastTextBoxRef.current && openedNoteData.length > 1) {
			lastTodoRef?.current?.children[1]?.focus();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastTextBoxRef, myNotesId]);

	useEffect(() => {
		if (focusedInput || focusedInput === 0) todoRef?.current?.focus();
		setfocusedInput(null);
	}, [focusedInput, todoRef, setfocusedInput]);

	useEffect(() => {
		const textBox = lastTextBoxRef?.current;
		if (textBox && openedNoteData.length >= 1) {
			const upperHeight = textBox?.getBoundingClientRect()?.top;
			textBox.style.minHeight = 'calc(100vh - 300px - ' + (upperHeight + 15) + 'px)';
		}
	});

	return (
		<>
			<NoteContainerBar
				handleNotesModalClosing={handleNotesModalClosing}
				isSaveBtnLoading={isSaveBtnLoading}
				handleAddTodoBtn={handleAddTodoBtn}
				handleAddNoteBtn={handleAddNoteBtn}
				openConfirmationDialog={openConfirmationDialog}
				handleSaveBtnClick={handleSaveBtnClick}
				handleAddShareNoteUser={handleAddShareNoteUser}
				toggleShareDialogBox={toggleShareDialogBox}
			/>

			<div id="userNotesContent">
				<div
					id="titleTextBox"
					aria-multiline="true"
					placeholder="Title"
					role="textbox"
					spellCheck="true"
					dir="ltr"
					tabIndex="0"
					contentEditable
					suppressContentEditableWarning
					onKeyDown={(e) => {
						if (e.keyCode === 13 || e.which === 13) {
							e.preventDefault();
							document.getElementById('textbox_0').focus();
						}
					}}
				>
					{notesTitle}
				</div>

				{openedNoteData.map(function (item, index) {
					return item?.type === 'note' ? ( //type notes
						<TextareaAutosize
							id={'textbox_' + index}
							key={index}
							placeholder={openedNoteData.length === 1 ? 'Take a note' : null}
							className={openedNoteData.length - 1 === index ? 'notesArea lastNotesArea' : 'notesArea'}
							onChange={(e) => handleNoteTextChange(index, e)}
							value={item?.element}
							ref={openedNoteData.length - 1 === index ? lastTextBoxRef : null}
							onKeyDown={(e) => {
								if (e.key === 'Backspace' || e.keyCode === 8 || e.which === 8) {
									handleBackspaceClick(e, index);
								}
							}}
						/>
					) : item?.type === 'todo' ? ( //type todo/////////
						<div
							className="toDosBox"
							key={index}
							ref={openedNoteData.length - 2 === index ? lastTodoRef : null}
						>
							<Checkbox
								icon={<CircleOutlinedIcon />}
								checkedIcon={<CheckCircleOutlineIcon />}
								checked={item?.isDone}
								onChange={() => handleCheckboxClick(index, item.isDone)}
								size="small"
								sx={{ p: 0.5, ml: 1 }}
							/>
							<TextareaAutosize
								type="text"
								id={'textbox_' + index}
								className={item?.isDone ? 'todosIsDone todosInputBox' : 'todosInputBox'}
								value={item.element || ''}
								autoComplete="off"
								spellCheck="false"
								enterKeyHint="Next"
								onChange={(e) => handleNoteTextChange(index, e)}
								ref={focusedInput === index ? todoRef : null}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
										handleTodoEnterClick(e, index);
									} else if (e.key === 'Backspace' || e.keyCode === 8 || e.which === 8) {
										handleBackspaceClick(e, index);
									}
								}}
							/>
							<IconButton
								sx={{ color: '#F1F1F1', p: '5px', mr: 1 }}
								aria-label="delete"
								onClick={() => handleDeleteToDoBtnClick(index)}
							>
								<CloseIcon fontSize="inherit" />
							</IconButton>
						</div>
					) : (
						'null'
					);
				})}
			</div>
		</>
	);
}

export default RenderNoteContent;
