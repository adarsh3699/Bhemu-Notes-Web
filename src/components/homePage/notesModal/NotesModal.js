import React from 'react';
import Modal from '@mui/material/Modal';

import { IconButton } from '@mui/material';
import NotesModalBar from './notesModalBar/NotesModalBar';
import CloseIcon from '@mui/icons-material/Close';

import './notesModal.css';

function ModalWrapper({
    open,
    isSaveBtnLoading,
    closeOnOutsideClick = true,
    containerClassName,
    handleModalClose,

    notesTitle,
    handleTitleChange,
    toggleConfirmationDialogClosing,
    handleSaveBtnClick,

    openedNoteData,
    notesType,
    handleTextChange,
    handleCheckboxClick,
    handleEnterClick,
    handleDeleteToDoBtnClick,
    handleAddToDoBtnClick,
}) {
    return (
        <Modal open={open} onClose={closeOnOutsideClick ? handleModalClose : null}>
            <div className={['modal', containerClassName].join('')}>
                <NotesModalBar
                    handleModalClose={handleModalClose}
                    isSaveBtnLoading={isSaveBtnLoading}
                    notesTitle={notesTitle}
                    handleTitleChange={handleTitleChange}
                    toggleConfirmationDialogClosing={toggleConfirmationDialogClosing}
                    handleSaveBtnClick={handleSaveBtnClick}
                />

                <div id="elementBox">
                    {openedNoteData.map(function (item, index) {
                        return notesType === 'note' ? ( //type notes
                            <textarea
                                id="notesArea"
                                key={index}
                                placeholder="Take a note..."
                                autoFocus={item.element ? false : true}
                                value={item.element}
                                onChange={(e) => handleTextChange(index, e)}
                            ></textarea>
                        ) : notesType === 'todo' ? ( //type todo
                            <div className="toDosBox" key={index}>
                                <input
                                    style={{ marginLeft: '10px' }}
                                    type="checkbox"
                                    checked={item?.isDone}
                                    onChange={() => handleCheckboxClick(index, item.isDone)}
                                />
                                <input
                                    type="text"
                                    id={index}
                                    className={item?.isDone ? 'todosIsDone todosInputBox' : 'todosInputBox'}
                                    value={item.element || ''}
                                    autoComplete="off"
                                    spellCheck="false"
                                    onChange={(e) => handleTextChange(index, e)}
                                    // autoFocus={noteData.length - 1 === index ? true : false}
                                    onKeyDown={(e) => (e.key === 'Enter' ? handleEnterClick(index, e) : null)}
                                />
                                <IconButton
                                    sx={{ color: '#F1F1F1', padding: '5px' }}
                                    aria-label="delete"
                                    onClick={() => handleDeleteToDoBtnClick(index)}
                                    size="large"
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            </div>
                        ) : null;
                    })}
                    {notesType === true ? (
                        <div id="addTodos" onClick={handleAddToDoBtnClick}>
                            Add ToDos
                        </div>
                    ) : null}
                </div>
            </div>
        </Modal>
    );
}

export default ModalWrapper;
