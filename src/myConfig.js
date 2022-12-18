module.exports = {
	focusAnimationDuration: 0.75,
	collapsible: false,
	directed: true,
	focusZoom: 1,
	freezeAllDragEvents: false,
	highlightDegree: 2,
	highlightOpacity: 0.2,
	linkHighlightBehavior: true,
	maxZoom: 2,
	minZoom: 0.2,
	nodeHighlightBehavior: true,
	panAndZoom: false,
	staticGraph: false,
	initialZoom: 0.2,
	staticGraphWithDragAndDrop: false,
	width: window.innerWidth - 450,
	height: window.innerHeight,
	d3: {
		alphaTarget: 0.05,
		gravity: -400,
		linkLength: 300,
		linkStrength: 1,
		disableLinkForce: false,
	},
	node: {
		color: "#d3d3d3",
		fontColor: "black",
		fontSize: 10,
		fontWeight: "normal",
		highlightColor: "red",
		highlightFontSize: 14,
		highlightFontWeight: "bold",
		highlightStrokeColor: "red",
		highlightStrokeWidth: 1.5,
		labelPosition: "",
		mouseCursor: "crosshair",
		opacity: 0.9,
		renderLabel: false,
		strokeColor: "none",
		strokeWidth: 1.5,
		svg: "https://icons.iconarchive.com/icons/sicons/basic-round-social/256/yandex-icon.png",
		symbolType: "circle",
		viewGenerator: null
	},
	link: {
		color: "black",
		fontColor: "black",
		fontSize: 8,
		fontWeight: "normal",
		highlightColor: "red",
		highlightFontSize: 8,
		highlightFontWeight: "normal",
		labelProperty: "label",
		mouseCursor: "pointer",
		opacity: 1,
		renderLabel: false,
		semanticStrokeWidth: true,
		strokeWidth: 3,
		markerHeight: 6,
		markerWidth: 6,
		strokeDasharray: 0,
		strokeDashoffset: 0,
		strokeLinecap: "butt"
	}
};