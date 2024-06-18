import React, { useState, useCallback } from 'react';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './exportDialog.css';

function ExportDialog({ quillRef, noteTitle, handleMsgShown, toggleExportDialog, sx }) {
	const [exportTitle, setExportTitle] = useState(noteTitle || 'Untitled Note');
	const [scale, setScale] = useState(20);
	const [quality, setQuality] = useState(100);
	const [isExportBtnLoading, setIsExportBtnLoading] = useState(false);

	const exportAsPDF = useCallback(async () => {
		const editorElement = quillRef.current?.editor?.container;
		if (!editorElement) {
			return handleMsgShown('Nothing to export as PDF', 'warning');
		}
		setIsExportBtnLoading(true);
		// Temporarily expand the editor container to fit all content
		editorElement.classList.add('disable_height');

		try {
			// Create the canvas with the expanded editor
			const canvas = await html2canvas(editorElement, {
				backgroundColor: 'rgb(30, 30, 30)',
				scale: scale <= 1 ? 0.1 : scale >= 100 ? 10 : scale / 10, // Increase scale for better quality
			});

			// Restore the original height
			editorElement.classList.remove('disable_height');

			const imgData = canvas.toDataURL('image/jpeg', quality <= 10 ? 0.1 : quality >= 100 ? 1 : quality / 100); // Use JPEG for smaller size (compression)
			const pdf = new jsPDF('p', 'mm', 'a4');
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();

			const imgProps = pdf.getImageProperties(imgData);
			const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

			let position = 0;
			while (position < imgHeight) {
				pdf.setFillColor(30, 30, 30);
				pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
				pdf.addImage(imgData, 'JPEG', 0, position ? -position : 0, pdfWidth, imgHeight);
				position += pdfHeight;
				if (position < imgHeight) {
					pdf.addPage();
				}
			}

			pdf.save(`${exportTitle}.pdf`);
			setIsExportBtnLoading(false);
			handleMsgShown('PDF exported successfully', 'success');
		} catch (error) {
			// Restore the original height in case of error
			editorElement.classList.remove('disable_height');
			setIsExportBtnLoading(false);
			handleMsgShown('Error exporting PDF', 'error');
			console.error('Error exporting PDF:', error);
		}
	}, [quillRef, handleMsgShown, scale, quality, exportTitle]);

	// console.log(scale <= 1 ? 0.1 : scale >= 100 ? 10 : scale / 10);
	return (
		<div className="dialogBoxBg">
			<div className="dialogBox" style={sx}>
				<div className="dialogBoxNavBar">
					<div className="dialogBoxTitle">Export Note</div>
					<Button
						size="small"
						sx={{ color: '#2894d1' }}
						onClick={toggleExportDialog}
						startIcon={<ArrowBackIcon />}
					>
						Back
					</Button>
				</div>
				{/* <div className="dialogBoxMessage">Export note as PDF</div> */}
				<div className="dialogTitle_2">Name</div>

				<input
					type="text"
					placeholder="Name"
					className="dialogInputFullSize"
					value={exportTitle}
					onChange={(e) => setExportTitle(e.target.value)}
				/>
				<div className="dialogSubContainer">
					<div className="exportFormatContainer">
						<label htmlFor="exportFormatSelect" className="lableTitle">
							Format
						</label>
						<select className="exportSelect" id="exportFormatSelect">
							<option value="pdfOnly">PDF Only (Recommended)</option>
							<option value="pdfStyled">PDF (With Style)</option>
							<option value="word">Word (.docx)</option>
						</select>
					</div>
					<div className="exportTitle_Input">
						<div className="lableTitle">Scale:</div>
						<input
							type="number"
							placeholder="Scale"
							className=""
							value={scale}
							onChange={(e) => setScale(Number(e.target.value))}
						/>
					</div>
					<Slider
						value={scale}
						valueLabelDisplay="auto"
						onChange={(e) => setScale(e.target.value)}
						aria-labelledby="input-slider"
					/>
					{/* <span>Note higher scale may delay the export process.</span> */}

					<div className="exportTitle_Input">
						<div className="lableTitle">Quality</div>
						<input
							type="number"
							placeholder="Quality"
							className=""
							value={quality}
							onChange={(e) => setQuality(Number(e.target.value))}
						/>
					</div>
					<Slider
						value={quality}
						valueLabelDisplay="auto"
						onChange={(e) => setQuality(e.target.value)}
						min={10}
						aria-labelledby="input-slider"
					/>

					<div className="dailog2BtnsFlex">
						<Button
							variant="contained"
							color="error"
							onClick={toggleExportDialog}
							sx={{ my: 2, mr: 2, width: '50%' }}
						>
							Close
						</Button>
						<Button
							variant="contained"
							onClick={exportAsPDF}
							color="success"
							disabled={isExportBtnLoading}
							sx={{ my: 2, width: '50%' }}
						>
							{isExportBtnLoading ? <CircularProgress color="success" size={30} /> : ' Export'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ExportDialog;
