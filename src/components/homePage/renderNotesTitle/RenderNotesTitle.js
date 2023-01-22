import React from 'react';
import Loader from '../../Loader';

import homePageSkeleton from '../../../img/homePageSkeleton.svg';

import './renderNotesTitle.css';

function RenderNotesTitle({ allNotes, handleNoteOpening, isApiLoading }) {
    return (
        <>
            <div id="addNotesInputBox">
                <input id="addNotesInput" type="text" placeholder="Take a note..." />
            </div>
            <div id="renderNotes">
                <Loader isLoading={isApiLoading} />
                {allNotes.length === 0 && !isApiLoading && (
                    <div id="homePageSkeleton">
                        <img src={homePageSkeleton} id="homePageSkeletonImg" alt="" />
                        <div id="homePageSkeletonText">Create your first note !</div>
                    </div>
                )}
                {allNotes.map(function (items) {
                    return (
                        <div
                            className="noteBox"
                            key={items.notesId}
                            onClick={() => handleNoteOpening(items.notesId, items.notesTitle, items.noteData)}
                        >
                            <div className="noteTitle">{items.notesTitle}</div>
                            <div className="noteContent">
                                <div>
                                    {items.noteData.length <= 2 && items.noteData[0]?.element === '' ? (
                                        'Empty.......'
                                    ) : (
                                        <>
                                            <div className={items?.type === 'todo' ? 'todoDisplay' : 'noteDisplay'}>
                                                {items?.noteData[0]?.element}
                                            </div>

                                            <div className={items?.noteData[1]?.element ? 'todoDisplay' : null}>
                                                {items?.noteData[1]?.element}
                                            </div>
                                        </>
                                    )}
                                </div>
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

export default RenderNotesTitle;
