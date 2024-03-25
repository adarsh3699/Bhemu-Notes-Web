import React from 'react';
import Loader from '../../Loader';

import homePageSkeleton from '../../../img/homePageSkeleton.svg';

import './renderAllNotes.css';

function RenderAllNotes({
	allNotes,
	handleNoteOpening,
	isApiLoading,
	handleAddNewNote,
	handleMsgShown,
	isShareNoteType,
}) {
	return (
		<>
			<form
				id="addNotesInputBox"
				onSubmit={
					isShareNoteType
						? (e) => {
								e.preventDefault();
								handleMsgShown('Please create a account to create own notes', 'warning');
						  }
						: handleAddNewNote
				}
			>
				<input
					id="addNotesInput"
					name="noteTitle"
					autoComplete="off"
					type="text"
					placeholder="Take a note..."
				/>
			</form>
			<div id="renderNotes">
				<Loader isLoading={isApiLoading} />
				{allNotes.length === 0 && !isApiLoading && (
					<div id="homePageSkeleton">
						<img src={homePageSkeleton} id="homePageSkeletonImg" alt="" />
						<div id="homePageSkeletonText">Create your first note !</div>
					</div>
				)}
				{allNotes.map(function (item, index) {
					return (
						<div className="noteBox" key={index} onClick={() => handleNoteOpening(index, item)}>
							<div className="noteTitle">{item.noteTitle}</div>
							<div className="noteContent">
								<div>
									{!item.noteText?.trim() ? 'Empty.......' : item.noteText.split(item.noteTitle)[1]}
								</div>
							</div>
							<div className="date">
								<div>
									{new Date(item.updatedOn?.seconds * 1000).toLocaleString('en-US') !== 'Invalid Date'
										? new Date(item.updatedOn?.seconds * 1000).toLocaleString('en-US', {
												hour: '2-digit',
												minute: '2-digit',
												hour12: true,
										  })
										: new Date().toLocaleString('en-US', {
												hour: '2-digit',
												minute: '2-digit',
												hour12: true,
										  })}
								</div>
								<div>
									{new Date(item.updatedOn?.seconds * 1000)?.toLocaleDateString('en-US') !==
									'Invalid Date'
										? new Date(item.updatedOn?.seconds * 1000)?.toLocaleDateString(undefined, {
												day: '2-digit',
												month: 'long',
												year: 'numeric',
										  })
										: new Date()?.toLocaleDateString('en-US', {
												day: '2-digit',
												month: 'long',
												year: 'numeric',
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
