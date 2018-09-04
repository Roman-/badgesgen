function generatePdf() {
    const lineHeightProportion = 1.15; // default for JSPdf
    const orientation = Global.album ? 'landscape' : 'portrait';

    var doc = new jsPDF(orientation, 'mm', "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // left-top corner of the page to start drawing
    var x0 = (pageWidth - Global.badgeW * Global.badgeCols) / 2;
    var y0 = (pageHeight - Global.badgeH * Global.badgeRows) / 2;

    if (Global.customFont.base64 != null) {
        var nameAndExt = Global.customFont.name + '.' + Global.customFont.ext;
        const fontType = 'normal';
        doc.addFileToVFS(nameAndExt, Global.customFont.base64);
        doc.addFont(nameAndExt, Global.customFont.name, fontType);
        doc.setFont(Global.customFont.name);
    } else {
        // one of default font families
        doc.setFont(Global.customFont.name);
    }
    doc.setTextColor(Global.cnColor).setFontType(Global.cnFontWeight);

    for (var csvItr = 0; csvItr < Global.csvLines.length; ) {
        for (var j = 0; j < Global.badgeRows; j++) {
            for (var i = 0; i < Global.badgeCols; i++) {
                csvItr++;
                // TODO improve name split for long names
                var compName = getCompetitorName(csvItr);

                var x = x0 + i * Global.badgeW;
                var y = y0 + j * Global.badgeH;
                var y_pic = y0 + (j) * Global.badgeH;

                doc.addImage(Global.imgDataUrl, 'image/jpeg', x, y_pic, Global.badgeW, Global.badgeH);

                // draw competitor name line-by-line
                var lineNumber = 0;
                compName.split("\n").forEach(function(namePart) {
                    drawTextInRect(doc, namePart,
                            x + Global.labelRect.x,
                            y + Global.labelRect.y + Global.labelRect.height + (lineNumber++) * (Global.labelRect.height + lineHeightProportion),
                            Global.labelRect.width,
                            Global.labelRect.height);
                });
            }
        }
        if (csvItr < Global.csvLines.length)
            doc.addPage();
    }
    // Output as Data URI
    terminatePdf(doc);
}

function terminatePdf(doc) {
    var pdfDataAttr = doc.output('datauristring');
    $('iframe').attr('src', pdfDataAttr);
    doc.save("Badges.pdf");
}

function drawTextInRect(doc, text, x, y, rectWidth, rectHeight) {
    // adjust Text size based on rectWidth
    var pt2mm = 25.4 / 72;
    var textSize = rectHeight / pt2mm;
    doc.setFontSize(textSize);

    var realTextWidth = doc.getStringUnitWidth(text) * textSize * pt2mm;

    if (Global.cnCentered)
        x -= (realTextWidth - rectWidth)/2;

    doc.text(x, y ,text);
}
