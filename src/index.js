import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes';

import './css/index.css';

import { Provider } from 'react-redux';
import { reducers } from "./redux/reducers"
import thunk from "redux-thunk"
import { BrowserRouter } from "react-router-dom"
import { createStore, applyMiddleware, compose } from "redux"
import { GoogleOAuthProvider } from "@react-oauth/google"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(thunk)))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    //     <Routes />
    // </React.StrictMode>

    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <GoogleOAuthProvider
                    clientId="364212166736-4vpgde5laomt5v0ochdv4ufr5lmt9as1.apps.googleusercontent.com">
                    <Routes />
                </GoogleOAuthProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
