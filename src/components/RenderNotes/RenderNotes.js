import React from 'react';

import "./renderNotes.css"

function RenderNotes({ list, handleNoteOpening }) {

    return (
        <div id="content">
            {
                list.map(function (list) {
                    return (
                        <div className="noteBox" key={list.notesId} onClick={() => handleNoteOpening(list.notesId, list.notesType, list.notesTitle, list.notes)}>
                            <div className="titleAndType">
                                <div className="noteTitle">{list.notesTitle}</div>
                                <div className="noteType">{list.notesType ? "Todo" : "Note"}</div>
                            </div>
                            <div className="noteContent">
                                {
                                    list.notesType ?
                                        <div>
                                            {
                                                list.notes.length === 1 && list.notes[0]?.element === "" ?
                                                    "Empty......." :
                                                    <>
                                                        <div className={list.notes[0]?.element ? "todoDisplay" : null}>{list.notes[0]?.element}</div><br />
                                                        <div className={list.notes[1]?.element ? "todoDisplay" : null}>{list.notes[1]?.element}</div><br />
                                                        <div className={list.notes[2]?.element ? "todoDisplay" : null}>{list.notes[2]?.element}</div>
                                                    </>
                                            }
                                        </div>
                                        : <div>{list.notes[0].element ? list.notes[0].element : "Empty......."}</div>
                                }

                            </div>
                            <div className="date">
                                <div>{new Date(list.updatedOn)?.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                <div>{new Date(list.updatedOn)?.toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default RenderNotes;