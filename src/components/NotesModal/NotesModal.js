import React from 'react';
import Modal from '@mui/material/Modal';

import { IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import CircularProgress from '@mui/material/CircularProgress';

import styles from './notesModal.css';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
}
let loaderTop = 11;

if (getWindowDimensions().width <= 375) {
    loaderTop = 4;
}

function ModalWrapper({
    open,
    isSaveApiLoading,
    closeOnOutsideClick = true,
    containerClassName,
    handleModalClose,

    notesTitle,
    handleTitleChange,
    toggleConfirmationDialogClosing,
    handleSaveBtnClick,

    noteData,
    notesType,
    handleTextChange,
    handleCheckboxClick,
    handleEnterClick,
    handleDeleteToDoBtnClick,
    handleAddToDoBtnClick
}) {

    return (
        <Modal open={open} onClose={closeOnOutsideClick ? handleModalClose : null}>
            <div className={["modal", containerClassName].join("")}>
                <div className={styles.modalContent}>
                    <div id="notesModelBar">
                        <input type="text" id="title" autoComplete="off" value={notesTitle} onChange={handleTitleChange} />
                        <div id="barImg">
                            <IconButton
                                id="deleteBtn"
                                color="inherit"
                                aria-label="delete"
                                size="large"
                                onClick={toggleConfirmationDialogClosing}
                            >
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>

                            <div style={{ position: 'relative' }}>
                                <IconButton
                                    id="saveBtn"
                                    color="inherit"
                                    aria-label="save"
                                    size="large"
                                    onClick={handleSaveBtnClick}>
                                    {
                                        isSaveApiLoading ?
                                            <div style={{ height: "28px", width: "28px" }}></div>
                                            :
                                            <SaveIcon fontSize="inherit" />
                                    }
                                </IconButton>

                                {isSaveApiLoading && (
                                    <CircularProgress
                                        size={30}
                                        sx={{
                                            position: 'absolute',
                                            top: loaderTop,
                                            left: 11,
                                            zIndex: 1,
                                        }}
                                    />
                                )}
                            </div>

                            <Button
                                id='closeBtn'
                                color="inherit"
                                variant="text"
                                onClick={handleModalClose}
                            >Close</Button>
                        </div>
                    </div>
                </div>


                <div id="elementBox">
                    {
                        noteData.map(function (item, index) {
                            return (
                                notesType === false ? //type notes
                                    <textarea
                                        id="notesArea"
                                        key={index}
                                        placeholder="Take a note..."
                                        autoFocus={item.element ? false : true}
                                        value={item.element}
                                        onChange={(e) => handleTextChange(index, e)}
                                    >
                                    </textarea>
                                    :
                                    notesType === true ? //type todo

                                        <div className="toDosBox" key={index} >
                                            <input
                                                style={{ marginLeft: "10px" }}
                                                type="checkbox"
                                                checked={item?.isDone}
                                                onChange={() => handleCheckboxClick(index, item.isDone)}
                                            />
                                            <input
                                                type="text"
                                                id={index}
                                                className={item?.isDone ? "todosIsDone todosInputBox" : "todosInputBox"}
                                                value={item.element || ""}
                                                autoComplete="off"
                                                onChange={(e) => handleTextChange(index, e)}
                                                // autoFocus={noteData.length - 1 === index ? true : false}
                                                onKeyDown={(e) => e.key === "Enter" ? handleEnterClick(index, e) : null}
                                            />
                                            <IconButton sx={{ color: "#F1F1F1", padding: " 0 5px 0 0" }} aria-label="delete" onClick={() => handleDeleteToDoBtnClick(index)} size="large">
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        </div>
                                        : null

                            )
                        })
                    }
                    {notesType === true ? <div id="addTodos" onClick={handleAddToDoBtnClick}>Add ToDos</div> : null}
                </div>
            </div>
        </Modal>
    );
}

export default ModalWrapper;