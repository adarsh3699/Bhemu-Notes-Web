import { useRef, useEffect, useCallback, useState } from "react";

import RenderDialogs from "../../dialogs/RenderDialogs";

import Quill from "quill";
import QuillToolbar from "./QuillToolbar";
import { modules, formats } from "./quillConfig";

import "quill/dist/quill.snow.css";

import "./renderNoteContent.css";

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
	const editorRef = useRef(null);
	const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
	const [isShareDialogOpen, setIsShareDialogBoxOpen] = useState(false);
	const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

	// Initialize Quill editor
	useEffect(() => {
		if (!editorRef.current && quillRef.current) {
			editorRef.current = new Quill(quillRef.current, {
				theme: "snow",
				modules,
				formats,
				placeholder: "Write something awesome...",
				readOnly: !SharedUserCanEdit,
			});

			// Handle text changes
			editorRef.current.on("text-change", (delta, oldDelta, source) => {
				if (source === "user") {
					const content = editorRef.current.root.innerHTML;
					setOpenedNoteText(content);
				}
			});
		}
	}, [SharedUserCanEdit, setOpenedNoteText]);

	// Update editor content when openedNoteText changes
	useEffect(() => {
		if (editorRef.current && openedNoteText !== editorRef.current.root.innerHTML) {
			const currentSelection = editorRef.current.getSelection();
			editorRef.current.root.innerHTML = openedNoteText || "";
			if (currentSelection) {
				editorRef.current.setSelection(currentSelection);
			}
		}
	}, [openedNoteText]);

	// Handle readOnly mode changes
	useEffect(() => {
		if (editorRef.current) {
			editorRef.current.enable(SharedUserCanEdit);
		}
	}, [SharedUserCanEdit]);

	// Focus and title update logic
	useEffect(() => {
		if (openedNoteAllData?.noteTitle) document.title = `Bhemu Notes | ${openedNoteAllData?.noteTitle}`;
		if (SharedUserCanEdit && editorRef.current) {
			editorRef.current.focus();
		}
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
				<div ref={quillRef} />
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
					quillRef={editorRef}
					noteTitle={openedNoteAllData?.noteTitle}
				/>
			)}
		</>
	);
}

export default RenderNoteContent;
