import React, { useState, useEffect } from 'react';
import { apiCall, getLoggedUserId } from "../utils";
import Loader from "../components/Loader";
import "../css/notes.css";
import deleteIcon from "../img/delete.png"
import saveIcon from "../img/save.png"
import crossIcon from "../img/cross.png"

let myNotesId;
const myUserId = getLoggedUserId();

function NotesPage() {
    const [isNotesId, setIsNotesId] = useState({ condition: true, errorMsg: "" });

    const [notesType, setNotesType] = useState(0);
    const [notesTitle, setNotesTitle] = useState("");
    const [noteData, setNoteData] = useState([]);
    
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isApiLoading, setIsApiLoading] = useState(false);
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
            if (notes.id === "" || myNotesId === "undefined") {
                setIsNotesId({ condition: false, errorMsg: "Note not found (404)" });
            }
        } catch {
            setIsNotesId({ condition: false, errorMsg: "Note not found (404)" });
        }
        setIsLoading(false);
    }, [])

    useEffect(() => {
        (async function() {
            if (myNotesId && myNotesId !== "undefined") {
                setIsApiLoading(true);
                const apiResp = await apiCall("notes/" + myNotesId)
                if (apiResp.statusCode === 200) {
                    setIsApiLoading(false);
                    
                    setNotesType(apiResp.data?.notesType)
                    setNotesTitle(apiResp.data?.notesTitle);
                    setNoteData(apiResp.data.notes);
                } else {
                    setMsg(apiResp.msg);
                }
            }
        })();
    }, []);

    function handleTitleChange(e) {
        setNotesTitle(e.target.value)
    }

    async function handleSaveBtnClick() {
        setIsApiLoading(true);
        const apiResp = await apiCall("notes?notesId=" + myNotesId, false, "put", { notesTitle, newNotes: noteData });

        if (apiResp.statusCode === 200) {
            setIsApiLoading(false);
            setMsg("Saved");
            console.log("Notes Updated =>", apiResp.msg);
        } else {
            setMsg(apiResp.msg);
        }
    }

    async function handleDeleteBtnClick() {
        setIsApiLoading(true);
        const apiResp = await apiCall("notes?noteId=" + myNotesId, false, "delete");
        if (apiResp.statusCode === 200) {
            setIsApiLoading(false);
            setMsg("Note Deleted");
            window.close();
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
        setNoteData([...noteData, { element: "", isDone: false}]);
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
                            <Loader isLoading={isApiLoading} />
                            
                            <div id="elementBox" className={isNotesId.condition ? null : 'noteIdNotFound'}>
                                {
                                    noteData.map(function (item, index) {
                                        return (
                                            notesType === false ?
                                                <textarea 
                                                    id="notesArea" 
                                                    key={index} 
                                                    onChange={(e) => handleTodoText(index, e)}
                                                    value={item.element} >
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
                                                            className={item?.isDone? "todosIsDone todos" : "todos"}
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
                            {notesType === true ? <div id="addTodos" onClick={handleAddToDoBtnClick}>Add ToDos</div> : null}
                        </div>
                    </>
            }
        </>
    )
}

export default NotesPage;