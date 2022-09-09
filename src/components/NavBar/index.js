import React from 'react';

import "./files/navBar.css"

import logo from "./files/logo.jpeg"

function NavBar({
    handleAddNotesInputbox, handleLogoutBtnClick, addNotes, isOptionVisible, handleOptionVisibility
}) {


    return (
        <>
            <div className="navbar">
                <div id="logo">
                    <img src={logo} alt="" onClick={handleLogoutBtnClick} />
                    <div id="name">Bhemu Notes</div>
                </div>
                <form onSubmit={handleAddNotesInputbox}>
                    <input type="text" id="searchBox" name='searchBox' placeholder="Add Notes" />
                </form>
                <div className="addNoteBtn" onClick={handleOptionVisibility}>Add Note</div>
            </div>

            {
                isOptionVisible ?
                    <div id="option" className={isOptionVisible ? 'showOption' : null} onClick={(e) => e.stopPropagation()} >
                        <div onClick={() => addNotes(false, "Enter Notes Title")}>Note</div>
                        <div onClick={() => addNotes(true, "Enter Notes Title")}>ToDos</div>
                    </div>
                    :
                    null
            }
        </>
    );
}

export default NavBar;