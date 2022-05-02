import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { apiCall } from "../utils";
import "../css/notes.css";
import deleteIcon from "../img/delete.png"
import saveIcon from "../img/save.png"
import crossIcon from "../img/cross.png"
const cookies = new Cookies();
let myNotesId;

function NotesPage() {
    const myUserId = cookies.get('userId');

    const [isNotesId, setIsNotesId] = useState({ condition: true, errorMsg: "" });
    // const [flag, setFlag] = useState(false);
    const [noteData, setNoteData] = useState([]);
    const [notesTitle, setNotesTitle] = useState("");
    const [notesText, setNotesText] = useState("");
    const [msg, setMsg] = useState("");


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
            // setMyNotesId(notes.id);
            myNotesId = notes.id;
            if (notes.id === "") {
                setIsNotesId({ condition: false, errorMsg: "Note not found (404)" });
            }
        } catch {
            setIsNotesId({ condition: false, errorMsg: "Note not found (404)" });
        }
    }, [])

    useEffect(function getApiCaller() {
        return async function () {
            if (myNotesId) {
                const apiResp = await apiCall("http://localhost:4000/api/notesElement?notesId=" + myNotesId)
                if (apiResp.statusCode === 200) {
                    setNoteData(apiResp.data)
                    setNotesTitle(apiResp.data[0].notesTitle);
                    if (apiResp.data[0].notesType === 0) {
                        setNotesText(apiResp.data[0].element);
                    }
                } else {
                    setMsg(apiResp.msg);
                }
            }
        }
    }, []);

    function handelTitleChange(e) {
        setNotesTitle(e.target.value)
    }

    function handelNotesTextChange(e) {
        setNotesText(e.target.value)
    }

    async function handleSaveBtnClick() {
        if (noteData[0].notesTitle !== notesTitle) {
            //if only note title changes
            const apiResp = await apiCall("http://localhost:4000/api/notes?notesId=" + myNotesId, false, "put", { notesTitle: notesTitle });
            if (apiResp.statusCode === 200) {
                setMsg("Saved");
                console.log("Title Updated =>", apiResp.msg);
            } else {
                setMsg(apiResp.msg);
            }
        }

        if (noteData[0].notesType === 1) {
            const apiResp = await apiCall("http://localhost:4000/api/notesElement/save?notesId=" + myNotesId, false, "post", { element: noteData });
            if (apiResp.statusCode === 200) {
                setMsg("Saved");
                console.log("Todos Updated =>", apiResp.msg);
            } else {
                setMsg(apiResp.msg);
            }

        } else if (noteData[0].notesType === 0) {
            if (noteData[0].element !== notesText) {
                const apiResp = await apiCall("http://localhost:4000/api/notesElement?notesId=" + myNotesId, false, "put", { element: notesText });
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
        const apiResp = await apiCall("http://localhost:4000/api/notes/" + myNotesId, false, "delete");
        if (apiResp.statusCode === 200) {
            setMsg("Note Deleted");
            window.close();
        } else {
            setMsg(apiResp.msg);
        }
    }

    //for todos
    function handelTodoText(index, e) {
        const newToDos = noteData.map(function (toDo, i) {
            return (i === index ? { ...toDo, element: e.target.value } : toDo)
        })

        setNoteData(newToDos);
    }

    function handleAddToDoBtnClick() {
        const newNoteData = noteData.push({ element: "", isDone: 0 });
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

        let newToDos = [...noteData];
        newToDos.splice(index, 1);
        
        setNoteData(newToDos);
    }

    return (
        <>
            <div id="bar" className={isNotesId.condition ? null : 'noteIdNotFound'}>
                <input type="text" id="title" value={notesTitle} onChange={handelTitleChange} />
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
                        noteData.map(function (list, index) {
                            return (

                                list.notesType === 0 ?
                                    <textarea id="notesArea" key={index} role="textbox" onChange={handelNotesTextChange} value={notesText} ></textarea>
                                    :
                                    list.notesType === 1 ?
                                        <div className="toDosBox" key={index} >

                                            <input type="checkbox" checked={list?.isDone === 1 ? true : false} onChange={() => handleCheckboxClick(index, list.isDone)} />
                                            <input type="text" id={index} className={list?.isDone === 1 ? "todosIsDone todos" : "todos"} value={list.element} onChange={(e) => handelTodoText(index, e)} />
                                            <img src={crossIcon} onClick={() => handleDeleteToDoBtnClick(index)} />

                                        </div>
                                        : null

                            )
                        })
                    }
                </div>
                {noteData[0]?.notesType === 1 ? <div id="addTodos" onClick={handleAddToDoBtnClick}>Add ToDos</div> : null}
            </div>
        </>
    )
}

export default NotesPage;