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

function compLabelPreviewText(name, split) {
    return split ? name.replace(' ', '<br>') : name; // only replace first space making exactly 2 lines
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
    return compName;
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

