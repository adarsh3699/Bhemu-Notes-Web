import React, { useState, useEffect } from 'react';
import { apiCall, getLoggedUserId } from "../utils";
import "../css/notes.css";
import deleteIcon from "../img/delete.png"
import saveIcon from "../img/save.png"
import crossIcon from "../img/cross.png"

let myNotesId;
const myUserId = getLoggedUserId();

function NotesPage() {
    const [isNotesId, setIsNotesId] = useState({ condition: true, errorMsg: "" });
    // const [flag, setFlag] = useState(false);
    const [noteData, setNoteData] = useState([]);
    const [intialNotesTitle, setIntialNotesTitle] = useState("");
    const [notesTitle, setNotesTitle] = useState("");
    const [notesType, setNotesType] = useState(0);
    const [notesText, setNotesText] = useState("");
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(function getDataFromUrl() {
        if (!myUserId) {
            document.location.href = "/";
            return;
        }

        try {
            var url = document.location.href,
                params = url.split('?')[1].split('&'),
                notes = {}, tmp;
            for (var i = 0, l = params.length; i < l; i++) {
                tmp = params[i].split('=');
                notes[tmp[0]] = tmp[1];
            }

            myNotesId = notes.id;
            if (notes.id === "") {
                setIsNotesId({ condition: false, errorMsg: "Note not found (404)" });
            }
        } catch {
            setIsNotesId({ condition: false, errorMsg: "Note not found (404)" });
        }
        setIsLoading(false);
    }, [])

    useEffect(function getApiCaller() {
        return async function () {
            if (myNotesId) {
                const apiResp = await apiCall("notesElement?notesId=" + myNotesId)
                if (apiResp.statusCode === 200) {
                    setNoteData(apiResp.data);
                    setIntialNotesTitle(apiResp.data?.[0]?.notesTitle);
                    setNotesTitle(apiResp.data?.[0]?.notesTitle);
                    setNotesType(apiResp.data?.[0]?.notesType)
                    if (apiResp.data?.[0]?.notesType === 0) {
                        setNotesText(apiResp.data[0].element);
                    }
                } else {
                    setMsg(apiResp.msg);
                }
            }
        }
    }, []);

    function handleTitleChange(e) {
        setNotesTitle(e.target.value)
    }

    function handleNotesTextChange(e) {
        setNotesText(e.target.value)
    }

    async function handleSaveBtnClick() {
        if (intialNotesTitle !== notesTitle) {
            //if only note title changes
            const apiResp = await apiCall("notes?notesId=" + myNotesId, false, "put", { notesTitle: notesTitle });
            if (apiResp.statusCode === 200) {
                setMsg("Saved");
                console.log("Title Updated =>", apiResp.msg);
            } else {
                setMsg(apiResp.msg);
            }
        }

        if (notesType === 1) {
            const apiResp = await apiCall("notesElement/save?notesId=" + myNotesId, false, "post", { element: noteData });
            if (apiResp.statusCode === 200) {
                setMsg("Saved");
                console.log("Todos Updated =>", apiResp.msg);
            } else {
                setMsg(apiResp.msg);
            }

        } else if (notesType === 0) {
            if (noteData[0].element !== notesText) {
                const apiResp = await apiCall("notesElement?notesId=" + myNotesId, false, "put", { element: notesText });
                if (apiResp.statusCode === 200) {
                    setMsg("Saved");
                    console.log("Notes Text Updated =>", apiResp.msg);
                } else {
                    setMsg(apiResp.msg);
                }
            }
        }
    }

    async function handleDeleteBtnClick() {
        const apiResp = await apiCall("notes/" + myNotesId, false, "delete");
        if (apiResp.statusCode === 200) {
            setMsg("Note Deleted");
            window.close();
        } else {
            setMsg(apiResp.msg);
        }
    }

    //for todos
    function handleTodoText(index, e) {
        const newToDos = noteData.map(function (toDo, i) {
            return (i === index ? { ...toDo, element: e.target.value } : toDo)
        })

        setNoteData(newToDos);
    }

    function handleAddToDoBtnClick() {
        setNoteData([...noteData, { element: "", isDone: 0, notesType: 1 }]);
        console.log(noteData);
    }

    function handleCheckboxClick(index, isDone) {
        const newToDos = noteData.map(function (toDo, i) {
            return (i === index ? { ...toDo, isDone: isDone === 1 ? 0 : 1 } : toDo)
        })
        setNoteData(newToDos);
    }

    function handleDeleteToDoBtnClick(index) {
        let newToDos = noteData.filter((data, i) => {
            return (i !== index) ? data : null
        });

        setNoteData(newToDos);
    }

    return (
        <>
            {
                isLoading ? null :
                    <>
                        <div id="bar" className={isNotesId.condition ? null : 'noteIdNotFound'}>
                            <input type="text" id="title" value={notesTitle} onChange={handleTitleChange} />
                            <div id="barImg">
                                <img src={deleteIcon} id="delete" onClick={handleDeleteBtnClick} />
                                <img src={saveIcon} id={saveIcon} onClick={handleSaveBtnClick} />
                            </div>
                        </div>

                        <div id="background">
                            <div id="error">{isNotesId.errorMsg}</div>
                            <div id="msg">{msg}</div>
                            <div id="elementBox" className={isNotesId.condition ? null : 'noteIdNotFound'}>

                                {
                                    noteData.map(function (item, index) {
                                        return (
                                            item.notesType === 0 ?
                                                <textarea id="notesArea" key={index} role="textbox" onChange={handleNotesTextChange} value={notesText} ></textarea>
                                                :
                                                item.notesType === 1 ?
                                                    <div className="toDosBox" key={index} >

                                                        <input
                                                            type="checkbox"
                                                            checked={item?.isDone === 1 ? true : false}
                                                            onChange={() => handleCheckboxClick(index, item.isDone)}
                                                        />
                                                        <input
                                                            type="text"
                                                            id={index}
                                                            className={item?.isDone === 1 ? "todosIsDone todos" : "todos"}
                                                            value={item.element}
                                                            onChange={(e) => handleTodoText(index, e)}
                                                        />
                                                        <img src={crossIcon} onClick={() => handleDeleteToDoBtnClick(index)} />

                                                    </div>
                                                    : null

                                        )
                                    })
                                }
                            </div>
                            {notesType === 1 ? <div id="addTodos" onClick={handleAddToDoBtnClick}>Add ToDos</div> : null}
                        </div>
                    </>
            }
        </>
    )
}

export default NotesPage;