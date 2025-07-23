import { Suspense, lazy } from "react";
import { Navigate, Routes as Switch, Route } from "react-router-dom";
import Loader from "./components/loader/Loader";

// import LoginPage from './pages/LoginPage';
// import HomePage from "./pages/HomePage";
// import NotesPage from "./pages/NotesPage"
// import CreateAcc from "./pages/CreateAcc";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgetPasswordPage = lazy(() => import("./pages/ForgetPasswordPage"));
const CreateAcc = lazy(() => import("./pages/CreateAcc"));
const HomePage = lazy(() => import("./pages/HomePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function Routes() {
	return (
		<Suspense
			fallback={
				<div id="loadingScreen">
					Loading
					<Loader isLoading={true} sx={{ marginTop: "10px" }} />
				</div>
			}
		>
			<Switch>
				<Route exact path="/login" element={<LoginPage />} />
				<Route exact path="/register" element={<CreateAcc />} />
				<Route exact path="/forget-password" element={<ForgetPasswordPage />} />
				<Route exact path="/" element={<HomePage />} />
				<Route path="/share/*" element={<HomePage />} />
				<Route exact path="/settings" element={<SettingsPage />} />
				<Route exact path="/home" element={<Navigate to="/" />} />

				<Route
					path="*"
					element={
						<center id="pageNotFound">
							<h1>Sorry, this page isn't available.</h1>
							<h2>Error: 404</h2>
							<a href="/login"> Go to Login Page</a>
						</center>
					}
				/>
			</Switch>
		</Suspense>
	);
}

export default Routes;
