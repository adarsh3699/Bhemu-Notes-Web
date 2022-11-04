import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';

import './css/index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 700,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <GoogleOAuthProvider clientId="364212166736-4vpgde5laomt5v0ochdv4ufr5lmt9as1.apps.googleusercontent.com">
                <ThemeProvider theme={theme}>
                    <Routes />
                </ThemeProvider>
            </GoogleOAuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import Routes from './routes';
// import './css/index.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <React.StrictMode>
//         <Routes />
//     </React.StrictMode>
// );
