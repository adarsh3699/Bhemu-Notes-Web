// React import removed - not needed with JSX transform

import "./showMsg.css";

function ShowMsg({ msgText, type }) {
	return (
		msgText && (
			<div id="msgBox">
				<div id="textMsg" className={type}>
					{msgText}
				</div>
			</div>
		)
	);
}

export default ShowMsg;
