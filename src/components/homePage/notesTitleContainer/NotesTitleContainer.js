import React from 'react';

import './notesTitleContainer.css';

function NotesTitleContainer({ allNotes, handleNoteOpening }) {
    return (
        <>
            <div id="addNotesInputBox">
                <input id="addNotesInput" type="text" placeholder="Take a note..." />
            </div>
            <div id="renderNotes">
                {allNotes.map(function (items, index) {
                    return (
                        <div
                            className="noteBox"
                            key={items.notesId}
                            onClick={() =>
                                handleNoteOpening(items.notesId, items.noteType, items.notesTitle, items.noteData)
                            }
                        >
                            <div className="titleAndType">
                                <div className="noteTitle">{items.notesTitle}</div>
                                <div className="noteType">{items.noteType}</div>
                            </div>
                            <div className="noteContent">
                                {items.noteType === 'todo' ? (
                                    <div>
                                        {items.noteData.length <= 2 && items.noteData[0]?.element === '' ? (
                                            'Empty.......'
                                        ) : (
                                            <>
                                                <div className={items?.noteData[0]?.element ? 'todoDisplay' : null}>
                                                    {items?.noteData[0]?.element}
                                                </div>
                                                {/* <br /> */}
                                                <div className={items?.noteData[1]?.element ? 'todoDisplay' : null}>
                                                    {items?.noteData[1]?.element}
                                                </div>
                                                {/* <br /> */}
                                                <div className={items?.noteData[2]?.element ? 'todoDisplay' : null}>
                                                    {items?.noteData[2]?.element}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : items.noteData[0].element ? (
                                    items.noteData[0]?.element
                                ) : (
                                    'Empty.......'
                                )}
                            </div>
                            <div className="date">
                                <div>
                                    {new Date(items.updatedOn?.toDate())?.toLocaleString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}
                                </div>
                                <div>
                                    {new Date(items.updatedOn?.toDate())?.toLocaleDateString(undefined, {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default NotesTitleContainer;
