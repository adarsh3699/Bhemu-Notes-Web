import React, { useState, useCallback } from 'react';
import { IconButton, Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import NotesIcon from '@mui/icons-material/Notes';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import CircularProgress from '@mui/material/CircularProgress';

import './notesModalBar.css';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
}
let loaderPosition = { top: 9, left: 9 };

if (getWindowDimensions().width <= 375) {
    loaderPosition = { top: 5.6, left: 4 };
}

function NotesModalBar({
    notesTitle,
    handleTitleChange,
    toggleConfirmationDialogClosing,
    handleSaveBtnClick,
    isSaveBtnLoading,
    handleModalClose,
}) {
    const [notesModalBarAnchorEl, setNotesModalBarAnchorEl] = useState(null);
    const isNotesModalBarMenuOpen = Boolean(notesModalBarAnchorEl);

    const toggleSettingsMenu = useCallback((event) => {
        setNotesModalBarAnchorEl(event.currentTarget);
    }, []);

    return (
        <div id="notesModelBar">
            <input
                type="text"
                id="title"
                autoComplete="off"
                value={notesTitle}
                onChange={handleTitleChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        document.getElementById('todo_0').focus();
                    }
                }}
            />
            <div id="barImg">
                <IconButton
                    id="deleteBtn"
                    color="inherit"
                    aria-label="delete"
                    size="large"
                    aria-expanded={isNotesModalBarMenuOpen ? 'true' : undefined}
                    aria-haspopup="true"
                    aria-controls={isNotesModalBarMenuOpen ? 'account-menu' : undefined}
                    onClick={toggleSettingsMenu}
                    sx={{ p: 1.2 }}
                >
                    <MoreVertIcon fontSize="inherit" />
                </IconButton>

                <div style={{ position: 'relative' }}>
                    <IconButton
                        id="saveBtn"
                        color="inherit"
                        aria-label="save"
                        size="large"
                        onClick={handleSaveBtnClick}
                        sx={{ p: 1.2 }}
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

            <Menu
                id="basic-menu"
                anchorEl={notesModalBarAnchorEl}
                open={isNotesModalBarMenuOpen}
                onClose={() => setNotesModalBarAnchorEl(null)}
                onClick={() => setNotesModalBarAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                PaperProps={{
                    sx: {
                        overflow: 'visible',
                        mt: 0.5,
                        '& .MuiMenuItem-root': {
                            height: 42.5,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            left: 17,
                            width: 10,
                            height: 10,
                            bgcolor: '#121212',
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            >
                <MenuItem>
                    <ListItemIcon>
                        <NotesIcon fontSize="small" />
                    </ListItemIcon>
                    Add Note
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <FormatListBulletedIcon fontSize="small" />
                    </ListItemIcon>
                    Add ToDo
                </MenuItem>
                <MenuItem onClick={toggleConfirmationDialogClosing}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>
        </div>
    );
}

export default NotesModalBar;
