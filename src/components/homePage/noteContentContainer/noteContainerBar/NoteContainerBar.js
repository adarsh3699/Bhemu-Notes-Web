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
            <div>
                <IconButton
                    id="arrowBackIcon"
                    color="inherit"
                    aria-label="delete"
                    aria-haspopup="true"
                    sx={{ mr: 1.6 }}
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
                >
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </div>

            <div>
                <IconButton id="deleteBtn" color="inherit" aria-label="delete" aria-haspopup="true">
                    <TextIncreaseIcon fontSize="inherit" />
                </IconButton>
                <IconButton id="deleteBtn" color="inherit" aria-label="delete" aria-haspopup="true">
                    <FormatListBulletedIcon fontSize="inherit" />
                </IconButton>
            </div>

            <div style={{ position: 'relative' }}>
                <IconButton color="inherit" aria-label="save" onClick={handleSaveBtnClick}>
                    {isSaveBtnLoading ? (
                        <div style={{ height: '28px', width: '28px' }}></div>
                    ) : (
                        <SaveIcon fontSize="inherit" />
                    )}
                </IconButton>

                {isSaveBtnLoading && (
                    <CircularProgress
                        size={28}
                        sx={{
                            position: 'absolute',
                            top: 7,
                            left: 10,
                            zIndex: 1,
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default NoteContainerBar;
