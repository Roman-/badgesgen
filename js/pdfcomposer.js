function generatePdf() {
    const orientation = Global.album ? 'landscape' : 'portrait';

    var doc = new jsPDF(orientation, 'mm', "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // left-top corner of the page to start drawing
    var x0 = (pageWidth - Global.badgeW * Global.badgeCols) / 2;
    var y0 = (pageHeight - Global.badgeH * Global.badgeRows) / 2;

    // add all fonts in use to VFS
    Global.labels.forEach(function(label) {
        if (label.font.base64 != null) {
            var nameAndExt = label.font.name + '.' + label.font.ext;
            doc.addFileToVFS(nameAndExt, label.font.base64);
            doc.addFont(nameAndExt, label.font.name, 'normal');
        }
    });

    for (var csvItr = 0; csvItr < Global.csvLines.length; ) {
        for (var j = 0; j < Global.badgeRows; j++) {
            for (var i = 0; i < Global.badgeCols; i++) {
                csvItr++;
                // TODO improve name split for long names
                //var compName = getCompetitorName(csvItr);

                var x = x0 + i * Global.badgeW;
                var y = y0 + j * Global.badgeH;

                doc.addImage(Global.imgDataUrl, 'image/jpeg', x, y, Global.badgeW, Global.badgeH);

                Global.labels.forEach(function(label) {
                    if (label.visible && csvItr < Global.csvLines.length)
                        drawLabel(doc, label, x, y, csvItr);
                });
//return terminatePdf(doc); // TODO TEST
            }
        }
        if (csvItr < Global.csvLines.length)
            doc.addPage();
    }
    // Output as Data URI
    terminatePdf(doc);
}

function drawLabel(doc, label, x, y, csvItr) {
    doc.setFont(label.font.name);
    doc.setTextColor(label.color).setFontType(label.font.fontWeight);
    var labelText = getLabelText(csvItr, label)
    var lineNumber = 0, spaceIndex = labelText.indexOf(' ');
    var parts = (label.multiline && (spaceIndex != -1)) ?
        [labelText.substring(0, spaceIndex), labelText.substring(spaceIndex+1)] :
        [labelText];
    parts.forEach(function(namePart) {
        drawTextInRect(
            doc, namePart, label.centered,
            x + label.rect.x,
            y + label.rect.y + label.rect.height + (lineNumber++) * (label.rect.height + Global.lineHeightProportion),
            label.rect.width,
            label.rect.height);
    });
}

function terminatePdf(doc) {
    var pdfDataAttr = doc.output('datauristring');
    $('#pdfFrame').attr('src', pdfDataAttr);
    $('#donwloadPdf').unbind('click').click(function() {doc.save("Badges.pdf")});
    // test
    setLayout(LayoutsEnum.pdf);
}

function drawTextInRect(doc, text, centered, x, y, rectWidth, rectHeight) {
    // adjust Text size based on rectWidth
    var pt2mm = 25.4 / 72;
    var textSize = rectHeight / pt2mm;
    doc.setFontSize(textSize);

    var realTextWidth = doc.getStringUnitWidth(text) * textSize * pt2mm;

    if (centered)
        x -= (realTextWidth - rectWidth)/2;

    doc.text(x, y ,text);
}
