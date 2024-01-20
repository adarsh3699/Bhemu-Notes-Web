import React, { useState, useCallback, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { handleSignOut } from '../../../firebase/auth';
import FolderDialog from '../../folderDialog/FolderDialog';
import { USER_DETAILS } from '../../../utils';

import { unsubscribeAll } from '../../../firebase/notes';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import BallotIcon from '@mui/icons-material/Ballot';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';

// import logo from './files/logo.jpeg';
import logo from './files/newLogoNav.webp';

import './files/navBar.css';

function NavBar({ NavBarType, addNotes, userAllDetails, allNotes, handleFolderChange, handleMsgShown }) {
	const navigate = useNavigate();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isNoteFolderListOpen, setIsNoteFolderListOpen] = useState(false);
	const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
	const noteFolders = userAllDetails?.userFolders || [];

	const currentFolderHash = window.location.hash.slice(1);

	const handleLogoutBtnClick = useCallback(() => {
		localStorage.clear();
		handleSignOut();
	}, []);

	const toggleFolderDialog = useCallback(() => {
		setIsFolderDialogOpen((prevState) => !prevState);
	}, []);

	// const [drawerList1, setDrawerList1] = useState([
	// 	{
	// 		name: 'All Notes',
	// 		icon: <BallotIcon />,
	// 		// function: <ProfileSettings />,
	// 	},
	// 	{
	// 		name: 'Show Folder',
	// 		icon: <FolderIcon />,
	// 		// function: <AccountSettings />,
	// 	},
	// 	{
	// 		name: 'Edit Folder',
	// 		icon: <EditIcon />,
	// 		function: toggleFolderDialog,
	// 	},
	// ]);

	const drawerList2 = [
		{
			name: 'Deleted',
			icon: <DeleteIcon />,
			function: () => handleMsgShown('Coming Soon', 'warning'),
		},
		{
			name: 'Settings',
			icon: <FolderIcon />,
			navigateTo: '/Settings',
		},
		{
			name: 'Logout',
			icon: <Logout />,
			function: handleLogoutBtnClick,
		},
	];

	useEffect(() => {
		const openFolderFromURL = userAllDetails?.userFolders?.filter((item) => item.folderName === currentFolderHash);
		if (openFolderFromURL.length > 0) {
			handleFolderChange(openFolderFromURL?.[0]);
		} else {
			navigate('/home');
		}
	}, [currentFolderHash, handleFolderChange, navigate, userAllDetails?.userFolders]);

	useEffect(() => {
		const openFolderFromURL = userAllDetails?.userFolders?.filter(
			(item) => item.folderName === window.location?.href?.split('#')[1]
		);
		if (openFolderFromURL.length > 0) {
			handleFolderChange(openFolderFromURL?.[0]);
		} else {
			navigate('/home');
		}
	}, [handleFolderChange, navigate, userAllDetails?.userFolders]);

	useEffect(() => {
		const openFolderFromURL = userAllDetails?.userFolders?.filter(
			(item) => item.folderName === window.location?.href?.split('#')[1]
		);
		if (openFolderFromURL.length > 0) {
			handleFolderChange(openFolderFromURL?.[0]);
		} else {
			navigate('/home');
		}
	}, [handleFolderChange, navigate, userAllDetails?.userFolders]);

	const toggleDrawer = useCallback(() => {
		setIsDrawerOpen((prevState) => !prevState);
	}, []);

	// const handleEditFolderListBtnClick = useCallback(() => {
	// 	setIsDrawerOpen((prevState) => !prevState);
	// 	setIsFolderDialogOpen((prevState) => !prevState);
	// }, []);

	const renderDrawerListBtns = (name, icon, func, sx) => {
		return (
			<ListItem disablePadding onClick={func} sx={sx}>
				<ListItemButton>
					<ListItemIcon>{icon}</ListItemIcon>
					<ListItemText primary={name} />
				</ListItemButton>
			</ListItem>
		);
	};

	return (
		<>
			<div className="navbar">
				<div id="logo">
					<IconButton
						id="iconMenuBtn"
						color="inherit"
						size="small"
						aria-haspopup="true"
						onClick={NavBarType === 'homePage' ? toggleDrawer : null}
						sx={{ ml: 1.2 }}
					>
						<Avatar alt="Remy Sharp" src={logo} sx={{ width: 30, height: 30 }} />
					</IconButton>
					<div id="name">{USER_DETAILS?.userName || 'Bhemu Notes'}</div>
				</div>

				<Button
					className="addNoteBtn"
					variant="contained"
					color="success"
					id="basic-button"
					aria-haspopup="true"
					onClick={addNotes}
				>
					Add Note
				</Button>
			</div>

			<Drawer open={isDrawerOpen} onClose={toggleDrawer}>
				<div className="drawerTitle">Bhemu Notes</div>
				<Divider />

				<Box sx={{ width: 250 }} role="presentation">
					<List>
						{renderDrawerListBtns('All Notes', <BallotIcon />, () => {
							toggleDrawer();
							navigate('/home');
							unsubscribeAll();
						})}
						{renderDrawerListBtns(
							'Show Folders',
							isNoteFolderListOpen ? <ExpandLess /> : <ExpandMore />,
							() => setIsNoteFolderListOpen((prev) => !prev)
						)}

						<Collapse in={isNoteFolderListOpen} timeout="auto" unmountOnExit>
							<List component="div" disablePadding onClick={toggleDrawer}>
								<ListItemButton
									sx={{ pl: 4 }}
									onClick={() => setIsFolderDialogOpen((prevState) => !prevState)}
								>
									<ListItemText primary="Edit Folder" />
									<EditIcon />
								</ListItemButton>

								{noteFolders.map((item, index) => {
									return (
										<ListItemButton
											key={index}
											onClick={() => handleFolderChange(item)}
											sx={{ pl: 4 }}
											selected={currentFolderHash === item?.folderName}
										>
											<ListItemText
												primary={item?.folderName}
												primaryTypographyProps={{
													style: {
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													},
												}}
											/>
										</ListItemButton>
									);
								})}
							</List>
						</Collapse>
						{/* {renderDrawerListBtns('Edit Folder', <EditIcon />, handleEditFolderListBtnClick)} */}
					</List>
					<Divider />

					<List sx={{ mb: 20 }}>
						{drawerList2.map((item, index) => (
							<ListItem key={'drawer_' + index} disablePadding onClick={toggleDrawer}>
								{item.name !== 'Settings' ? (
									<ListItemButton sx={{ py: 1.5 }} onClick={item?.function}>
										<ListItemIcon>{item.icon}</ListItemIcon>
										<ListItemText primary={item.name} />
									</ListItemButton>
								) : (
									<NavLink to={item?.navigateTo} style={{ flex: 1 }}>
										<ListItemButton sx={{ py: 1.5 }}>
											<ListItemIcon>
												<Settings />
											</ListItemIcon>
											<ListItemText primary={item.name} />
										</ListItemButton>
									</NavLink>
								)}
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>

			{isFolderDialogOpen && (
				<FolderDialog
					handleMsgShown={handleMsgShown}
					toggleFolderDialog={toggleFolderDialog}
					allNotes={allNotes}
					noteFolders={noteFolders}
					// isFolderDialogOpen={isFolderDialogOpen}
				/>
			)}
		</>
	);
}

export default NavBar;
