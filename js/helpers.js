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

function compLabelPreviewText(split) {
    const baseLine = "Firstname LastnameLong";
    return split ? baseLine.replace(" ", "<br>"):baseLine;
}

// returns TRUE if competition csv file is valid
function validateCsv(csv) {
    return csv.startsWith("Status,Name,Country,WCA ID");
}

// Returns competitor name from Global.csv by index without local name in parantheses;
// Returns empty string for empty badges if index is too high
function getCompetitorName(index) {
    var compName = (index >= Global.csvLines.length || index < 1 || Global.csvLines[index].indexOf(',') == -1)
        ? "" : Global.csvLines[index].split(",")[1];
    if (compName.indexOf(' (') != -1)
        compName = compName.split(' (')[0];
    if (Global.cnMultiline) {
        while (compName.indexOf(' ') != -1)
            compName = compName.replace(" ", "\n");
    }
    return compName;
}
