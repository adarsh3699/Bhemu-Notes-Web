import React, { useState, useEffect } from 'react';
import { apiCall, getLoggedUserId } from "../utils";
import "../css/home.css";
import addIcon from "../img/add.png"
import deleteBtn from "../img/delete.png"

const myUserId = getLoggedUserId();
function HomePage() {
    const [isActive, setActive] = useState(false);
    const [msg, setMsg] = useState("");
    const [textInput, setTextInput] = useState("");
    const [list, setList] = useState([]);
    const [flag, setFlag] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!myUserId) {
            document.location.href = "/";
            return;
        } else {
            setIsLoading(false);
        }
    }, []);

    function handleAddBtnClick(e) {
        setActive(!isActive)
    }

    useEffect(function () {
        return async function () {
            if (myUserId) {
                const apiResp = await apiCall("notes?userId=" + myUserId);
                if (apiResp.statusCode === 200) {
                    setList(apiResp.data)
                } else {
                    setMsg(apiResp.msg)
                }
            }
        }
    }, [flag]);

    async function addNotes(type, notesTitle) {
        const apiResp = await apiCall("notes?userId=" + myUserId, false, "post", (type === "todo" ? { notesType: 1, notesTitle: "" } : { notesTitle: notesTitle }));

        if (apiResp.statusCode === 200) {
            setFlag(!flag)
            console.log("Notes Added");
            handleNoteClick(apiResp.noteId)
        } else {
            setMsg(apiResp.msg)
        }
    };

    function handleTextInput(e) {
        setTextInput(e.target.value)
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        addNotes("", textInput);
        setTextInput("")
    }

    function handleNoteClick(noteId) {
        window.open("/notes?id=" + noteId, '_blank').focus();
    }

    async function handleDeleteBtnClick(noteId) {
        const apiResp = await apiCall("notes/" + noteId, false, "delete");
        if (apiResp.statusCode === 200) {
            setFlag(!flag)
        } else {
            setMsg(apiResp.msg)
        }
    }

    return (
        <>
            {
                isLoading ? null
                    :
                    <>
                        <form id="bar" onSubmit={handleFormSubmit}>
                            <input type="text" id="inputBox" autoFocus placeholder="Take a note..." value={textInput} onChange={handleTextInput} />
                        </form>

                        <div id="addButton" onClick={handleAddBtnClick} >
                            <img src={addIcon} height="30px" id="addImg" />
                            <div id="option" className={isActive ? 'showOption' : null} onClick={(e) => e.stopPropagation()} >
                                <div id="addNotes" onClick={addNotes}>Note</div>
                                <div id="addTodos" onClick={() => addNotes('todo')}>ToDos</div>
                            </div>
                        </div>

                        <div id="background">
                            <div id="msg">{msg}</div>
                            <div id="list">
                                {
                                    list.map(function (list) {
                                        return (
                                            <div id={list.notesId} key={list.notesId} onClick={() => handleNoteClick(list.notesId)}>
                                                {list.notesTitle}
                                                <img src={deleteBtn} onClick={(e) => { e.stopPropagation(); handleDeleteBtnClick(list.notesId) }} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </>
            }
        </>
    )
}

export default HomePage;