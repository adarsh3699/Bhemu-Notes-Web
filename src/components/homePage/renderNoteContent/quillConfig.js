// Quill configuration constants
// Modules object for setting up the Quill editor
export const modules = {
	clipboard: {
		matchVisual: false,
	},
	toolbar: {
		container: "#toolbar",
		handlers: {
			// undo: undoChange,
			// redo: redoChange,
		},
	},
	history: {
		delay: 500,
		maxStack: 100,
		userOnly: true,
	},
};

// Formats objects for setting up the Quill editor
export const formats = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"underline",
	"align",
	"strike",
	"script",
	"blockquote",
	"background",
	"list",
	"indent",
	"link",
	"image",
	"video",
	"color",
	"code-block",
];
