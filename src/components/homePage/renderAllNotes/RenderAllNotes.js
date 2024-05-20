import React from 'react';
import Loader from '../../loader/Loader';

import homePageSkeleton from '../../../img/homePageSkeleton.svg';
// import LockOpenIcon from '@mui/icons-material/LockOpenOutlined';
import LockIcon from '@mui/icons-material/Lock';

import './renderAllNotes.css';

function RenderAllNotes({ userAllNotes, handleNoteOpening, isApiLoading, handleAddNewNote }) {
	return (
		<>
			<form id="addNotesInputBox" onSubmit={handleAddNewNote}>
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
				{userAllNotes.length === 0 && !isApiLoading && (
					<div id="homePageSkeleton">
						<img src={homePageSkeleton} id="homePageSkeletonImg" alt="" />
						<div id="homePageSkeletonText">Create your first note !</div>
					</div>
				)}
				{userAllNotes.map(function (item, index) {
					return (
						<div className="noteBox" key={index} onClick={() => handleNoteOpening(index, item)}>
							<div className="noteHeading">
								<div className="noteTitle">{item.noteTitle || 'Note Title'}</div>
								{item?.isLocked && <LockIcon />}
							</div>
							<div className="noteContent">
								<div className="noteDisplay">
									{item.noteText?.split(item.noteTitle)[1]?.trim()
										? item.noteText?.split(item.noteTitle)[1]?.trim()
										: 'Empty.......'}
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
										: new Date()?.toLocaleDateString(undefined, {
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
