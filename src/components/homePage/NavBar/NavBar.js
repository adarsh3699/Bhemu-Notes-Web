import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import './files/navBar.css';

import logo from './files/logo.jpeg';

function NavBar({ handleAddNotesInputbox, handleDrawerToggle, addNotes }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotesClick = () => {
        addNotes(false, 'Enter Notes Title');
        setAnchorEl(null);
    };

    const handleTodoClick = () => {
        addNotes(true, 'Enter Notes Title');
        setAnchorEl(null);
    };

    return (
        <>
            <div className="navbar">
                <div id="logo">
                    <img src={logo} alt="" onClick={handleDrawerToggle} />
                    <div id="name">Bhemu Notes</div>
                </div>
                <form onSubmit={handleAddNotesInputbox}>
                    <input type="text" id="searchBox" name="searchBox" placeholder="Add Notes" />
                </form>
                <Button
                    className="addNoteBtn"
                    variant="contained"
                    color="success"
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    Add Note
                </Button>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleNotesClick}>Notes</MenuItem>
                    <MenuItem onClick={handleTodoClick}>ToDos</MenuItem>
                </Menu>
            </div>
        </>
    );
}

export default NavBar;
