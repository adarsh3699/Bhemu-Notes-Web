import React, { useState } from 'react';
import SettingsDrawer from '../components/settingsPage/settingsDrawer/SettingsDrawer';
import AboutSettings from '../components/settingsPage/aboutSettings/AboutSettings';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

import '../css/settingsPage.css';

document.title = 'Bhemu Notes | Settings';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const drawerWidth = 240;

const userDetails = JSON.parse(localStorage.getItem('user_info'))?.details;

function SettingsPage() {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

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
                />

                {/* content */}
                <Box component="main" sx={{ flexGrow: 1, p: 5, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                    <Toolbar />
                    <div>
                        <AboutSettings />
                    </div>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default SettingsPage;
