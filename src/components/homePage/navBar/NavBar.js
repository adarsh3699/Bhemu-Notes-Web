import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { handleSignOut } from '../../../firebase/auth/auth';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';

import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import NotesIcon from '@mui/icons-material/Notes';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import './files/navBar.css';

import logo from './files/logo.jpeg';

const userName =
    JSON.parse(localStorage.getItem('user_details'))?.firstName +
    ' ' +
    JSON.parse(localStorage.getItem('user_details'))?.lastName;

function NavBar({ handleAddNotesInputbox, addNotes }) {
    const [addNotesAnchorEl, setAddNotesAnchorEl] = useState(null);
    const [settingMenuAnchorEl, setSettingMenuAddNotesAnchorEl] = useState(null);
    const isAddNotesMenuOpen = Boolean(addNotesAnchorEl);

    const isSettingsAnchorElopen = Boolean(settingMenuAnchorEl);

    const toggleAddNotesMenu = (event) => {
        setAddNotesAnchorEl(event.currentTarget);
    };

    const toggleSettingsMenu = (event) => {
        setSettingMenuAddNotesAnchorEl(event.currentTarget);
    };

    const handleLogoutBtnClick = useCallback(() => {
        handleSignOut();
        document.location.href = '/';
    }, []);

    return (
        <>
            {/* settings notes */}
            <Menu
                anchorEl={settingMenuAnchorEl}
                id="account-menu"
                open={isSettingsAnchorElopen}
                onClose={() => setSettingMenuAddNotesAnchorEl(null)}
                onClick={() => setSettingMenuAddNotesAnchorEl(null)}
                PaperProps={{
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1,
                        '& .MuiMenuItem-root': {
                            height: 45,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            left: 20,
                            width: 10,
                            height: 10,
                            bgcolor: '#121212',
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <NavLink to="/Settings">
                    <MenuItem>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                </NavLink>
                <MenuItem onClick={handleLogoutBtnClick}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* add notes Munu */}
            <Menu
                id="basic-menu"
                anchorEl={addNotesAnchorEl}
                open={isAddNotesMenuOpen}
                onClose={() => setAddNotesAnchorEl(null)}
                onClick={() => setAddNotesAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                PaperProps={{
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1,
                        '& .MuiMenuItem-root': {
                            height: 45,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 25,
                            width: 10,
                            height: 10,
                            bgcolor: '#121212',
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => addNotes(false, 'Enter Notes Title')}>
                    <ListItemIcon>
                        <NotesIcon fontSize="small" />
                    </ListItemIcon>
                    Notes
                </MenuItem>
                <MenuItem onClick={() => addNotes(true, 'Enter Notes Title')}>
                    <ListItemIcon>
                        <FormatListBulletedIcon fontSize="small" />
                    </ListItemIcon>
                    ToDos
                </MenuItem>
            </Menu>

            <div className="navbar">
                <div id="logo">
                    <IconButton
                        id="iconMenuBtn"
                        color="inherit"
                        aria-expanded={isSettingsAnchorElopen ? 'true' : undefined}
                        aria-haspopup="true"
                        aria-controls={isSettingsAnchorElopen ? 'account-menu' : undefined}
                        onClick={toggleSettingsMenu}
                    >
                        <Avatar alt="Remy Sharp" src={logo} sx={{ width: 35, height: 35 }} />
                    </IconButton>
                    <div id="name">{localStorage.getItem('user_details') ? userName : 'Bhemu Notes'}</div>
                </div>

                <form onSubmit={handleAddNotesInputbox}>
                    <input type="text" id="searchBox" name="searchBox" placeholder="Add Notes" />
                </form>

                <Button
                    className="addNoteBtn"
                    variant="contained"
                    color="success"
                    id="basic-button"
                    aria-controls={isAddNotesMenuOpen ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isAddNotesMenuOpen ? 'true' : undefined}
                    onClick={toggleAddNotesMenu}
                >
                    Add Note
                </Button>
            </div>
        </>
    );
}

export default NavBar;
