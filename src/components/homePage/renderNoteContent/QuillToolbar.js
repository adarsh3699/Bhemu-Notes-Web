import React, { useCallback, useState } from 'react';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';

import CircularProgress from '@mui/material/CircularProgress';

// Add sizes to whitelist and register them
// const Size = Quill.import('formats/size');
// Size.whitelist = ['small', 'medium', 'large'];
// Quill.register(Size, true);

// // Add fonts to whitelist and register them
// const Font = Quill.import('formats/font');
// Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
// Quill.register(Font, true);

// // Modules object for setting up the Quill editor
export const modules = {
	clipboard: {
		matchVisual: false,
	},
	toolbar: {
		container: '#toolbar',
		handlers: {
			// undo: undoChange,
			// redo: redoChange,
		},
	},
	history: {
		delay: 500,
		maxStack: 100,
		userOnly: true,
	},
};

// Formats objects for setting up the Quill editor
export const formats = [
	'header',
	'font',
	'size',
	'bold',
	'italic',
	'underline',
	'align',
	'strike',
	'script',
	'blockquote',
	'background',
	'list',
	'bullet',
	'indent',
	'link',
	'image',
	'video',
	'color',
	// 'code-block',
];

// Quill Toolbar component
export function QuillToolbar({
	quillRef,
	noteTitle,
	handleMsgShown,
	handleNotesModalClosing,
	isSaveBtnLoading,
	handleSaveBtnClick,
	openConfirmationDialog,
	toggleShareDialogBox,
	isSharedNoteType,
}) {
	const [settingMenuAnchorEl, setSettingMenuAddNotesAnchorEl] = useState(null);
	const isSettingsAnchorElopen = Boolean(settingMenuAnchorEl);

	const toggleSettingsMenu = (event) => {
		setSettingMenuAddNotesAnchorEl(event.currentTarget);
	};

	const exportAsPDF = async () => {
		const editorElement = quillRef.current?.editor?.container;
		if (!editorElement) {
			return handleMsgShown('Nothing to export as PDF', 'warning');
		}

		// Temporarily expand the editor container to fit all content
		editorElement.classList.add('disable_height');

		try {
			// Create the canvas with the expanded editor
			const canvas = await html2canvas(editorElement, {
				backgroundColor: 'rgb(30, 30, 30)',
				scale: 2, // Increase scale for better quality
			});

			// Restore the original height
			editorElement.classList.remove('disable_height');

			const imgData = canvas.toDataURL('image/jpeg', 1); // Use JPEG for smaller size
			const pdf = new jsPDF('p', 'mm', 'a4');
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();

			const imgProps = pdf.getImageProperties(imgData);
			const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

			let position = 0;
			while (position < imgHeight) {
				pdf.setFillColor(30, 30, 30);
				pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
				pdf.addImage(imgData, 'JPEG', 0, position ? -position : 0, pdfWidth, imgHeight);
				position += pdfHeight;
				if (position < imgHeight) {
					pdf.addPage();
				}
			}

			pdf.save(`${noteTitle || 'Untitled Notes'}.pdf`);
			handleMsgShown('PDF exported successfully', 'success');
		} catch (error) {
			// Restore the original height in case of error
			editorElement.classList.remove('disable_height');
			handleMsgShown('Error exporting PDF', 'error');
			console.error('Error exporting PDF:', error);
		}
	};

	const renderToolbarBtns = useCallback((tooltip, className, value) => {
		return (
			<Tooltip title={tooltip} enterDelay={700} arrow>
				{value ? <button className={className} value={value} /> : <button className={className} />}
			</Tooltip>
		);
	}, []);
	return (
		<div id="toolbar">
			<div className="toolbarContainer">
				<div className="ql-formats">
					<IconButton
						id="arrowBackIcon"
						color="inherit"
						aria-label="backBtn"
						aria-haspopup="true"
						sx={{ mr: 1 }}
						onClick={handleNotesModalClosing}
					>
						<ArrowBackIcon fontSize="inherit" />
					</IconButton>

					<Tooltip title="Save" arrow>
						<IconButton color="inherit" aria-label="save" onClick={handleSaveBtnClick}>
							{isSaveBtnLoading ? <CircularProgress size={24} /> : <SaveIcon fontSize="inherit" />}
						</IconButton>
					</Tooltip>
				</div>
				<div>
					<span className="ql-formats">
						<select className="ql-header" defaultValue="3" />
					</span>
					<span className="ql-formats">
						{renderToolbarBtns('Bold', 'ql-bold')}
						{renderToolbarBtns('Italic', 'ql-italic')}
						{renderToolbarBtns('Underline', 'ql-underline')}
						{renderToolbarBtns('Line Through', 'ql-strike')}
					</span>
					<span className="ql-formats notForPhone">
						{renderToolbarBtns('Number List', 'ql-list', 'ordered')}
						{renderToolbarBtns('Bullet List', 'ql-list', 'bullet')}
						{renderToolbarBtns('Indent', 'ql-indent', '-1')}
						{renderToolbarBtns('Indent', 'ql-indent', '+1')}
					</span>

					<span className="ql-formats notForPc">
						{renderToolbarBtns('Number List', 'ql-list', 'ordered')}
						{renderToolbarBtns('Bullet List', 'ql-list', 'bullet')}
						<select className="ql-align" />
					</span>
					<span className="ql-formats notForPhone">
						<select className="ql-color" />
						<select className="ql-background" />
						<select className="ql-align" />
					</span>
					<span className="ql-formats notForPhone">
						{renderToolbarBtns('Link', 'ql-link')}
						{renderToolbarBtns('Image', 'ql-image')}
						{renderToolbarBtns('Video', 'ql-video')}
					</span>
					<span className="ql-formats notForPhone">
						{renderToolbarBtns('Blockquote', 'ql-blockquote')}
						{/* {renderToolbarBtns('Code Block', 'ql-code-block')} */}
						{renderToolbarBtns('Clear All', 'ql-clean')}
					</span>
					<span className="ql-formats notForPc">
						<select className="ql-color" />
						{renderToolbarBtns('Link', 'ql-link')}
						{renderToolbarBtns('Clear All', 'ql-clean')}
					</span>
				</div>
				<Tooltip title="Menu" arrow>
					<IconButton
						id="noteMenuBtn"
						color="inherit"
						aria-expanded={isSettingsAnchorElopen ? 'true' : undefined}
						aria-haspopup="true"
						aria-controls={isSettingsAnchorElopen ? 'account-menu' : undefined}
						onClick={isSharedNoteType ? null : toggleSettingsMenu}
					>
						<MenuIcon fontSize="inherit" />
					</IconButton>
				</Tooltip>
			</div>
			<Menu
				anchorEl={settingMenuAnchorEl}
				id="account-menu"
				open={isSettingsAnchorElopen}
				onClose={() => setSettingMenuAddNotesAnchorEl(null)}
				onClick={() => setSettingMenuAddNotesAnchorEl(null)}
				PaperProps={{
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1,
						'& .MuiMenuItem-root': {
							height: 45,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 10,
							width: 10,
							height: 10,
							bgcolor: '#121212',
							backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={toggleShareDialogBox}>
					<ListItemIcon>
						<ShareIcon fontSize="small" />
					</ListItemIcon>
					Share
				</MenuItem>

				<MenuItem onClick={exportAsPDF}>
					<ListItemIcon>
						<FileDownloadIcon fontSize="small" />
					</ListItemIcon>
					Export
				</MenuItem>

				{/* <MenuItem onClick={() => console.log('Lock')}>
					<ListItemIcon>
						<DeleteIcon fontSize="small" />
					</ListItemIcon>
					Lock
				</MenuItem> */}

				<MenuItem onClick={openConfirmationDialog}>
					<ListItemIcon>
						<DeleteIcon fontSize="small" />
					</ListItemIcon>
					Delete
				</MenuItem>
			</Menu>
		</div>
	);
}

export default QuillToolbar;
