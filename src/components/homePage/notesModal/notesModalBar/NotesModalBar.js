import React from 'react';
import { IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

import CircularProgress from '@mui/material/CircularProgress';

import './notesModalBar.css';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
}
let loaderPosition = {top: 9, left: 9}

if (getWindowDimensions().width <= 375) {
    loaderPosition = {top: 5.6, left: 4};
}

function NotesModalBar({
    notesTitle,
    handleTitleChange,
    toggleConfirmationDialogClosing,
    handleSaveBtnClick,
    isSaveBtnLoading,
    handleModalClose,
}) {
    return (
        <div id="notesModelBar">
            <input type="text" id="title" autoComplete="off" value={notesTitle} onChange={handleTitleChange} />
            <div id="barImg">
                <IconButton
                    id="deleteBtn"
                    color="inherit"
                    aria-label="delete"
                    size="large"
                    onClick={toggleConfirmationDialogClosing}
                    sx={{p: 1.2}}
                >
                    <DeleteIcon fontSize="inherit" />
                </IconButton>

                <div style={{ position: 'relative' }}>
                    <IconButton
                        id="saveBtn"
                        color="inherit"
                        aria-label="save"
                        size="large"
                        onClick={handleSaveBtnClick}
                        sx={{p: 1.2}}
                    >
                        {isSaveBtnLoading ? (
                            <div style={{ height: '28px', width: '28px' }}></div>
                        ) : (
                            <SaveIcon fontSize="inherit" />
                        )}
                    </IconButton>

                    {isSaveBtnLoading && (
                        <CircularProgress
                            size={30}
                            sx={{
                                position: 'absolute',
                                top: loaderPosition.top,
                                left: loaderPosition.left,
                                zIndex: 1,
                            }}
                        />
                    )}
                </div>

                <Button id="closeBtn" color="inherit" variant="text" onClick={handleModalClose}>
                    Close
                </Button>
            </div>
        </div>
    );
}

export default NotesModalBar;
