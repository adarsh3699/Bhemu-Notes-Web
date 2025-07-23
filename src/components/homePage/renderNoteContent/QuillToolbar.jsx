import { useCallback, useState } from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";

import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Tooltip from "@mui/material/Tooltip";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";

import CircularProgress from "@mui/material/CircularProgress";

// Quill Toolbar component
export function QuillToolbar({
	handleNotesModalClosing,
	isSaveBtnLoading,
	handleSaveBtnClick,
	toggleConfirmationDeleteDialog,
	toggleShareDialogBox,
	toggleExportDialog,
	isSharedNoteType,
}) {
	const [settingMenuAnchorEl, setSettingMenuAddNotesAnchorEl] = useState(null);
	const isSettingsAnchorElopen = Boolean(settingMenuAnchorEl);

	const toggleSettingsMenu = (event) => {
		console.log("dsf");

		setSettingMenuAddNotesAnchorEl(event.currentTarget);
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
						<select className="ql-header" defaultValue="">
							<option value="1"></option>
							<option value="2"></option>
							<option value="3"></option>
							<option value=""></option>
						</select>
					</span>
					<span className="ql-formats">
						{renderToolbarBtns("Bold", "ql-bold")}
						{renderToolbarBtns("Italic", "ql-italic")}
						{renderToolbarBtns("Underline", "ql-underline")}
						{renderToolbarBtns("Line Through", "ql-strike")}
					</span>
					<span className="ql-formats notForPhone">
						{renderToolbarBtns("Number List", "ql-list", "ordered")}
						{renderToolbarBtns("Bullet List", "ql-list", "bullet")}
						{renderToolbarBtns("Check List", "ql-list", "check")}
					</span>

					<span className="ql-formats notForPhone">
						{renderToolbarBtns("Indent", "ql-indent", "-1")}
						{renderToolbarBtns("Indent", "ql-indent", "+1")}
						<select className="ql-align">
							<option value=""></option>
							<option value="center"></option>
							<option value="right"></option>
							<option value="justify"></option>
						</select>
					</span>

					<span className="ql-formats notForPc">
						{renderToolbarBtns("Number List", "ql-list", "ordered")}
						{renderToolbarBtns("Bullet List", "ql-list", "bullet")}
						<select className="ql-align">
							<option value=""></option>
							<option value="center"></option>
							<option value="right"></option>
							<option value="justify"></option>
						</select>
					</span>
					<span className="ql-formats notForPhone">
						<select className="ql-color"></select>
						<select className="ql-background"></select>
					</span>
					<span className="ql-formats notForPhone">
						{renderToolbarBtns("Link", "ql-link")}
						{renderToolbarBtns("Image", "ql-image")}
						{renderToolbarBtns("Video", "ql-video")}
					</span>
					<span className="ql-formats notForPhone">
						{renderToolbarBtns("Blockquote", "ql-blockquote")}
						{/* {renderToolbarBtns('Code Block', 'ql-code-block')} */}
						{renderToolbarBtns("Clear All", "ql-clean")}
					</span>
					<span className="ql-formats notForPc">
						<select className="ql-color"></select>
						{renderToolbarBtns("Link", "ql-link")}
						{renderToolbarBtns("Clear All", "ql-clean")}
					</span>
				</div>
				{isSharedNoteType ? (
					<Tooltip title="Export" arrow>
						<IconButton
							id="noteMenuBtn"
							color="inherit"
							aria-expanded={isSettingsAnchorElopen ? "true" : undefined}
							aria-haspopup="true"
							aria-controls={isSettingsAnchorElopen ? "account-menu" : undefined}
							onClick={toggleExportDialog}
						>
							<FileDownloadIcon fontSize="inherit" />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title="Menu" arrow>
						<IconButton
							id="noteMenuBtn"
							color="inherit"
							aria-expanded={isSettingsAnchorElopen ? "true" : undefined}
							aria-haspopup="true"
							aria-controls={isSettingsAnchorElopen ? "account-menu" : undefined}
							onClick={isSharedNoteType ? null : toggleSettingsMenu}
						>
							<MenuIcon fontSize="inherit" />
						</IconButton>
					</Tooltip>
				)}
			</div>
			<Menu
				anchorEl={settingMenuAnchorEl}
				id="account-menu"
				open={isSettingsAnchorElopen}
				onClose={() => setSettingMenuAddNotesAnchorEl(null)}
				onClick={() => setSettingMenuAddNotesAnchorEl(null)}
				PaperProps={{
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1,
						"& .MuiMenuItem-root": {
							height: 45,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 10,
							width: 10,
							height: 10,
							bgcolor: "#121212",
							backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<MenuItem onClick={toggleShareDialogBox}>
					<ListItemIcon>
						<ShareIcon fontSize="small" />
					</ListItemIcon>
					Share
				</MenuItem>

				<MenuItem onClick={toggleExportDialog}>
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

				<MenuItem onClick={toggleConfirmationDeleteDialog}>
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

// Add sizes to whitelist and register them
// const Size = Quill.import('formats/size');
// Size.whitelist = ['small', 'medium', 'large'];
// Quill.register(Size, true);

// // Add fonts to whitelist and register them
// const Font = Quill.import('formats/font');
// Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
// Quill.register(Font, true);

// Configuration moved to separate file for better fast refresh support
