$(document).ready(function() {
    // upload buttons
    $('#uploadImgBtn').click(function(){$("#bgFileId").trigger("click")});
    $('#imageBgPreview').click(function(){$("#bgFileId").trigger("click")});
    $('#bgFileId').change(onUploadImgChange);
    $('#uploadCsvBtn').click(function(){$("#csvFileId").trigger("click")});
    $('#csvFileId').change(onUploadCsvChange);
    $("#imageBgPreview").load(function() {onBadgeWidthChange();
        setEnabled($("#finishPageSetup"), true, "Done");});
    $('#uploadFont').click(function(){$("#fontUpId").trigger("click")});

    // finish
    $('#finishPageSetup').click(onPageSetupDone);

    // setup layouts
    setLayout(LayoutsEnum.set);

    // buttons
    $("#generatePdfBtn").click(onGeneratePdfClick);
    $("#backToEditor").click(function() {setLayout(LayoutsEnum.edit)});
    $("#backToPageSet").click(function() {setLayout(LayoutsEnum.set)});
    $("button").button().css({ "border": "1px solid blue"});
    setEnabled($("#generatePdfBtn"), true, "Generate PDF <span class='ui-icon ui-icon-circle-check'></span>");
    setEnabled($("#finishPageSetup"), $("#imageBgPreview").complete, "Done");


    // spinners
    $('#badgePhysicalW').spinner({
        min: 1,
        max: 300,
        stop: function( event, ui ) { onBadgeWidthChange(); },
    }).width($("#uploadCsvBtn").width());


    // test
   //setTimeout(function() {$("#finishPageSetup").trigger("click");}, 10);
   // handle
    window.onerror = function(errorMessage, errorUrl, errorLine) {
        alert("msg: " + errorMessage + ", " + errorLine+ ", " + errorUrl);
    }
});


function onUploadImgChange() {
    var file = $('#bgFileId')[0].files[0];
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
        $('#imageBgPreview')[0].src = reader.result;
        $('#editImage')[0].src = reader.result;
        $('#bgImgName').html(file.name);
    }, false);
    if (file) {
        setEnabled($("#finishPageSetup"), false);
        reader.readAsDataURL(file);
    }
}

function onUploadCsvChange(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.addEventListener("load", function () {
        var str = reader.result;
        if (validateCsv(str)) {
            // save
            Global.csvLines = reader.result.split(/\r\n|\r|\n/);
            $('#compCsvName').html(file.name);
            $('#compCsvInfo').html((Global.csvLines.length-1) + " competitors");
        } else {
            $('#compCsvName').html("not valid");
            $('#compCsvInfo').html();
        }
    }, false);

    var file = input.files[0];
    if (file)
        reader.readAsText(file);
    else
        $('#compCsvName').html("no file");
}

function onBadgeWidthChange() {
    var w = parseInt($("#badgePhysicalW").spinner( "value" ));
    var previewImg = $("#imageBgPreview");
    var imgW = previewImg.innerWidth()
    var imgH = previewImg.innerHeight()
    var h = Math.floor(w*imgH/imgW);
    const a4paperWidth = 210;
    const a4paperHeight = 297;

    // calculating how many we can fit in a paper
    const nWidthPortrait = Math.floor(a4paperWidth/w);
    const nHeightPortrait = Math.floor(a4paperHeight/h);
    const nWidthAlbum = Math.floor(a4paperHeight/w);
    const nHeightAlbum = Math.floor(a4paperWidth/h);

    const totalPortrait = (nWidthPortrait * nHeightPortrait);
    const totalAlbum = (nWidthAlbum * nHeightAlbum);

    const album = (totalAlbum > totalPortrait);
    const mathString = album ?
        nWidthAlbum + "x" + nHeightAlbum + " = <b>" + (nWidthAlbum * nHeightAlbum) + "</b>" :
        nWidthPortrait + "x" + nHeightPortrait + " = <b>" + (nWidthPortrait * nHeightPortrait) + "</b>";
    const orientString = (album?"album":"portrait");
    var info = "";
    info += "Your badges are <b>" + w + "mm x " + h + "mm</b>.<br>";
    info += "We can place " + mathString + " badges on the <b>A4</b> sheet in <b>" + orientString + "</b> orientation.";
    $("#infoDiv").html(info).effect( "highlight", {color: '#afa'}, 300 );

    // saving settings
    Global.album = album;
    Global.badgeW = w;
    Global.badgeH = h;
    Global.badgeCols = album ? nWidthAlbum : nWidthPortrait;
    Global.badgeRows = album ? nHeightAlbum : nHeightPortrait;
}

function onPageSetupDone() {
    $("#labelsMenuWrap").accordion({ active: false, collapsible: true });
    setLayout(LayoutsEnum.edit);
    $('#editImage').attr("src", $('#imageBgPreview')[0].src).load(function(){
        if (Global.labels.length == 0)
            ["name", "country", "wcaid"].forEach(function(source) {addLabel(source)});
    });
    // label edit elements
    initNamesPreview();
    $('#namePreviewSelect').selectmenu().unbind('selectmenuchange').on('selectmenuchange', updateNamePreview).trigger("selectmenuchange").selectmenu("refresh");
}

function initNamesPreview() {
    var select = $('#namePreviewSelect').find('option').remove().end();

    select.append($('<option>', { value: Global.compNameSample, text: Global.compNameSample, selected: true}));

    pickInterestingNames(Global.csvLines).forEach(function(name) {
        select.append($('<option>', { value: name, text: name }));
    });
}

function updateNamePreview() {
    Global.labels.forEach(function(label) {
        if (label.source == "name") {
            // remember position before text changed
            var oldLeft = label.div.position().left,
                oldWidth = label.div.innerWidth();

            // change text
            label.div.html(getCompetitorNamePreview(label));

            // keep it in the same position
            if (label.centered)
                label.div.css("left", oldLeft + (oldWidth - label.div.innerWidth())/2);
        }
    });
}

function getCompetitorNamePreview(label) {
    return compLabelPreviewText($("#namePreviewSelect").val(), label.multiline);
}

function onGeneratePdfClick() {
    setEnabled($("#generatePdfBtn"), false, "Generate PDF <span class='ui-icon ui-icon-circle-check'></span>");
    setTimeout(function(){
        getDataUri($('#imageBgPreview')[0].src, onImageUriLoaded)
    }, 10);
}

function onImageUriLoaded(dataUri) {
    Global.imgDataUrl = dataUri;
    // load rects for all labels
    Global.labels.forEach(function(label) {
        label.rect = labelRect(label);
    });

    generatePdf();

    setEnabled($("#generatePdfBtn"), true, "Generate PDF <span class='ui-icon ui-icon-circle-check'></span>");
}

// returns rect: {x,y,w,h}
// x,y: label X and Y positions in millimeters, from top-left corner of the badge
function labelRect(label) {
    var badge = $("#editImage");

    var badgePos = badge.offset();
    var picHeight = badge.height();
    var picWidth = badge.width();

    var labelPos = label.div.offset();
    var labelW = label.div.innerWidth();

    return {
            x: (labelPos.left - badgePos.left) * Global.badgeW / picWidth,
            y: (labelPos.top - badgePos.top) * Global.badgeH / picHeight,
            width: labelW * Global.badgeW / picWidth,
            height: label.size * Global.badgeH / picHeight
    };
}

function setLayout(lay) {
    changeVisibility($('#generalSetupLay'), (lay == LayoutsEnum.set));
    changeVisibility($('#editLay'), (lay == LayoutsEnum.edit));
    changeVisibility($('#pdfLay'), (lay == LayoutsEnum.pdf));
}
