import React, { useEffect } from 'react';
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

	notesTitle,
	toggleConfirmationDialogClosing,
	handleSaveBtnClick,

	openedNoteData,
	handleNoteTextChange,
	handleCheckboxClick,
	handleDeleteToDoBtnClick,
	handleAddTodoBtn,
	handleAddNoteBtn,
	handleTodoEnterClick,
	handleBackspaceClick,
	todoRef,
	focusedInput,
	setfocusedInput,
	lastTextBoxRef,
}) {
	useEffect(() => {
		if (lastTextBoxRef.current) {
			lastTextBoxRef.current.focus();
		}
	}, [lastTextBoxRef]);

	useEffect(() => {
		if (focusedInput) todoRef?.current?.focus();
		setfocusedInput(null);
	}, [focusedInput, todoRef, setfocusedInput]);

	useEffect(() => {
		const textBox = lastTextBoxRef?.current;
		if (textBox && openedNoteData.length >= 1) {
			const upperHeight = textBox?.getBoundingClientRect()?.top;
			textBox.style.minHeight = 'calc(100vh - ' + (upperHeight + 15) + 'px)';
		}
	});

	return (
		<>
			<NoteContainerBar
				handleNotesModalClosing={handleNotesModalClosing}
				isSaveBtnLoading={isSaveBtnLoading}
				handleAddTodoBtn={handleAddTodoBtn}
				handleAddNoteBtn={handleAddNoteBtn}
				toggleConfirmationDialogClosing={toggleConfirmationDialogClosing}
				handleSaveBtnClick={handleSaveBtnClick}
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
							className={
								openedNoteData.length > 7 && openedNoteData.length - 1 === index
									? 'notesArea lastNotesArea'
									: 'notesArea'
							}
							onChange={(e) => handleNoteTextChange(index, e)}
							value={item?.element}
							ref={openedNoteData.length - 1 === index ? lastTextBoxRef : null}
							onKeyDown={(e) => {
								if (
									(e.key === 'Backspace' || e.keyCode === 8 || e.which === 8) &&
									openedNoteData.length - 1 !== index
								) {
									handleBackspaceClick(e, index);
								}
							}}
						/>
					) : item?.type === 'todo' ? ( //type todo/////////
						<div className="toDosBox" key={index}>
							<Checkbox
								icon={<CircleOutlinedIcon />}
								checkedIcon={<CheckCircleOutlineIcon />}
								checked={item?.isDone}
								onChange={() => handleCheckboxClick(index, item.isDone)}
								size="small"
								sx={{ p: 0.5, ml: 1 }}
							/>
							<input
								type="text"
								id={'textbox_' + index}
								className={item?.isDone ? 'todosIsDone todosInputBox' : 'todosInputBox'}
								value={item.element || ''}
								autoComplete="off"
								spellCheck="false"
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
