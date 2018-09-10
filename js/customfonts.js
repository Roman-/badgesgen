function onUploadFont(l, uploader) {
    var file = uploader.files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        applyFont(l, reader.result);
    }, false);

    if (file) {
        var nameAndExt = file.name.split('.');
        l.font.name = nameAndExt[0];
        l.font.ext = nameAndExt[nameAndExt.length-1];
        reader.readAsDataURL(file);
    }
}

function applyFont(l, formatAndData) {
    l.font.base64 = formatAndData.substr(formatAndData.indexOf(',') + 1);
    var definition = "@font-face {font-family: "
                + l.font.name + "; src: url('" + formatAndData + "'); format('"+l.font.ext+"');}";
    var styleId = "fontDef" + l.font.name;
    if ($("#" + styleId).length == 0) {
        // we haven't defined this font earlier
        var style = $("<style></style>").attr('id', styleId).html(definition);
        $("#stylesWrap").append(style);
    }
    l.div.css("font-family", l.font.name);
}
