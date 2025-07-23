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
	handleDeleteBtnClick,
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

	// Single useEffect for all editor management
	useEffect(() => {
		// Initialize editor if not exists
		if (!editorRef.current && quillRef.current) {
			editorRef.current = new Quill(quillRef.current, {
				theme: "snow",
				modules,
				formats,
				placeholder: "Write something awesome...",
				readOnly: !SharedUserCanEdit,
			});

			// Handle text changes
			editorRef.current.on("text-change", () => {
				const content = editorRef.current.root.innerHTML;
				setOpenedNoteText(content);
			});
		}

		// Update content when openedNoteText changes
		if (editorRef.current) {
			const currentContent = editorRef.current.root.innerHTML;
			if (openedNoteText !== currentContent) {
				// Use Quill's setContents method for better handling
				if (openedNoteText) {
					editorRef.current.root.innerHTML = openedNoteText;
				} else {
					editorRef.current.setText("");
				}
			}

			// Update readOnly state
			editorRef.current.enable(SharedUserCanEdit);

			// Handle focus - only after a short delay to ensure DOM is ready
			if (SharedUserCanEdit) {
				setTimeout(() => {
					try {
						editorRef.current?.focus();
					} catch (error) {
						// Silently ignore focus errors
						console.debug("Focus error ignored:", error);
					}
				}, 100);
			}
		}

		// Update document title
		if (openedNoteAllData?.noteTitle) {
			document.title = `Bhemu Notes | ${openedNoteAllData?.noteTitle}`;
		}
	}, [openedNoteText, SharedUserCanEdit, openedNoteAllData?.noteTitle, openedNoteAllData?.noteId, setOpenedNoteText]);

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
