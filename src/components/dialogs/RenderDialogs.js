import React from 'react';
import ConfirmationDialogBox from './confirmationDialog/ConfirmationDialogBox';
import ExportDialog from './exportDialog/ExportDialog';
import FolderDialog from './folderDialog/FolderDialog';
import ShareDialogBox from './shareDialog/ShareDialogBox';

import './dialogs.css';

function RenderDialogs({
	isConfirmationDialogOpen,
	isFolderDialogOpen,
	isExportDialogOpen,
	isShareDialogOpen,
	toggleConfirmationDialog,
	toggleFolderDialog,
	toggleExportDialog,
	toggleShareDialog,
	handleMsgShown,
	userAllNotes,
	handleDeleteBtnClick,
	noteFolders,
	handleAddShareNoteUser,
	openedNoteAllData,
	setOpenedNoteAllData,
	quillRef,
	noteTitle,
}) {
	const dialogArray = [
		{
			dialog: 'confirmationDialog',
			component: (
				<ConfirmationDialogBox
					title="Are You Sure?"
					message="You can't undo this action."
					isOpen={isConfirmationDialogOpen}
					toggleConfirmationDialog={toggleConfirmationDialog}
					onYesClick={() => {
						handleDeleteBtnClick();
						toggleConfirmationDialog();
					}}
				/>
			),
			isOpen: isConfirmationDialogOpen,
		},
		{
			dialog: 'exportDialog',
			component: (
				<ExportDialog
					quillRef={quillRef}
					noteTitle={noteTitle}
					toggleExportDialog={toggleExportDialog}
					handleMsgShown={handleMsgShown}
				/>
			),
			isOpen: isExportDialogOpen,
		},
		{
			dialog: 'folderDialog',
			component: (
				<FolderDialog
					handleMsgShown={handleMsgShown}
					toggleFolderDialog={toggleFolderDialog}
					userAllNotes={userAllNotes}
					noteFolders={noteFolders}
				/>
			),
			isOpen: isFolderDialogOpen,
		},
		{
			dialog: 'shareDialog',
			component: (
				<ShareDialogBox
					toggleShareDialog={toggleShareDialog}
					handleAddShareNoteUser={handleAddShareNoteUser}
					openedNoteAllData={openedNoteAllData}
					setOpenedNoteAllData={setOpenedNoteAllData}
					handleMsgShown={handleMsgShown}
				/>
			),
			isOpen: isShareDialogOpen,
		},
	];
	return dialogArray.map((dialog, index) =>
		dialog.isOpen ? <React.Fragment key={index}>{dialog.component}</React.Fragment> : null
	);
}

export default RenderDialogs;
