function onUploadFont() {
    var file = $('#fontUpId')[0].files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        applyFont(reader.result);
    }, false);

    if (file) {
        var nameAndExt = file.name.split('.');
        if (nameAndExt.length == 2) {
            Global.customFont.name = nameAndExt[0]
            Global.customFont.ext = nameAndExt[1]
            reader.readAsDataURL(file);
            fontChanged();
        } else {
            console.error("font file incorrect");
        }
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
