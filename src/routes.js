import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';

// import LoginPage from './pages/LoginPage';
// import HomePage from "./pages/HomePage";
// import NotesPage from "./pages/NotesPage"
// import CreateAcc from "./pages/CreateAcc";

const LoginPage = lazy(() => import('./pages/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const CreateAcc = lazy(() => import('./pages/CreateAcc'));

function Routes() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div id='loadingScreen'>loading...</div>}>
                <Switch>
                    <Route exact path="/" element={<LoginPage />} />
                    <Route exact path="/home" element={<HomePage />} />
                    <Route exact path="/notes" element={<NotesPage />} />
                    <Route exact path="/register" element={<CreateAcc />} />
                    
                    <Route path="*" element={<div>page not found</div>} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    );
}

export default Routes;