import React, { useState, useEffect, useCallback } from 'react';

import { handleUserState } from '../firebase/auth';
import { getRealTimeData, addNewNote, deleteData, updateDocument } from '../firebase/notes';

import Loader from '../components/Loader';
import NotesModal from '../components/homePage/notesModal/NotesModal';
import NavBar from '../components/homePage/navBar/NavBar';
import RenderNotes from '../components/homePage/renderNotes/RenderNotes';
import ConfirmationDialog from '../components/confirmationDialog/ConfirmationDialogBox';

import homePageSkeleton from '../img/homePageSkeleton.svg';

import Hotkeys from 'react-hot-keys';

import '../styles/homePage.css';

function HomePage() {
    const [msg, setMsg] = useState('');
    const [allNotes, setAllNotes] = useState([]);

    const [myNotesId, setMyNotesId] = useState('');
    const [notesType, setNotesType] = useState(0);
    const [notesTitle, setNotesTitle] = useState('');
    const [openedNoteData, setOpenedNoteData] = useState([]);

    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false);
    const [isApiLoading, setIsApiLoading] = useState(false);

    useEffect(() => {
        handleUserState('homePage');
        if (JSON.parse(localStorage.getItem('user_details'))) {
            getRealTimeData(setAllNotes, setIsApiLoading, setMsg);
            setIsLoading(false);
        } else {
            document.title = 'Bhemu Notes';
        }
    }, []);

    useEffect(function () {
        document.addEventListener(
            'keydown',
            (e) => {
                if (e.key === 's' && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
                    e.preventDefault();
                }
            },
            true
        );

        // //component did un-mount
        return function () {
            document.removeEventListener(
                'keydown',
                (e) => {
                    if (e.key === 's' && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
                        e.preventDefault();
                    }
                },
                true
            );
        };
    }, []);

    const handleNoteOpening = useCallback(
        (noteId, type, title, data) => {
            setMyNotesId(noteId);
            setNotesType(type);
            setNotesTitle(title);
            setOpenedNoteData(data);
            setIsNotesModalOpen(true);
        },
        [setMyNotesId, setNotesType, setNotesTitle, setOpenedNoteData, setIsNotesModalOpen]
    );

    //add Note Function
    const addNotes = useCallback(
        (newNoteType, notesTitle) => {
            setIsApiLoading(true);
            const newNotesTitle = notesTitle ? notesTitle : 'Enter Notes Title';
            const newNoteData = [{ element: '', isDone: false }];

            const toSendNoteData = { newNotesTitle, newNoteType, newNoteData };

            addNewNote(toSendNoteData, handleNoteOpening, setMsg, setIsApiLoading, NotesModal);
        },
        [handleNoteOpening]
    );

    //add Note from inputBox Function
    const handleAddNotesInputbox = useCallback(
        (e) => {
            e.preventDefault();
            const textInput = e.target.searchBox.value;
            addNotes('note', textInput);
            e.target.reset();
        },
        [addNotes]
    );

    // handle note or todo title change
    const handleTitleChange = useCallback(
        (e) => {
            setNotesTitle(e.target.value);
        },
        [setNotesTitle]
    );

    //handle note or todo save
    const handleSaveBtnClick = useCallback(async () => {
        setIsSaveBtnLoading(true);
        const toSendData = { noteId: myNotesId, notesTitle, noteData: openedNoteData };
        updateDocument(toSendData, setIsSaveBtnLoading, setIsNotesModalOpen);
    }, [myNotesId, openedNoteData, notesTitle]);

    //handle note or todo delete
    const handleDeleteBtnClick = useCallback(async () => {
        setIsApiLoading(true);
        setIsNotesModalOpen(false);
        setIsConfirmationDialogOpen(false);

        deleteData(myNotesId, setIsApiLoading, setMsg);
    }, [myNotesId]);

    //handle todo checkbo click
    const handleCheckboxClick = useCallback(
        (index, isDone) => {
            const newToDos = openedNoteData.map(function (toDo, i) {
                return i === index ? { ...toDo, isDone: isDone ? false : true } : toDo;
            });
            setOpenedNoteData(newToDos);
        },
        [openedNoteData]
    );

    const handleTextChange = useCallback(
        (index, e) => {
            const newToDos = openedNoteData.map(function (toDo, i) {
                return i === index ? { ...toDo, element: e.target.value } : toDo;
            });

            setOpenedNoteData(newToDos);
        },
        [openedNoteData]
    );

    const handleEnterClick = useCallback(
        (index) => {
            const tempData = [...openedNoteData];
            tempData.splice(index + 1, 0, { element: '', isDone: false });
            setOpenedNoteData(tempData);
            if (openedNoteData.length - 1 !== index) {
                document.getElementById(index + 1).focus();
            }
        },
        [openedNoteData]
    );

    const handleDeleteToDoBtnClick = useCallback(
        (index) => {
            let newToDos = openedNoteData.filter((data, i) => {
                return i !== index ? data : null;
            });

            setOpenedNoteData(newToDos);
        },
        [openedNoteData]
    );

    const handleAddToDoBtnClick = useCallback(() => {
        setOpenedNoteData([...openedNoteData, { element: '', isDone: false }]);
    }, [openedNoteData]);

    //function to handle when "ctrl + s" is pressed
    const handleShortcutKeyPress = useCallback(() => {
        if (isNotesModalOpen) {
            handleSaveBtnClick();
        }
    }, [handleSaveBtnClick, isNotesModalOpen]);

    const handleNotesModalClosing = useCallback(() => {
        setIsNotesModalOpen(false);
    }, []);

    return (
        <>
            {!isLoading && (
                <>
                    <Hotkeys
                        keyName="ctrl+s,control+s,⌘+s,ctrl+⇪+s,control+⇪+s,⌘+⇪+s"
                        onKeyDown={handleShortcutKeyPress}
                        // onKeyUp={onKeyUp}
                        filter={(event) => {
                            return true; //to enable shortcut key inside input, textarea and select too
                        }}
                    />
                    {isConfirmationDialogOpen && (
                        <ConfirmationDialog
                            title="Are You Sure?"
                            message="You can't undo this action."
                            isOpen={isConfirmationDialogOpen}
                            onCancel={() => setIsConfirmationDialogOpen(false)}
                            onYesClick={handleDeleteBtnClick}
                        />
                    )}

                    <div id="homePage">
                        <NavBar handleAddNotesInputbox={handleAddNotesInputbox} addNotes={addNotes} />

                        <div id="msg">{msg}</div>
                        <Loader isLoading={isApiLoading} />

                        {allNotes.length === 0 ? (
                            <div id="homePageSkeleton">
                                <img src={homePageSkeleton} id="homePageSkeletonImg" alt="" />
                                <div id="homePageSkeletonText">Create your first note !</div>
                            </div>
                        ) : (
                            <RenderNotes allNotes={allNotes} handleNoteOpening={handleNoteOpening} />
                        )}

                        {isNotesModalOpen && (
                            <NotesModal
                                open={isNotesModalOpen}
                                isSaveBtnLoading={isSaveBtnLoading}
                                closeOnOutsideClick={handleNotesModalClosing}
                                handleModalClose={handleNotesModalClosing}
                                toggleConfirmationDialogClosing={() => setIsConfirmationDialogOpen(true)}
                                notesTitle={notesTitle}
                                handleTitleChange={handleTitleChange}
                                handleDeleteBtnClick={handleDeleteBtnClick}
                                handleSaveBtnClick={handleSaveBtnClick}
                                openedNoteData={openedNoteData}
                                notesType={notesType}
                                handleTextChange={handleTextChange}
                                handleCheckboxClick={handleCheckboxClick}
                                handleEnterClick={handleEnterClick}
                                handleDeleteToDoBtnClick={handleDeleteToDoBtnClick}
                                handleAddToDoBtnClick={handleAddToDoBtnClick}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default HomePage;
