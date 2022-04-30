import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import NotesPage from "./pages/NotesPage"
import CreateAcc from "./pages/CreateAcc";

function Routes() {
    return (
        <BrowserRouter >
           <Switch>
                <Route exact path="/" element={<LoginPage />} />
                <Route exact path="/home" element={<HomePage />} />
                <Route exact path="/notes" element={<NotesPage />} />
                <Route exact path="/createAcc" element={<CreateAcc />} />
                
                <Route path="*" element={<div>page not found</div>} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;