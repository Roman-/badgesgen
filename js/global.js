// Global variables
function Global() { }

// page setup
Global.csvLines = extractCsvLines(csvFileExampleShort); // csv file
Global.imgDataUrl = null; // Badge image URI
Global.album = false; // orientation: album(true) or portrait(false)
Global.badgeW = 0;    // badge physical width in millimeters
Global.badgeH = 0;    // badge physical height in millimeters
Global.badgeCols = 0; // how many badge to fit in page horisontally
Global.badgeRows = 0; // how many badge to fit in page vertically
Global.badgeExtraPages = 0; // how many extra pages with empty badges to print
Global.pt2mm = 25.4 / 72; // point to millimeter ratio
Global.labelPositions = [205, 332, 470, 0]; // label default positions (top)

// competition label setup
Global.labels = [];
Global.compNameSample = "Firstname Lastname"; // default competitor name line

Global.predefinedFonts = ["helvetica", "courier", "times"];
Global.lineHeightProportion = 1.15; // default for JSPdf TODO add to settings
var LayoutsEnum = Object.freeze({"set":1, "edit":2, "pdf":3});

// default settings for labels
Global.defaults = {
    name : {
        visible: true,
        size: 45,
        multiline: true,
        centered: true,
        bold: true,
        color: "#ffffff",
        fontName: "helvetica"
    },
    country : {
        visible: true,
        size: 33,
        multiline: false,
        centered: true,
        bold: true,
        color: "#ffffff",
        fontName: "helvetica"
    },
    wcaid : {
        visible: false,
        size: 25,
        multiline: false,
        centered: false,
        bold: false,
        color: "#ffffff",
        fontName: "courier"
    }
};
