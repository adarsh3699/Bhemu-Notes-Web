import React, { useState, useEffect } from 'react';
import { apiCall, getLoggedUserId, setLoggedUserId } from "../utils";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import "../css/homePage.css";
import "../css/notes.css"

import logo from "../img/logo.jpeg"
import deleteIcon from "../img/delete.png"
import saveIcon from "../img/save.png"
import crossIcon from "../img/cross.png"


const myUserId = getLoggedUserId();

function HomePage() {
    const [isActive, setActive] = useState(false);
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

    async function addNotes(type, notesTitle) {
        setIsApiLoading(true);
        const apiResp = await apiCall("notes?userId=" + myUserId, "post", ({ notesType: type, notesTitle: notesTitle }));
        if (apiResp.statusCode === 200) {
            setFlag(!flag)
            console.log("Notes Added");
            handleNoteClick(apiResp?.notesId, type, notesTitle, [{}])
        } else {
            setMsg(apiResp.msg)
        }
    };

    function handleFormSubmit(e) {
        e.preventDefault();
        const textInput = e.target.searchBox.value
        addNotes(false, textInput);
        e.target.reset()
    }

    function handleNoteClick(noteId, type, title, Data) {
        setMyNotesId(noteId)
        setNotesType(type)
        setNotesTitle(title)
        setNoteData(Data)
        setIsNoteOpen(true);
    }

    function handleLogoutBtnClick() {
        setLoggedUserId("");
        document.location.href = "/";
    }


    function handleTitleChange(e) {
        setNotesTitle(e.target.value)
    }

    async function handleSaveBtnClick() {
        setIsApiLoading(true);
        const apiResp = await apiCall("notes?notesId=" + myNotesId, "put", { notesTitle, newNotes: noteData });

        if (apiResp.statusCode === 200) {
            setFlag(!flag)
            setIsApiLoading(false);
            setMsg("Saved");
            console.log("Notes Updated =>", apiResp.msg);
        } else {
            setMsg(apiResp.msg);
        }
    }

    async function handleDeleteBtnClick() {
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
    }


    //for todos
    function handleCheckboxClick(index, isDone) {
        const newToDos = noteData.map(function (toDo, i) {
            return (i === index ? { ...toDo, isDone: isDone ? false : true } : toDo)
        })
        setNoteData(newToDos);
    }

    function handleTodoText(index, e) {
        const newToDos = noteData.map(function (toDo, i) {
            return (i === index ? { ...toDo, element: e.target.value } : toDo)
        })

        setNoteData(newToDos);
    }

    function handleDeleteToDoBtnClick(index) {
        let newToDos = noteData.filter((data, i) => {
            return (i !== index) ? data : null
        });

        setNoteData(newToDos);
    }

    function handleAddToDoBtnClick() {
        setNoteData([...noteData, { element: "", isDone: false }]);
    }



    return (
        <>
            {
                isLoading ? null
                    :
                    <div id='homePage'>
                        <div className="navbar">
                            <div id="logo">
                                <img src={logo} alt="" onClick={handleLogoutBtnClick} />
                                <div id="name">Bhemu Notes</div>
                            </div>
                            <form onSubmit={handleFormSubmit}>
                                <input type="text" id="searchBox" name='searchBox' placeholder="Add Notes" />
                            </form>
                            <div className="addNoteBtn" onClick={() => setActive(!isActive)}>Add Note</div>
                        </div>

                        {
                            isActive ?
                                <div id="option" className={isActive ? 'showOption' : null} onClick={(e) => e.stopPropagation()} >
                                    <div onClick={() => addNotes(false, "Enter Notes Title")}>Note</div>
                                    <div onClick={() => addNotes(true, "Enter Notes Title")}>ToDos</div>
                                </div>
                                :
                                null
                        }

                        <div id="msg" >{msg}</div>
                        <Loader isLoading={isApiLoading} />
                        <div id="content">

                            {
                                list.map(function (list) {
                                    return (
                                        <div className="noteBox" key={list.notesId} onClick={() => handleNoteClick(list.notesId, list.notesType, list.notesTitle, list.notes)}>
                                            <div className="titleAndType">
                                                <div className="noteTitle">{list.notesTitle}</div>
                                                <div className="noteType">{list.notesType ? "Todo" : "Note"}</div>
                                            </div>
                                            <div className="noteContent">
                                                {
                                                    list.notesType ?
                                                        <div>
                                                            <div className={list.notes[0]?.element ? "todoDisplay" : null}>{list.notes[0]?.element}</div><br />
                                                            <div className={list.notes[1]?.element ? "todoDisplay" : null}>{list.notes[1]?.element}</div><br />
                                                            <div className={list.notes[2]?.element ? "todoDisplay" : null}>{list.notes[2]?.element}</div>
                                                        </div>
                                                        : <div>{list.notes[0].element ? list.notes[0].element : "Empty......."}</div>
                                                }

                                            </div>
                                            <div className="date">
                                                <div>{new Date(list.insertedOn)?.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                                <div>{new Date(list.insertedOn)?.toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {
                            isNoteOpen ?
                                <Modal
                                    open={isNoteOpen}
                                    closeOnOutsideClick={() => setIsNoteOpen(false)}
                                    handleModalClose={() => setIsNoteOpen(false)}
                                >
                                    <div id="notesModelBar">
                                        <input type="text" id="title" value={notesTitle} onChange={handleTitleChange} />
                                        <div id="barImg">
                                            {/* <img src={deleteIcon} id="delete" onClick={handleDeleteBtnClick} />
                                            <img src={saveIcon} id="saveIcon" onClick={handleSaveBtnClick} /> */}

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
                                                    notesType === false ?
                                                        <textarea
                                                            id="notesArea"
                                                            key={index}
                                                            value={item.element}
                                                            onChange={(e) => handleTodoText(index, e)}
                                                        >
                                                        </textarea>
                                                        :
                                                        notesType === true ?
                                                            <div className="toDosBox" key={index} >

                                                                <input
                                                                    type="checkbox"
                                                                    checked={item?.isDone}
                                                                    onChange={() => handleCheckboxClick(index, item.isDone)}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    id={index}
                                                                    className={item?.isDone ? "todosIsDone todos" : "todos"}
                                                                    value={item.element}
                                                                    onChange={(e) => handleTodoText(index, e)}
                                                                />
                                                                <IconButton sx={{ color: "#F1F1F1" }} aria-label="delete" onClick={() => handleDeleteToDoBtnClick(index)} size="large">
                                                                    <CloseIcon fontSize="inherit" />
                                                                </IconButton>
                                                            </div>
                                                            : null

                                                )
                                            })
                                        }
                                    </div>

                                    {notesType === true ? <div id="addTodos" onClick={handleAddToDoBtnClick}>Add ToDos</div> : null}
                                </Modal>
                                : null
                        }


                    </div>
            }
        </>
    )
}

export default HomePage;