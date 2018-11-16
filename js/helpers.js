function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
        canvas.getContext('2d').drawImage(this, 0, 0);
        callback(canvas.toDataURL('image/jpeg').replace(/[\s"\\]/gm,""));
    };

    image.src = url;
}

function compLabelPreviewText(text, split) {
    if (split)
        text = text.replace(' ', '<br>'); // split after first space
    return text.replace(/\s/gm,"&nbsp;"); // prevent next lines split
}

// returns TRUE if competition csv file is valid
function validateCsv(csv) {
    return csv.startsWith("Status,Name,Country,WCA ID");
}

function validateCsvLine(l) {
    const minLength = 10; // amount of commas
    return ((l.length > minLength) && (l.indexOf("Status,Name") == -1));
}
function extractCsvLines(s) {
    var result = [];
    var arr = s.split(/\r\n|\r|\n/);
    arr.forEach(function(line) {
        if (validateCsvLine(line)) {// not first and not empty
            result.push(line);
            console.log("pushing: " + line);
        }
    });
    return result;
}

// Returns competitor name from Global.csv by index without local name in parantheses;
// Returns empty string for empty badges if index is too high
function getCompetitorName(index) {
    var compName = (index >= Global.csvLines.length || Global.csvLines[index].indexOf(',') == -1)
        ? "(undefined)" : Global.csvLines[index].split(",")[1];
    if (compName.indexOf(' (') != -1)
        compName = compName.split(' (')[0];
    return compName;
}

function getCompetitorCountry(index) {
    return (index >= Global.csvLines.length || Global.csvLines[index].indexOf(',') == -1)
        ? "(undefined)" : Global.csvLines[index].split(",")[2];
}

function getCompetitorWcaId(index) {
    var wcaId = (index >= Global.csvLines.length || Global.csvLines[index].indexOf(',') == -1)
        ? "(undefined)" : Global.csvLines[index].split(",")[3];
    return (wcaId.length == 0) ? stringForNoWcaId() : wcaId;
}

function pickInterestingNames(csvLines) {
    // interesting name: shortest, longest, biggest amount of splits, longest 1st name, longest lastname
    result = [
        getCompetitorName(1), // 0 longest name+surname
        getCompetitorName(1), // 1 shortest name+surname
        getCompetitorName(1), // 2 longest name
        getCompetitorName(1), // 3 longest surname
    ];

    for (var i = 1; i < csvLines.length; i++) {
        var n = getCompetitorName(i);
        if (n.trim() != "") {
            var nameParts = splitInTwo(n);
            if (n.length > result[0].length)
                result[0] = n;
            if (n.length < result[1].length)
                result[1] = n;
            if (nameParts[0].length > splitInTwo(result[2])[0].length)
                result[2] = n;
            if (nameParts[1].length > splitInTwo(result[3])[1].length)
                result[3] = n;
        }
    }
    return removeDuplicates(result);
}

function removeDuplicates(arr) {
    var uniques = [];
    $.each(arr, function(i, el){
        if($.inArray(el, uniques) === -1) uniques.push(el);
    });
    return uniques;
}

// given a string with one or more spaces, it returns an array [part before first space, part after first space]
function splitInTwo(n) {
    const spaceIndex = n.indexOf(' ');
    return [n.substring(0, spaceIndex), n.substring(spaceIndex)];
}

function randomString() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '_').substr(1, 6);
}

function changeVisibility(obj, visible) {
    return visible ? obj.show() : obj.hide();
}

// string that appears instead of WCA ID if the competitor doesn't have one TODO specify in settings
function stringForNoWcaId() {
    return "";
    //return "newcomer";
}

// set element (button) enabled or disabled
function setEnabled(element, enabled, defaultHtml = "OK") {
    element.html(enabled ? defaultHtml : "Please wait...");
    if (enabled)
        element.prop('disabled', false);
    else
        element.attr("disabled", "disabled");
}

