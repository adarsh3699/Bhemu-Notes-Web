import React from 'react';

function createAcc() {
    return (
        <>
            <div id="background">
                <div id="wrapper">
                    <div id="form">
                        <div>
                            <input type="text" placeholder="User Name" id="newUserName" />
                        </div>

                        <div>
                            <input type="Password" placeholder="Password" id="newPassword" />
                        </div>

                        <div>
                            <input type="Password" placeholder="Confirm Password" id="confirmPass" />
                        </div>

                        <hr />

                        <div id="updateMsg" className="red"></div>

                        <div>
                            <button id="signup">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default createAcc;