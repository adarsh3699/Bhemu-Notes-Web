import React from 'react';

import './aboutSettings.css';

function AboutSettings() {
	return (
		<div className="aboutSettings">
			<div className="aboutSettingsTitle">What's New :-</div>
			<li>Our new version 2.1.0 has been released.</li>
			<li>Introduced our new UI for a better user experience.</li>
			<li>Now we have migrated to Firebase for fast and secure database connections.</li>
			<li>You can now store both to-do and note types in the same file.</li>
			<li>Optimize for fast and smooth performance.</li>

			<a href='https://www.bhemu.me/about' target='_blank' className="aboutdeveloperTitle" rel="noreferrer">About developer 🔗</a>
		</div>
	);
}

export default AboutSettings;
