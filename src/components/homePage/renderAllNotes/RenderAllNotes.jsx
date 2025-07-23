// React import removed - not needed with JSX transform
import Loader from "../../loader/Loader";

import homePageSkeleton from "../../../img/homePageSkeleton.svg";
// import LockOpenIcon from '@mui/icons-material/LockOpenOutlined';
import LockIcon from "@mui/icons-material/Lock";

import "./renderAllNotes.css";

function RenderAllNotes({ userAllNotes, handleNoteOpening, isApiLoading, handleSearchNotes, searchQuery }) {
	const handleSearchChange = (e) => {
		handleSearchNotes(e.target.value);
	};

	return (
		<>
			<div id="addNotesInputBox">
				<input
					id="addNotesInput"
					name="searchNotes"
					autoComplete="off"
					type="text"
					placeholder="Search notes..."
					value={searchQuery}
					onChange={handleSearchChange}
				/>
			</div>
			<div id="renderNotes">
				<Loader isLoading={isApiLoading} />
				{userAllNotes.length === 0 && !isApiLoading && !searchQuery && (
					<div id="homePageSkeleton">
						<img src={homePageSkeleton} id="homePageSkeletonImg" alt="" />
						<div id="homePageSkeletonText">Create your first note !</div>
					</div>
				)}
				{userAllNotes.length === 0 && !isApiLoading && searchQuery && (
					<div id="homePageSkeleton">
						<div id="homePageSkeletonText">No notes found matching "{searchQuery}"</div>
					</div>
				)}
				{userAllNotes.map(function (item, index) {
					return (
						<div className="noteBox" key={index} onClick={() => handleNoteOpening(index, item)}>
							<div className="noteHeading">
								<div className="noteTitle">{item.noteTitle || "Note Title"}</div>
								{item?.isLocked && <LockIcon />}
							</div>
							<div className="noteContent">
								<div className="noteDisplay">
									{item.noteText?.split(item.noteTitle)[1]?.trim()
										? item.noteText?.split(item.noteTitle)[1]?.trim()
										: "Empty......."}
								</div>
							</div>
							<div className="date">
								<div>
									{new Date(item.updatedOn?.seconds * 1000).toLocaleString("en-US") !== "Invalid Date"
										? new Date(item.updatedOn?.seconds * 1000).toLocaleString("en-US", {
												hour: "2-digit",
												minute: "2-digit",
												hour12: true,
										  })
										: new Date().toLocaleString("en-US", {
												hour: "2-digit",
												minute: "2-digit",
												hour12: true,
										  })}
								</div>
								<div>
									{new Date(item.updatedOn?.seconds * 1000)?.toLocaleDateString("en-US") !==
									"Invalid Date"
										? new Date(item.updatedOn?.seconds * 1000)?.toLocaleDateString(undefined, {
												day: "2-digit",
												month: "long",
												year: "numeric",
										  })
										: new Date()?.toLocaleDateString(undefined, {
												day: "2-digit",
												month: "long",
												year: "numeric",
										  })}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default RenderAllNotes;
