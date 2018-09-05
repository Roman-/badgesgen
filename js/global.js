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
Global.compNameLabel = null; // JQuery instance for draggable label
Global.cnSize = 0; // Competitor Name font size
Global.cnMultiline = false; // Competitor name and surname on separate lines
Global.cnCentered = true; // Competitor Name centered or left justified
Global.cnFontWeight = "normal"; // Competitor Name font weight ("bold" or "normal")
Global.cnColor = null; // Competitor Name color
Global.labelRect = null; // label positions and size info
Global.compNameSample = "Firstname Lastname"; // default competitor name line

// customFonts
Global.customFont = {
    base64: null, // uploaded font base64-encoded
    ext: "", // extention: otf, ttf or woff
    name: "" // font name
}

Global.predefinedFonts = ["helvetica", "courier", "times"];
