import React, { useState, useCallback } from 'react';
import SettingsDrawer from '../components/settingsPage/settingsDrawer/SettingsDrawer';
import AboutSettings from '../components/settingsPage/aboutSettings/AboutSettings';
import AccountSettings from '../components/settingsPage/accountSettings/AccountSettings';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';

import '../css/settingsPage.css';

document.title = 'Bhemu Notes | Settings';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const settingsDrawerMenu = [
    { name: 'Profile', icon: <AccountBoxIcon /> },
    { name: 'Account', icon: <SettingsIcon /> },
    { name: 'About', icon: <InfoIcon /> },
    { name: 'Log Out', icon: <LogoutIcon /> },
];

const drawerWidth = 240;

function SettingsPage() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('Profile');

    const handleDrawerToggle = useCallback(() => {
        setMobileOpen(!mobileOpen);
    }, [mobileOpen]);

    const handleSelectedMenu = useCallback((menuName) => {
        setSelectedMenu(menuName);
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ display: 'flex' }}>
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                        background: '#1e1e1e',
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{ fontWeight: '600' }} noWrap component="div">
                            Settings
                        </Typography>
                    </Toolbar>
                    <Divider />
                </AppBar>

                <SettingsDrawer
                    drawerWidth={drawerWidth}
                    handleDrawerToggle={handleDrawerToggle}
                    mobileOpen={mobileOpen}
                    settingsDrawerMenu={settingsDrawerMenu}
                    selectedMenu={selectedMenu}
                    handleSelectedMenu={handleSelectedMenu}
                />

                {/* content */}
                <Box
                    component="main"
                    sx={{ flexGrow: 1, py: 5, pl: 10, pr: 5, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    <div>
                        {selectedMenu === 'Profile' ? (
                            <AboutSettings />
                        ) : selectedMenu === 'Account' ? (
                            <AccountSettings />
                        ) : null}
                    </div>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default SettingsPage;
