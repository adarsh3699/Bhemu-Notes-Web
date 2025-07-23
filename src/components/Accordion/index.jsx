import { useRef, useEffect, useReducer, useState } from "react";
import "./accordion.css";

// Reducer for accordion state management
function accordionReducer(state, action) {
	switch (action.type) {
		case "toggle":
			return { ...state, isOpen: !state.isOpen };
		case "show":
			return { ...state, isOpen: true };
		case "hide":
			return { ...state, isOpen: false };
		default:
			return state;
	}
}

export function Accordion({ title = "Accordion Title", show = false, children }) {
	const contentRef = useRef(null);
	const [state, dispatch] = useReducer(accordionReducer, { isOpen: show });
	const [accordionId] = useState(() => `accordion-${Math.random().toString(36).substring(2, 9)}`);

	// Effect to handle the show prop changes
	useEffect(() => {
		if (show) {
			dispatch({ type: "show" });
		}
	}, [show]);

	const handleToggle = () => {
		dispatch({ type: "toggle" });
	};

	const contentStyle = {
		height: state.isOpen ? (contentRef.current ? contentRef.current.scrollHeight : "auto") : 0,
		transition: "height 0.5s ease",
		overflow: "hidden",
	};

	return (
		<div className="accordion-item">
			<h2 className="accordion-header" id={`heading-${accordionId}`}>
				<button
					className={`accordion-button${state.isOpen ? "" : " collapsed"}`}
					type="button"
					aria-expanded={state.isOpen}
					aria-controls={`collapse-${accordionId}`}
					onClick={handleToggle}
				>
					{title}
				</button>
			</h2>
			<div
				id={`collapse-${accordionId}`}
				className="accordion-collapse"
				aria-labelledby={`heading-${accordionId}`}
				style={contentStyle}
			>
				<div className="accordion-body" ref={contentRef}>
					{children || "House of Bhemu"}
				</div>
			</div>
		</div>
	);
}
