import React, { Suspense, lazy } from 'react';
import { Routes as Switch, Route } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
// import HomePage from "./pages/HomePage";
// import NotesPage from "./pages/NotesPage"
// import CreateAcc from "./pages/CreateAcc";

const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgetPasswordPage = lazy(() => import('./pages/ForgetPasswordPage'));
const CreateAcc = lazy(() => import('./pages/CreateAcc'));
const HomePage = lazy(() => import('./pages/HomePage'));

function Routes() {
    return (
        <Suspense
            fallback={
                <>
                    <div id="loadingScreen">
                        Loading
                        <div id="loadingIcon">
                            <div className="lds-spinner">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </>
            }
        >
            <Switch>
                <Route exact path="/" element={<LoginPage />} />
                <Route exact path="/forget-password" element={<ForgetPasswordPage />} />
                <Route exact path="/register" element={<CreateAcc />} />
                <Route exact path="/home" element={<HomePage />} />

                <Route
                    path="*"
                    element={
                        <center>
                            <h1>Page not Found</h1>
                        </center>
                    }
                />
            </Switch>
        </Suspense>
    );
}

export default Routes;
