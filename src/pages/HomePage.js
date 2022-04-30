import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { apiCall } from "../utils";
import "../css/home.css";
import addIcon from "../img/add.png"

function HomePage() {  
    const cookies = new Cookies();
    const myUserId = cookies.get('userId');
    const [isActive, setActive] = useState(false);
    const [msg, setMsg] = useState("");

    function handleAddBtnClick(e) {
        setActive(!isActive)
    }

     useEffect(function() {
        return async function () {
            if (myUserId){
                const apiResp =  await apiCall("http://localhost:4000/api/notes?userId="+ myUserId);
                if (apiResp.statusCode === 200) {
                    for (let i = 0; i < apiResp.data.length; i++) {
                        console.log(apiResp.data[i]);
                    }
                    
                } else {
                    setMsg(apiResp.msg)
                }

            }
        }
    }, [isActive]);

    return (
        <>
            <div id="bar">
                <input type="text" id="inputBox" autoFocus placeholder="Take a note..." />
            </div>
            <div id="addButton" onClick={ handleAddBtnClick } >
                <img src={ addIcon } height="30px" id="addImg" />
                    <div id="option" className={isActive ? 'showOption': null}  >
                        <div id="addNotes" >Note</div>
                        <div id="addTodos" >ToDos</div>
                    </div>
            </div>

            <div id="background">
                <div id="msg">{ msg }</div>
                <div id="list"> </div>
            </div>
        </>
    )
}

export default HomePage;