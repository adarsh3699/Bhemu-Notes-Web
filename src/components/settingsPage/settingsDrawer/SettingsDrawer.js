import React from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

function SettingsDrawer(
	{ drawerWidth, mobileOpen, handleDrawerToggle, settingsDrawerMenu, handleSelectedMenu },
	props
) {
	const { window } = props;

	const container = window !== undefined ? () => window().document.body : undefined;

	const drawer = (isForPhone) => (
		<div>
			<Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{ mr: 2, ml: 0, display: { sm: 'none' } }}
				>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6" noWrap component="div">
					Bhemu Notes
				</Typography>
			</Toolbar>
			<Divider />
			<List>
				{settingsDrawerMenu.map((item, index) => (
					<ListItem
						key={index}
						disablePadding
						selected={item.isSelected}
						// eslint-disable-next-line no-sequences
						onClick={() => (handleSelectedMenu(item?.name, index), isForPhone && handleDrawerToggle())}
					>
						<ListItemButton sx={{ py: 1.7, pl: 4 }}>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.name} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</div>
	);

	return (
		<Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
			{/* For Phone drawer */}
			<Drawer
				container={container}
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: 'block', sm: 'none' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: drawerWidth,
					},
				}}
			>
				{drawer(true)}
			</Drawer>
			{/* For Pc drawer */}
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: 'none', sm: 'block' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: drawerWidth,
					},
				}}
				open
			>
				{drawer()}
			</Drawer>
		</Box>
	);
}

export default SettingsDrawer;
