import React from 'react';
import NoteContainerBar from './noteContainerBar/NoteContainerBar';

import { IconButton } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import './noteContentContainer.css';

function NoteContentContainer({
    isNotesModalOpen,
    isSaveBtnLoading,
    handleNotesModalClosing,

    notesTitle,
    handleTitleChange,
    toggleConfirmationDialogClosing,
    handleSaveBtnClick,

    openedNoteData,
    notesType,
    handleTextChange,
    handleCheckboxClick,
    handleDeleteToDoBtnClick,
    handleEnterClick,
    todoRef,
    focusedInput,
}) {
    return (
        <>
            <NoteContainerBar
                handleNotesModalClosing={handleNotesModalClosing}
                isSaveBtnLoading={isSaveBtnLoading}
                handleTitleChange={handleTitleChange}
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
                        }
                    }}
                >
                    {notesTitle}
                </div>

                {openedNoteData.map(function (item, index) {
                    return notesType === 'note' ? ( //type notes
                        <textarea
                            id="notesArea"
                            key={index}
                            placeholder="Take a note..."
                            autoFocus={true}
                            value={item.element}
                            onChange={(e) => handleTextChange(index, e)}
                        ></textarea>
                    ) : notesType === 'todo' ? ( //type todo
                        <div className={index === 0 ? 'toDosBox firstToDoBox' : 'toDosBox'} key={index}>
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
                                id={'todo_' + index}
                                className={item?.isDone ? 'todosIsDone todosInputBox' : 'todosInputBox'}
                                value={item.element || ''}
                                autoComplete="off"
                                spellCheck="false"
                                onChange={(e) => handleTextChange(index, e)}
                                ref={focusedInput === index ? todoRef : null}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleEnterClick(e, index);
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
                    ) : null;
                })}
            </div>
        </>
    );
}

export default NoteContentContainer;
