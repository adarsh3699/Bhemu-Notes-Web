import React, { useRef, useEffect, useCallback, useState } from 'react';

import RenderDialogs from '../../dialogs/RenderDialogs';

import ReactQuill from 'react-quill';
import QuillToolbar, { modules, formats } from './QuillToolbar';
// import { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './renderNoteContent.css';

function RenderNoteContent({
	isSaveBtnLoading,
	handleNotesModalClosing,
	openedNoteAllData,
	setOpenedNoteAllData,
	openedNoteText,
	setOpenedNoteText,
	handleSaveBtnClick,
	handleDeleteBtnClick, // handleDeleteBtnClickOnYesClick,
	handleAddShareNoteUser,
	SharedUserCanEdit,
	isSharedNoteType,
	handleMsgShown,
}) {
	const quillRef = useRef(null);
	const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
	const [isShareDialogOpen, setIsShareDialogBoxOpen] = useState(false);
	const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

	useEffect(() => {
		if (openedNoteAllData?.noteTitle) document.title = `Bhemu Notes | ${openedNoteAllData?.noteTitle}`;
		if (SharedUserCanEdit) quillRef?.current?.focus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [SharedUserCanEdit, openedNoteAllData?.noteId]);

	const toggleConfirmationDialog = useCallback(() => {
		setIsConfirmationDialogOpen((prev) => !prev);
	}, []);

	const toggleShareDialogBox = useCallback(() => {
		setIsShareDialogBoxOpen((prev) => !prev);
	}, []);

	const toggleExportDialog = useCallback(() => {
		setIsExportDialogOpen((prev) => !prev);
	}, []);

	return (
		<>
			<div className="text-editor">
				<QuillToolbar
					handleNotesModalClosing={handleNotesModalClosing}
					isSaveBtnLoading={isSaveBtnLoading}
					toggleConfirmationDeleteDialog={toggleConfirmationDialog}
					handleSaveBtnClick={handleSaveBtnClick}
					handleAddShareNoteUser={handleAddShareNoteUser}
					toggleShareDialogBox={toggleShareDialogBox}
					toggleExportDialog={toggleExportDialog}
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

			{(isConfirmationDialogOpen || isShareDialogOpen || isExportDialogOpen) && (
				<RenderDialogs
					isConfirmationDialogOpen={isConfirmationDialogOpen}
					isShareDialogOpen={isShareDialogOpen}
					isExportDialogOpen={isExportDialogOpen}
					toggleConfirmationDialog={toggleConfirmationDialog}
					toggleShareDialog={toggleShareDialogBox}
					toggleExportDialog={toggleExportDialog}
					handleDeleteBtnClick={handleDeleteBtnClick}
					handleAddShareNoteUser={handleAddShareNoteUser}
					openedNoteAllData={openedNoteAllData}
					setOpenedNoteAllData={setOpenedNoteAllData}
					handleMsgShown={handleMsgShown}
					quillRef={quillRef}
					noteTitle={openedNoteAllData?.noteTitle}
				/>
			)}
		</>
	);
}

export default RenderNoteContent;
