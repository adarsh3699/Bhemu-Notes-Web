import React, { useRef, useEffect } from 'react';

import ReactQuill from 'react-quill';
import QuillToolbar, { modules, formats } from './QuillToolbar';
// import { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './renderNoteContent.css';

function RenderNoteContent({
	isSaveBtnLoading,
	handleNotesModalClosing,
	toggleShareDialogBox,
	openedNoteAllData,
	openedNoteText,
	setOpenedNoteText,
	handleSaveBtnClick,
	openConfirmationDialog, // handleDeleteBtnClickOnYesClick,
	handleAddShareNoteUser,
	SharedUserCanEdit,
	isSharedNoteType,
}) {
	const quillRef = useRef(null);

	useEffect(() => {
		if (openedNoteAllData?.noteTitle) document.title = `Bhemu Notes | ${openedNoteAllData?.noteTitle}`;
		if (SharedUserCanEdit) quillRef?.current?.focus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [SharedUserCanEdit, openedNoteAllData?.noteId]);

	return (
		<div className="text-editor">
			<QuillToolbar
				handleNotesModalClosing={handleNotesModalClosing}
				isSaveBtnLoading={isSaveBtnLoading}
				openConfirmationDialog={openConfirmationDialog}
				handleSaveBtnClick={handleSaveBtnClick}
				handleAddShareNoteUser={handleAddShareNoteUser}
				toggleShareDialogBox={toggleShareDialogBox}
				isSharedNoteType={isSharedNoteType}
			/>
			<ReactQuill
				ref={quillRef}
				theme="snow"
				formats={formats}
				value={openedNoteText}
				onChange={setOpenedNoteText}
				readOnly={!SharedUserCanEdit}
				placeholder="Write something awesome..."
				modules={modules}
			/>
		</div>
	);
}

export default RenderNoteContent;
