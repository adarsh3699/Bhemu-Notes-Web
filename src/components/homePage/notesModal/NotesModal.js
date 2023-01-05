import React, { useEffect } from 'react';
import Modal from '@mui/material/Modal';

import { IconButton } from '@mui/material';
import NotesModalBar from './notesModalBar/NotesModalBar';
import CloseIcon from '@mui/icons-material/Close';

import Checkbox from '@mui/material/Checkbox';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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
    handleDeleteToDoBtnClick,
    handleEnterClick,
    todoRef,
    focusedInput,
}) {
    useEffect(() => {
        if (focusedInput) todoRef?.current?.focus();
    }, [focusedInput, todoRef]);

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
                        <form
                            className={index === 0 ? 'toDosBox firstToDoBox' : 'toDosBox'}
                            key={index}
                            onSubmit={(e) => handleEnterClick(e, index)}
                        >
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
                                id={index}
                                className={item?.isDone ? 'todosIsDone todosInputBox' : 'todosInputBox'}
                                value={item.element || ''}
                                autoComplete="off"
                                spellCheck="false"
                                onChange={(e) => handleTextChange(index, e)}
                                ref={focusedInput === index ? todoRef : null}
                            />
                            <IconButton
                                sx={{ color: '#F1F1F1', p: '5px', mr: 1 }}
                                aria-label="delete"
                                onClick={() => handleDeleteToDoBtnClick(index)}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        </form>
                    ) : null;
                })}
            </div>
        </Modal>
    );
}

export default ModalWrapper;
