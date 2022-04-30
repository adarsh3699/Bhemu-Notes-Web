import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { apiCall } from "../utils";
import "../css/home.css";
import addIcon from "../img/add.png"
import deleteBtn from "../img/delete.png"

function HomePage() {
    const cookies = new Cookies();
    const myUserId = cookies.get('userId');
    const [isActive, setActive] = useState(false);
    const [msg, setMsg] = useState("");
    const [textInput, setTextInput] = useState("");
    const [list, setList] = useState([]);
    const [isNoteAdd, setIsNoteAdd] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    function handleAddBtnClick(e) {
        setActive(!isActive)
    }

    useEffect(function () {
        return async function () {
            if (myUserId) {
                const apiResp = await apiCall("http://localhost:4000/api/notes?userId=" + myUserId);
                if (apiResp.statusCode === 200) {
                    setList(apiResp.data)
                } else {
                    setMsg(apiResp.msg)
                }

            }
        }
    }, [isNoteAdd, isDelete]);

    async function addNotes(type, notesTitle) {
        const apiResp = await apiCall("http://localhost:4000/api/notes?userId="+ myUserId, false, "post", (type === "todo" ? { notesType: 1, notesTitle: "" }: { notesTitle: notesTitle }));
        console.log(apiResp);
        setIsNoteAdd(!isNoteAdd)
    };

    function handelTextInput(e) {
        setTextInput(e.target.value)
    }

    function handelFormSubmit(e) {
        e.preventDefault();
        addNotes("", textInput);
        setTextInput("")
    }

    function handleNoteClick(noteId) {
        const url = window.location.origin + "/notes?id=" + noteId;
        window.open(url, '_blank').focus();
    }

    async function handelDeleteBtnClick(noteId) {
        await apiCall("http://localhost:4000/api/notes/"+ noteId, false, "delete");
        setIsDelete(!isDelete)
    }

    return (
        <>
            <form id="bar" onSubmit={handelFormSubmit}>
                <input type="text" id="inputBox" autoFocus placeholder="Take a note..." value={ textInput } onChange={handelTextInput} />
            </form>
            <div id="addButton" onClick={handleAddBtnClick} >
                <img src={addIcon} height="30px" id="addImg" />
                <div id="option" className={isActive ? 'showOption' : null} onClick={(e)=> e.stopPropagation()} >
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
                                <div id={list.notesId} key={list.notesId} onClick={() => handleNoteClick(list.notesId) }>
                                    {list.notesTitle}  
                                    <img src={ deleteBtn } onClick={(e)=> {e.stopPropagation(); handelDeleteBtnClick(list.notesId)} }  /> 
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </>
    )
}

export default HomePage;