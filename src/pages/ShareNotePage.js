import React, { useState, useCallback, useEffect } from "react";

import ShowMsg from '../components/showMsg/ShowMsg.js';
import { getSearchedNoteData } from '../firebase/shareNote.js';
import { userDeviceType } from '../utils';


import NavBar from '../components/homePage/navBar/NavBar';
import RenderNotesTitle from '../components/homePage/renderNotesTitle/RenderNotesTitle';
import RenderNoteContent from '../components/homePage/renderNoteContent/RenderNoteContent';

function ShareNotePage() {
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [searchedNoteData, setSearchedNoteData] = useState({});

    const [isGetApiLoading, setIsGetApiLoading] = useState(false);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

    const handleMsgShown = useCallback((msgText, type) => {
        if (msgText) {
            setMsg({ text: msgText, type: type });
            setTimeout(() => {
                setMsg({ text: '', type: '' });
            }, 2500);
        } else {
            console.log('Please Provide Text Msg');
        }
    }, []);

    useEffect(() => {
        const noteId = window.location?.pathname?.split('/')?.[2];
        console.log(noteId);
        getSearchedNoteData(noteId, setSearchedNoteData, handleMsgShown, setIsGetApiLoading);
        document.title = 'SmartBCA | Search';
    }, [handleMsgShown]);

    return (
        <div id="shareNotePage">
            <NavBar NavBarType='shareNotePage' />
            <h1>ShareNotePage</h1>

            <div id="allContent">
                <div id="notesTitleContainer">
                    {/* <RenderNotesTitle
                    // allNotes={allNotes}
                    // handleNoteOpening={handleNoteOpening}
                    // isApiLoading={isApiLoading}
                    // handleAddNoteInputBox={handleAddNoteInputBox}
                    /> */}
                </div>
                {/* {isNotesModalOpen && (
                    <div id="noteContentContainer">
                        {userDeviceType().mobile && <NavBar NavBarType="notesModal" addNotes={addNotes} />}
                        <RenderNoteContent
                            isSaveBtnLoading={isSaveBtnLoading}
                            handleNotesModalClosing={handleNotesModalClosing}
                            openConfirmationDialog={() => setIsConfirmationDialogOpen(true)}
                            toggleShareDialogBox={toggleShareDialogBox}
                            myNotesId={myNotesId}
                            notesTitle={notesTitle}
                            openedNoteData={openedNoteData}
                            handleSaveBtnClick={handleSaveBtnClick}
                            handleDeleteBtnClick={handleDeleteBtnClick}
                            handleNoteTextChange={handleNoteTextChange}
                            handleCheckboxClick={handleCheckboxClick}
                            handleDeleteToDoBtnClick={handleDeleteToDoBtnClick}
                            handleAddTodoBtn={handleAddTodoBtn}
                            handleAddShareNoteUser={handleAddShareNoteUser}
                            handleTodoEnterClick={handleTodoEnterClick}
                            handleBackspaceClick={handleBackspaceClick}
                            todoRef={todoRef}
                            focusedInput={focusedInput}
                            setfocusedInput={setfocusedInput}
                            lastTextBoxRef={lastTextBoxRef}
                        />
                    </div>
                )} */}
            </div>

            {msg && <ShowMsg isError={msg?.text ? true : false} msgText={msg?.text} type={msg?.type} />}
        </div>
    );
}

export default ShareNotePage;