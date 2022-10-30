import React from 'react';

import "./renderNotes.css"

function RenderNotes({ allNotes, handleNoteOpening }) {

    return (
        <div id="content">
            {
                allNotes.map(function (items) {
                    return (
                        <div className="noteBox" key={items.notesId} onClick={() => handleNoteOpening(items.notesId, items.notesType, items.notesTitle, items.noteData)}>
                            <div className="titleAndType">
                                <div className="noteTitle">{items.notesTitle}</div>
                                <div className="noteType">{items.notesType ? "Todo" : "Note"}</div>
                            </div>
                            <div className="noteContent">
                                {
                                    items.notesType ?
                                        <div>
                                            {
                                                items.noteData.length === 1 && items.noteData[0]?.element === "" ?
                                                    "Empty......." :
                                                    <>
                                                        <div className={items?.noteData[0]?.element ? "todoDisplay" : null}>{items?.noteData[0]?.element}</div><br />
                                                        <div className={items?.noteData[1]?.element ? "todoDisplay" : null}>{items?.noteData[1]?.element}</div><br />
                                                        <div className={items?.noteData[2]?.element ? "todoDisplay" : null}>{items?.noteData[2]?.element}</div>
                                                    </>
                                            }
                                        </div>
                                        : <div>{items.noteData[0].element ? items.noteData[0]?.element : "Empty......."}</div>
                                }

                            </div>
                            <div className="date">
                                <div>{new Date(items.updatedOn)?.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                <div>{new Date(items.updatedOn)?.toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default RenderNotes;