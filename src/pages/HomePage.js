import React, { useState, useEffect, useCallback } from 'react';
import { apiCall, getLoggedUserId, setLoggedUserId } from "../utils";
import Loader from "../components/Loader";
import NotesModal from "../components/NotesModal/NotesModal";
import Hotkeys from 'react-hot-keys';
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog";

import NavBar from '../components/NavBar/';
import RenderNotes from '../components/RenderNotes/RenderNotes';

import "../css/homePage.css";


const myUserId = getLoggedUserId();

function HomePage() {
    const [msg, setMsg] = useState("");
    const [list, setList] = useState([]);
    const [flag, setFlag] = useState(false);

    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const [myNotesId, setMyNotesId] = useState("");
    const [notesType, setNotesType] = useState(0);
    const [notesTitle, setNotesTitle] = useState("");
    const [noteData, setNoteData] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaveApiLoading, setIsSaveApiLoading] = useState(false);
    const [isApiLoading, setIsApiLoading] = useState(false);

    useEffect(() => {
        if (!myUserId) {
            document.location.href = "/";
            return;
        } else {
            setIsLoading(false);
            document.title = "Bhemu Notes"
        }
    }, []);

    useEffect(() => {
        (async function () {
            if (myUserId) {
                setIsApiLoading(true);
                const apiResp = await apiCall("notes?userId=" + myUserId);
                if (apiResp.statusCode === 200) {
                    setIsApiLoading(false);
                    setList(apiResp.data)

                } else {
                    setIsApiLoading(false);
                    setMsg(apiResp.msg)
                }
            }
        })();
    }, [flag]);

    useEffect(function () {
        document.addEventListener("keydown", (e) => {
            if (e.key === 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
            }
        }, true);

        // //component did un-mount
        return function () {
            document.removeEventListener("keydown", (e) => {
                if (e.key === 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                    e.preventDefault();
                }
            }, true);
        }
    }, []);

    const handleNoteOpening = useCallback((noteId, type, title, data) => {
        setMyNotesId(noteId)
        setNotesType(type)
        setNotesTitle(title)
        setNoteData(data)
        setIsNotesModalOpen(true);
    }, [setMyNotesId, setNotesType, setNotesTitle, setNoteData, setIsNotesModalOpen]);

    const addNotes = useCallback(async (type, notesTitle) => {
        setIsApiLoading(true);
        const apiResp = await apiCall("notes?userId=" + myUserId, "post", ({ notesType: type, notesTitle: notesTitle }));
        if (apiResp.statusCode === 200) {
            setFlag(!flag)
            handleNoteOpening(apiResp?.notesId, type, notesTitle, [{ "element": "", "isDone": false }])
        } else {
            setMsg(apiResp.msg)
        }
        setIsApiLoading(false)
    }, [setFlag, flag, handleNoteOpening]);

    const handleAddNotesInputbox = useCallback((e) => {
        e.preventDefault();
        const textInput = e.target.searchBox.value
        addNotes(false, textInput);
        e.target.reset()
    }, [addNotes])

    const handleLogoutBtnClick = useCallback(() => {
        setLoggedUserId("");
        document.location.href = "/";
    }, [])

    const handleTitleChange = useCallback((e) => {
        setNotesTitle(e.target.value)
    }, [setNotesTitle])

    const handleSaveBtnClick = useCallback(async () => {
        if (isNotesModalOpen) {
            setIsSaveApiLoading(true);

            const apiResp = await apiCall("notes?notesId=" + myNotesId, "put", { notesTitle, newNotes: noteData });
            if (apiResp.statusCode === 200) {
                setFlag(!flag)
            } else {
                setMsg(apiResp.msg);
                setIsNotesModalOpen(false)
            }
            setIsSaveApiLoading(false);
        }
    }, [flag, isNotesModalOpen, myNotesId, noteData, notesTitle])

    const handleDeleteBtnClick = useCallback(async () => {
        setIsApiLoading(true);
        setIsNotesModalOpen(false);
        setIsConfirmationDialogOpen(false);

        const apiResp = await apiCall("notes?noteId=" + myNotesId, "delete");
        if (apiResp.statusCode === 200) {
            setFlag(!flag)
            setMsg("Note Deleted");
        } else {
            setMsg(apiResp.msg);
        }
        setIsApiLoading(false);
    }, [flag, myNotesId])

    //For Todo's
    const handleCheckboxClick = useCallback((index, isDone) => {
        const newToDos = noteData.map(function (toDo, i) {
            return (i === index ? { ...toDo, isDone: isDone ? false : true } : toDo)
        })
        setNoteData(newToDos);
    }, [noteData])

    const handleTextChange = useCallback((index, e) => {
        const newToDos = noteData.map(function (toDo, i) {
            return (i === index ? { ...toDo, element: e.target.value } : toDo)
        })

        setNoteData(newToDos);
    }, [noteData])

    const handleEnterClick = useCallback((index) => {
        const tempData = [...noteData];
        tempData.splice(index + 1, 0, { element: "", isDone: false })
        setNoteData(tempData)
        if (noteData.length - 1 !== index) {
            document.getElementById(index + 1).focus();
        }
    }, [noteData])

    const handleDeleteToDoBtnClick = useCallback((index) => {
        let newToDos = noteData.filter((data, i) => {
            return (i !== index) ? data : null
        });

        setNoteData(newToDos);
    }, [noteData])

    const handleAddToDoBtnClick = useCallback(() => {
        setNoteData([...noteData, { element: "", isDone: false }]);
    }, [noteData])

    //function to handle when "ctrl + s" is pressed
    const handleShortcutKeyPress = useCallback(() => {
        if (isNotesModalOpen) {
            handleSaveBtnClick()
        }
    }, [handleSaveBtnClick, isNotesModalOpen])

    const handleNotesModalClosing = useCallback(() => {
        setIsNotesModalOpen(false);
    }, [])

    return (
        <>
            {
                !isLoading &&
                <>
                    <Hotkeys
                        keyName="ctrl+s,control+s,⌘+s,ctrl+⇪+s,control+⇪+s,⌘+⇪+s"
                        onKeyDown={handleShortcutKeyPress}
                        // onKeyUp={onKeyUp}
                        filter={(event) => {
                            return true; //to enable shortcut key inside input, textarea and select too
                        }}
                    />
                    {
                        isConfirmationDialogOpen &&
                        <ConfirmationDialog
                            title="Are You Sure?"
                            message="You can't undo this action."
                            isOpen={isConfirmationDialogOpen}
                            onCancel={() => setIsConfirmationDialogOpen(false)}
                            onYesClick={handleDeleteBtnClick}
                        />}

                    <div id='homePage'>
                        <NavBar
                            handleAddNotesInputbox={handleAddNotesInputbox}
                            handleLogoutBtnClick={handleLogoutBtnClick}
                            addNotes={addNotes}
                        />

                        <div id="msg" >{msg}</div>
                        <Loader isLoading={isApiLoading} />

                        <RenderNotes
                            list={list}
                            handleNoteOpening={handleNoteOpening}
                        />

                        {
                            isNotesModalOpen &&
                            <NotesModal
                                open={isNotesModalOpen}
                                isSaveApiLoading={isSaveApiLoading}
                                closeOnOutsideClick={handleNotesModalClosing}
                                handleModalClose={handleNotesModalClosing}
                                toggleConfirmationDialogClosing={() => setIsConfirmationDialogOpen(true)}

                                notesTitle={notesTitle}
                                handleTitleChange={handleTitleChange}
                                handleDeleteBtnClick={handleDeleteBtnClick}
                                handleSaveBtnClick={handleSaveBtnClick}
                                noteData={noteData}
                                notesType={notesType}

                                handleTextChange={handleTextChange}
                                handleCheckboxClick={handleCheckboxClick}
                                handleEnterClick={handleEnterClick}
                                handleDeleteToDoBtnClick={handleDeleteToDoBtnClick}
                                handleAddToDoBtnClick={handleAddToDoBtnClick}
                            />
                        }


                    </div>
                </>
            }
        </>
    )
}

export default HomePage;