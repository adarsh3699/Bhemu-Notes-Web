import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { handleSignOut, handleUserState } from '../firebase/auth';

import SettingsDrawer from '../components/settingsPage/settingsDrawer/SettingsDrawer';
import ProfileSettings from '../components/settingsPage/profileSettings/ProfileSettings';
import AccountSettings from '../components/settingsPage/accountSettings/AccountSettings';
import AboutSettings from '../components/settingsPage/aboutSettings/AboutSettings';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

import '../styles/settingsPage.css';

document.title = 'Bhemu Notes | Settings';

const drawerWidth = 240;

function SettingsPage() {
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [settingsDrawerMenu, setSettingsDrawerMenu] = useState([
        { name: 'Profile', isSelected: true, icon: <AccountBoxIcon />, page: <ProfileSettings /> },
        { name: 'Account', isSelected: false, icon: <SettingsIcon />, page: <AccountSettings /> },
        { name: 'About', isSelected: false, icon: <InfoIcon />, page: <AboutSettings /> },
        { name: 'Log Out', isSelected: false, icon: <LogoutIcon />, page: undefined },
    ]);

    useEffect(() => {
        handleUserState('settingsPage');
        if (JSON.parse(localStorage.getItem('user_details'))) {
            setIsPageLoaded(true);
            document.title = 'Bhemu Notes | Settings ';
        }
    }, []);

    const handleDrawerToggle = useCallback(() => {
        setMobileOpen(!mobileOpen);
    }, [mobileOpen]);

    const handleSelectedMenu = useCallback(
        (menuName, index) => {
            if (menuName === 'Log Out') {
                handleSignOut();
                localStorage.clear();
                document.location.href = '/';
                return;
            }

            const newSettingsDrawerMenu = settingsDrawerMenu.map(function (items, i) {
                return i === index
                    ? { ...items, isSelected: settingsDrawerMenu.i === menuName ? false : true }
                    : { ...items, isSelected: false };
            });

            setSettingsDrawerMenu(newSettingsDrawerMenu);
        },
        [settingsDrawerMenu]
    );

    return (
        <>
            {isPageLoaded && (
                <Box sx={{ display: 'flex' }}>
                    <AppBar
                        position="fixed"
                        sx={{
                            width: { sm: `calc(100% - ${drawerWidth}px)` },
                            ml: { sm: `${drawerWidth}px` },
                            background: '#1e1e1e',
                        }}
                    >
                        <Toolbar sx={{ justifyContent: 'space-between' }}>
                            <div className="settingsMenu">
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ mr: 2, ml: 0, display: { sm: 'none' } }}
                                >
                                    <MenuIcon />
                                </IconButton>

                                <Typography variant="h5" sx={{ fontWeight: '600' }} noWrap component="div">
                                    Settings
                                </Typography>
                            </div>
                            <NavLink to="/home">
                                <IconButton color="inherit" aria-label="delete">
                                    <CloseIcon />
                                </IconButton>
                            </NavLink>
                        </Toolbar>
                        <Divider />
                    </AppBar>

                    <SettingsDrawer
                        drawerWidth={drawerWidth}
                        handleDrawerToggle={handleDrawerToggle}
                        mobileOpen={mobileOpen}
                        settingsDrawerMenu={settingsDrawerMenu}
                        handleSelectedMenu={handleSelectedMenu}
                    />

                    {/* content */}
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, pt: 5, pb: 10, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                    >
                        <Toolbar />

                        {settingsDrawerMenu.map((item, index) => (
                            <div key={index}>{item?.isSelected ? item?.page : null}</div>
                        ))}
                    </Box>
                </Box>
            )}
        </>
    );
}

export default SettingsPage;
