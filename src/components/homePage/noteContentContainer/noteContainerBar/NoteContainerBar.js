import React, { useState, useCallback } from 'react';

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import CircularProgress from '@mui/material/CircularProgress';

import './noteContainerBar.css';

function NoteContainerBar({
    handleNotesModalClosing,
    handleSaveBtnClick,
    toggleConfirmationDialogClosing,
    isSaveBtnLoading,
}) {
    return (
        <div id="noteContainerBar">
            <div id='backAndTitleSection'>
                <IconButton
                    id="arrowBackIcon"
                    color="inherit"
                    aria-label="backBtn"
                    aria-haspopup="true"
                    onClick={handleNotesModalClosing}
                >
                    <ArrowBackIcon fontSize="inherit" />
                </IconButton>

                <IconButton
                    id="deleteBtn"
                    color="inherit"
                    aria-label="delete"
                    aria-haspopup="true"
                    onClick={toggleConfirmationDialogClosing}
                    sx={{ ml: 1 }}
                >
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </div>

            <div id='addNoteAndTodoSection'>
                <IconButton color="inherit" aria-label="addNotesBtn" aria-haspopup="true">
                    <TextIncreaseIcon fontSize="inherit" />
                </IconButton>
                <IconButton color="inherit" aria-label="addTodoBtn" aria-haspopup="true">
                    <FormatListBulletedIcon fontSize="inherit" />
                </IconButton>
            </div>

            <div id='deleteAndSaveBtnSection' >
                <IconButton color="inherit" aria-label="save" onClick={handleSaveBtnClick} sx={{ mr: 1 }}>
                    {isSaveBtnLoading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <SaveIcon fontSize="inherit" />
                    )}
                </IconButton>
            </div>
        </div>
    );
}

export default NoteContainerBar;
