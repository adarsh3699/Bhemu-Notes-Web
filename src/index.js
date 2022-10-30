import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes';

import './css/index.css';

import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <GoogleOAuthProvider clientId="364212166736-4vpgde5laomt5v0ochdv4ufr5lmt9as1.apps.googleusercontent.com">
                <Routes />
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
