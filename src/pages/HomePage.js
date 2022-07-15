import React, { useState, useEffect } from 'react';
import { apiCall, getLoggedUserId, setLoggedUserId } from "../utils";
import Loader from "../components/Loader";

import "../css/home.css";

import logo from "../img/logo.jpeg"

const myUserId = getLoggedUserId();

function HomePage() {
    const [isActive, setActive] = useState(false);
    const [msg, setMsg] = useState("");
    const [list, setList] = useState([]);
    const [flag, setFlag] = useState(false);

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
        const apiResp = await apiCall("notes?userId=" + myUserId, "post", (type === "todo" ? { notesType: true } : { notesTitle: notesTitle }));
        if (apiResp.statusCode === 200) {
            setFlag(!flag)
            console.log("Notes Added");
            handleNoteClick(apiResp.notesId)
        } else {
            setMsg(apiResp.msg)
        }
    };

    function handleFormSubmit(e) {
        e.preventDefault();
        console.log(e.target.searchBox.value);
        const textInput = e.target.searchBox.value
        addNotes("", textInput);
        e.target.reset()
    }

    function handleNoteClick(noteId) {
        window.open("/notes?id=" + noteId, '_blank').focus();
    }

    function handleLogoutBtnClick() {
        setLoggedUserId("");
        document.location.href = "/";
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
                            <form id="bar" onSubmit={handleFormSubmit}>
                                <input type="text" id="searchBox" name='searchBox' placeholder="Add Notes" />
                            </form>
                            <div className="addNoteBtn" onClick={() => setActive(!isActive)}>Add Note</div>
                        </div>

                        {
                            isActive ?
                                <div id="option" className={isActive ? 'showOption' : null} onClick={(e) => e.stopPropagation()} >
                                    <div id="addNotes" onClick={addNotes}>Note</div>
                                    <div id="addTodos" onClick={() => addNotes('todo')}>ToDos</div>
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
                                        <div className="noteBox" key={list.notesId} onClick={() => handleNoteClick(list.notesId)}>
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
                                                <div>{new Date(list.insertedOn)?.toLocaleDateString(undefined, {day: '2-digit', month: 'long', year: 'numeric'})}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>


                    </div>
            }
        </>
    )
}

export default HomePage;