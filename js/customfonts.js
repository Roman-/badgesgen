function onUploadFont() {
    var file = $('#fontUpId')[0].files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        applyFont(reader.result);
    }, false);

    if (file) {
        var nameAndExt = file.name.split('.');
        Global.customFont.name = "custom";
        Global.customFont.ext = nameAndExt[nameAndExt.length-1];
        reader.readAsDataURL(file);
        fontChanged();
    }
}

function applyFont(formatAndData) {
    Global.customFont.base64 = formatAndData.substr(formatAndData.indexOf(',') + 1);
    const fontName = "CustomFontFamily";
    var definition = "@font-face {font-family: "
                + fontName + "; src: url('" + formatAndData + "'); format('"+Global.customFont.ext+"');}";
    $("#fontDefinition").html(definition);
    Global.compNameLabel.css("font-family", fontName);
}
