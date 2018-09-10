// Global variables
function Global() { }

// page setup
Global.csvLines = csvFileExampleShort.split(/\r\n|\r|\n/); // csv file
Global.imgDataUrl = null; // Badge image URI
Global.album = false; // orientation: album(true) or portrait(false)
Global.badgeW = 0;    // badge physical width in millimeters
Global.badgeH = 0;    // badge physical height in millimeters
Global.badgeCols = 0; // how many badge to fit in page horisontally
Global.badgeRows = 0; // how many badge to fit in page vertically

// competition label setup
Global.labels = [];
Global.compNameSample = "Firstname Lastname"; // default competitor name line

Global.predefinedFonts = ["helvetica", "courier", "times"];
Global.lineHeightProportion = 1.15; // default for JSPdf TODO add to settings
var LayoutsEnum = Object.freeze({"set":1, "edit":2, "pdf":3});

// default settings for labels
Global.defaults = {
    name : {
        size: 45,
        multiline: true,
        centered: true,
        bold: true,
        color: "#000000",
        fontName: "helvetica"
    },
    country : {
        size: 35,
        multiline: false,
        centered: true,
        bold: false,
        color: "#000044",
        fontName: "times"
    },
    wcaid : {
        size: 25,
        multiline: false,
        centered: false,
        bold: false,
        color: "#000011",
        fontName: "courier"
    }
};
