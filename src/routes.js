import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import NotesPage from "./pages/NotesPage"
// import Learning from "./components/Learning";

function Routes() {
    return (
        <BrowserRouter >
           <Switch>
                <Route exact path="/" element={<LoginPage />} />
                <Route exact path="/home" element={<HomePage />} />
                <Route exact path="/notes" element={<NotesPage />} />
                {/* <Route exact path="/learn" element={<Learning />} /> */}
                
                <Route path="*" element={<div>page not found</div>} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;