// React import removed - not needed with JSX transform
import { Accordion } from "../../Accordion";

import "./aboutSettings.css";
import "./accordion.css";

function AboutSettings() {
	return (
		<div className="aboutSettings">
			<div className="aboutSettingsTitle">What's New :-</div>
			<div className="aboutPoints">Our new version 3.0.1 has been released.</div>
			<div className="aboutPoints">
				The newly introduced Textarea has many features, like bold, italic, changing font colour, size, and many
				more.
			</div>
			<div className="aboutPoints">
				Introduced a new feature like group notes in a folder to keep them organised.
			</div>
			<div className="aboutPoints">
				Introduced a new feature Share notes with others by just sharing the link to that note.
			</div>
			<div className="aboutPoints">You can now add images, videos, and code blocks in Note.</div>
			<div className="aboutPoints" style={{ marginBottom: 20 }}>
				Optimize for fast and smooth performance.
			</div>

			<Accordion title="Version 2.1.0">
				<div className="aboutPoints">Our new version 2.1.0 has been released.</div>
				<div className="aboutPoints">Introduced our new UI for a better user experience.</div>
				<div className="aboutPoints">
					Now we have migrated to Firebase for fast and secure database connections.
				</div>
				<div className="aboutPoints">You can now store both to-do and note types in the same file.</div>
				<div className="aboutPoints">Optimize for fast and smooth performance.</div>
			</Accordion>
			<Accordion title="Version 1.2.0">
				<div className="aboutPoints">This is the first public version of Bhemu notes.</div>
				<div className="aboutPoints">Allow you to keep different todos and notes.</div>
				<div className="aboutPoints">Based on MongoDB With the help of Express.js, Node.js, and React.js,.</div>
				<div className="aboutPoints">Allow Google and email-password authentication.</div>
			</Accordion>

			<a href="https://www.bhemu.me/about" target="_blank" className="aboutdeveloperTitle" rel="noreferrer">
				About developer :-
			</a>
			<div className="aboutPoints">My Name is Adarsh Suman & I'm a programmer and a computer geek.</div>
			<div className="aboutPoints">I have skills in web application development as a full-stack developer.</div>
			<div className="aboutPoints">I have more than two years of experience in this industry.</div>
			<div className="aboutPoints">
				I have experience in JavaScript, React, NodeJs, MySql, MongoDb, MERN, PHP, HTML, CSS and more.
			</div>
			<div className="aboutPoints">
				<a href="https://www.bhemu.me/about" target="_blank" className="" rel="noreferrer">
					Click Here{" "}
				</a>
				To know more.
			</div>
		</div>
	);
}

export default AboutSettings;
