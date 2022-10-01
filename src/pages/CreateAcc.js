import React, { useState } from 'react';
import { apiCall } from "../utils";
import Loader from "../components/Loader";

import "../css/loginPage.css";

document.title = "Bhemu Notes | Create Your Account";

function CreateAcc() {
    const [msg, setMsg] = useState("");
    const [isApiLoading, setIsApiLoading] = useState(false);

    async function handleFormSubmit(e) {
        e.preventDefault();
        const { fName, lName, email, password, confPassword } = e.target;

        const userData = {
            firstName: fName.value,
            lastName: lName.value,
            email: email.value,
            password: password.value,
            confirmPassword: confPassword.value
        }

        if (userData.email !== "" && userData.password !== "" && userData.confirmPassword !== "") {
            if (userData.password === userData.confirmPassword) {
                setIsApiLoading(true);

                const apiResp = await apiCall("users/signup", "post", userData);
                if (apiResp.statusCode === 200) {
                    setMsg(apiResp.msg)
                    document.location.href = "/";
                } else {
                    setMsg(apiResp.msg)
                }
                setIsApiLoading(false);
            } else {
                setMsg("Passwords didn't match.")
            }
        } else {
            setMsg("Please enter all data.")
        }
    }

    return (
        <div id="background">
            <div id="wrapper">
                <div id='Title'>Create Your Account</div>

                <form className="form" onSubmit={handleFormSubmit}>
                    <input type="tet" name='fName' placeholder="First Name" className='inputBottomMargin' />

                    <input type="tet" name='lName' placeholder="Last Name" className='inputBottomMargin' />

                    <input type="email" name='email' placeholder="Email" className='inputBottomMargin' />

                    <input type="Password" name='password' placeholder="Password (8 digit)" pattern="().{8,}" className='inputBottomMargin' />

                    <input type="Password" name='confPassword' placeholder="Confirm Password (8 digit)" pattern="().{8,}" className='inputBottomMargin' />

                    <button id="signup" className={isApiLoading ? "isSignup" : ""} >Sign Up</button>
                    <div id="updateMsg" className="red" style={isApiLoading ? { marginBottom: "0px" } : {}}> {msg} </div>
                </form>

                <Loader isLoading={isApiLoading} />
                <hr />

                <div id='alreadyAcc' style={isApiLoading ? null : { margin: "25px 0px 5px 0px" }} >
                    <a href="/" >Already have an Account</a>
                </div>
            </div>
        </div>
    )
}

export default CreateAcc;