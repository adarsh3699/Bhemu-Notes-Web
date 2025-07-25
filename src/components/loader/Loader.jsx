// React import removed - not needed with JSX transform

import "./loader.css";

function Loader({ isLoading, sx }) {
	if (isLoading)
		return (
			<div id="loadingIcon" style={sx}>
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
		);
}

export default Loader;
