import React, { useState } from 'react';
import { apiCall } from "../utils";
import "../css/login.css";

function CreateAcc() {
    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [msg, setMsg] = useState("");

    function handleNewUsername(e) {
        setuserName(e.target.value)
    }

    function handleNewPassword(e) {
        setPassword(e.target.value)
    }

    function handleConfirmPassword(e) {
        setConfPassword(e.target.value)
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        if(userName !== "" && password !== "" && confPassword !== "") {
            if(password === confPassword) {
                const apiResp = await apiCall("users", false , "post", { username: userName , password: password});
                setMsg("successfully registered")
            } else {
                setMsg("Passwords didn't match. Try again.")
            }
        } else {
            setMsg("Please enter all data.")
        }
    }

    return (
        <div id="background">
            <div id="wrapper">
                <form id="form" onSubmit={ handleFormSubmit }>
                    <div>
                        <input type="text" placeholder="User Name" id="newUserName" value={ userName } onChange={handleNewUsername} />
                    </div>

                    <div>
                        <input type="Password" placeholder="Password" id="newPassword" value={ password } onChange={handleNewPassword} />
                    </div>

                    <div>
                        <input type="Password" placeholder="Confirm Password" id="confirmPass" value={ confPassword } onChange={handleConfirmPassword} />
                    </div>

                    <hr />

                    <div id="updateMsg" className="red"> {msg} </div>

                    <div>
                        <button id="signup">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateAcc;