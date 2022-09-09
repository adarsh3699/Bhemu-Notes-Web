import React, { useState, useEffect, useCallback } from 'react';
import { apiCall, getLoggedUserId, setLoggedUserId } from "../utils";
import Loader from "../components/Loader";
import NotesModal from "../components/NotesModal/";
import Button from '@mui/material/Button';
import NavBar from '../components/NavBar/';
import RenderNotes from '../components/RenderNotes/';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import "../css/homePage.css";
import "../css/notes.css"


const myUserId = getLoggedUserId();

function HomePage() {
    const [isOptionVisible, setisOptionVisible] = useState(false);
    const [msg, setMsg] = useState("");
    const [list, setList] = useState([]);
    const [flag, setFlag] = useState(false);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [myNotesId, setMyNotesId] = useState("");
    const [notesType, setNotesType] = useState(0);
    const [notesTitle, setNotesTitle] = useState("");
    const [noteData, setNoteData] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
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

    const handleNoteOpening = useCallback((noteId, type, title, Data) => {
        setMyNotesId(noteId)
        setNotesType(type)
        setNotesTitle(title)
        setNoteData(Data)
        setIsNoteOpen(true);
    }, [setMyNotesId, setNotesType, setNotesTitle, setNoteData, setIsNoteOpen]);

    const addNotes = useCallback(async (type, notesTitle) => {
        setIsApiLoading(true);
        const apiResp = await apiCall("notes?userId=" + myUserId, "post", ({ notesType: type, notesTitle: notesTitle }));
        if (apiResp.statusCode === 200) {
            setFlag(!flag)
            console.log("Notes Added");
            handleNoteOpening(apiResp?.notesId, type, notesTitle, [{}])
        } else {
            setMsg(apiResp.msg)
        }
    }, [setFlag, flag, handleNoteOpening]);

    const handleAddNotesInputbox = useCallback((e) => {
        e.preventDefault();
        const textInput = e.target.searchBox.value
        addNotes(false, textInput);
        e.target.reset()
    }, [addNotes])

    const handleOptionVisibility = useCallback(() => {
        setisOptionVisible(!isOptionVisible);
    }, [setisOptionVisible, isOptionVisible])

    const handleLogoutBtnClick = useCallback(() => {
        setLoggedUserId("");
        document.location.href = "/";
    }, [])

    const handleTitleChange = useCallback((e) => {
        setNotesTitle(e.target.value)
    }, [setNotesTitle])

    const handleSaveBtnClick = useCallback(async () => {
        setIsApiLoading(true);
        setIsNoteOpen(false)
        const apiResp = await apiCall("notes?notesId=" + myNotesId, "put", { notesTitle, newNotes: noteData });

        if (apiResp.statusCode === 200) {
            setFlag(!flag)
            setIsApiLoading(false);
            setMsg("Saved");
            console.log("Notes Updated =>", apiResp.msg);
        } else {
            setMsg(apiResp.msg);
        }
    }, [flag, myNotesId, noteData, notesTitle])

    const handleDeleteBtnClick = useCallback(async () => {
        setIsApiLoading(true);
        setIsNoteOpen(false)
        const apiResp = await apiCall("notes?noteId=" + myNotesId, "delete");
        if (apiResp.statusCode === 200) {
            setFlag(!flag)
            setIsApiLoading(false);
            setMsg("Note Deleted");
        } else {
            setMsg(apiResp.msg);
        }
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



    return (
        <>
            {
                isLoading ? null
                    :
                    <div id='homePage'>
                        <NavBar
                            handleAddNotesInputbox={handleAddNotesInputbox}
                            handleLogoutBtnClick={handleLogoutBtnClick}
                            addNotes={addNotes}
                            isOptionVisible={isOptionVisible}
                            handleOptionVisibility={handleOptionVisibility}
                        />

                        <div id="msg" >{msg}</div>
                        <Loader isLoading={isApiLoading} />

                        <RenderNotes
                            list={list}
                            handleNoteOpening={handleNoteOpening}
                        />

                        {
                            isNoteOpen ?
                                <NotesModal
                                    open={isNoteOpen}
                                    closeOnOutsideClick={() => setIsNoteOpen(false)}
                                    handleModalClose={() => setIsNoteOpen(false)}
                                >
                                    <div id="notesModelBar">
                                        <input type="text" id="title" autoComplete="off" value={notesTitle} onChange={handleTitleChange} />
                                        <div id="barImg">
                                            <IconButton
                                                id="deleteBtn"
                                                color="inherit"
                                                aria-label="delete"
                                                size="large"
                                                onClick={handleDeleteBtnClick}>
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>

                                            <IconButton
                                                id="saveBtn"
                                                color="inherit"
                                                aria-label="save"
                                                size="large"
                                                onClick={handleSaveBtnClick}>
                                                <SaveIcon fontSize="inherit" />
                                            </IconButton>

                                            <Button
                                                id='closeBtn'
                                                color="inherit"
                                                variant="text"
                                                onClick={() => setIsNoteOpen(false)}
                                            >Close</Button>
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
                                                                    className={item?.isDone ? "todosIsDone todos" : "todos"}
                                                                    value={item.element}
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
                                    </div>

                                    {notesType === true ? <div id="addTodos" onClick={handleAddToDoBtnClick}>Add ToDos</div> : null}
                                </NotesModal>
                                : null
                        }


                    </div>
            }
        </>
    )
}

export default HomePage;