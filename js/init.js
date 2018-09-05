$(document).ready(function() {
    // upload buttons
    $('#uploadImgBtn').click(function(){$("#bgFileId").trigger("click")});
    $('#imageBgPreview').click(function(){$("#bgFileId").trigger("click")});
    $('#bgFileId').change(onUploadImgChange);
    $('#uploadCsvBtn').click(function(){$("#csvFileId").trigger("click")});
    $('#csvFileId').change(onUploadCsvChange);
    $("#imageBgPreview").load(onBadgeWidthChange);
    $('#uploadFont').click(function(){$("#fontUpId").trigger("click")});
    $('#fontUpId').change(onUploadFont);

    // finish
    $('#finishPageSetup').click(onPageSetupDone);

    // setup layouts
    $('#generalSetupLay').show();
    $('#editLay').hide();
    $('#pdfLay').hide();

    // making label draggable
    Global.compNameLabel = $('#labelCompPreview').draggable();

    // label edit elements
    $('#namePreviewSelect').on('selectmenuchange',updateNamePreview);
    initNamesPreview();
    $("#labelTextColor").change(function() {
        Global.compNameLabel.css("color", $(this).val());
        Global.cnColor = $(this).val();
    }).trigger("change");
    $("#labelBold").change(function() {
        Global.cnFontWeight = this.checked?"bold":"normal";
        Global.compNameLabel.css("font-weight", Global.cnFontWeight);
    }).trigger("change");
    $("#labelMultiline").change(function() {
        Global.cnMultiline = this.checked;
        updateNamePreview();
    }).trigger("change");
    $("#labelCentered").change(function() {
        Global.cnCentered = this.checked;
        Global.compNameLabel.css("text-align",this.checked ? "center":"left");
    }).trigger("change");

    // generate pdf
    $("#generatePdfBtn").click(onGeneratePdfClick);

    // ui elements
    $("button").button();
    $(".bigButton").css({
       "background":"#55f",
       "font-size": "125%",
       "font-weight": "bold",
       "color": "white",
    });

    // spinners
    $('#badgePhysicalW').spinner({
        min: 1,
        max: 300,
        stop: function( event, ui ) { onBadgeWidthChange(); },
    }).spinner("stepUp").spinner("stepDown"); // trigger spinner CHANGE event

    $('#labelTextSize').spinner({
        min: 1,
        stop: function( event, ui ) {
            var val = $(this).spinner("value");
            Global.compNameLabel.css("font-size", val + "px");
            Global.cnSize = val;
        },
    }).spinner("stepUp").spinner("stepDown"); // trigger spinner CHANGE event

    $( "#controlGroup" ).controlgroup({
      "direction": "vertical"
    });

    // fonts setup
    Global.predefinedFonts.forEach(function(font) {
        $('#fontSelect').append($('<option>', {
            value: font,
            text: font.charAt(0).toUpperCase() + font.substr(1),
        }));
    });
    $('#fontSelect').append($('<option>', { value: 0, text: "custom..." }))
        .on('selectmenuchange',fontChanged).selectmenu("refresh");

    // trigger setup elements change on start
    fontChanged();
    showGenerateButton(true);

});

function fontChanged() {
    const val = $('#fontSelect').selectmenu("refresh").val();
    if (val == 0) { // custom
        // unmark "bold"
        $(".boldCb").prop('checked', false).change().hide();
        $("#controlGroup").controlgroup("refresh");
        $('#fontUpId').click(); // init font loading dialog
    } else { // existing
        Global.customFont.base64 = null;
        Global.customFont.name = val;
        Global.compNameLabel.css("font-family", $("#fontSelect").children("option").filter(":selected").text());
        $(".boldCb").show();
    }
}

function onUploadImgChange() {
    var file = $('#bgFileId')[0].files[0];
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
        $('#imageBgPreview')[0].src = reader.result;
        $('#bgImgName').html(file.name);
    }, false);
    if (file)
        reader.readAsDataURL(file);
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
            initNamesPreview();
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
    $("#infoDiv").html(info).effect( "highlight", {color: '#afa'}, 300 );;

    // saving settings
    Global.album = album;
    Global.badgeW = w;
    Global.badgeH = h;
    Global.badgeCols = album ? nWidthAlbum : nWidthPortrait;
    Global.badgeRows = album ? nHeightAlbum : nHeightPortrait;
}

function onPageSetupDone() {
    $('#generalSetupLay').hide();
    $('#editLay').show();
    $('#pdfLay').hide();
    $('#editImage').attr("src", $('#imageBgPreview')[0].src);
    locateLableInTheMid();
}

function initNamesPreview() {
    var select = $('#namePreviewSelect').find('option').remove().end();

    select.append($('<option>', { value: Global.compNameSample, text: Global.compNameSample, selected: true}));

    pickInterestingNames(Global.csvLines).forEach(function(name) {
        select.append($('<option>', { value: name, text: name }));
    });
}

function updateNamePreview() {
    // remember position before text changed
    var oldLeft = Global.compNameLabel.position().left,
        oldWidth = Global.compNameLabel.innerWidth();

    // change text
    Global.compNameLabel.html(compLabelPreviewText($("#namePreviewSelect").val(), $("#labelMultiline")[0].checked));

    // keep it in the same position
    if (Global.cnCentered)
        Global.compNameLabel.css("left", oldLeft + (oldWidth - Global.compNameLabel.innerWidth())/2);
}

function locateLableInTheMid() {
    var badge = $("#editImage");
    var badgePos = badge.position();
    var posTop = badgePos.top + (badge.innerHeight() - Global.compNameLabel.innerHeight())/2;
    var posLeft = badgePos.left + (badge.innerWidth() - Global.compNameLabel.innerWidth())/2;
    Global.compNameLabel.css({
        top: (posTop + 'px'),
        left: (posLeft + 'px')
    });
}

function onGeneratePdfClick() {
    showGenerateButton(false);
    setTimeout(function(){
        getDataUri($('#imageBgPreview')[0].src, onImageUriLoaded)
    }, 10);
}

function onImageUriLoaded(dataUri) {
    Global.imgDataUrl = dataUri;
    Global.labelRect = labelRect();

    generatePdf();

    showGenerateButton(true);
}

function showGenerateButton(v) {
    if (v)
        $("#generatePdfBtn").html("Generate PDF <span class='ui-icon ui-icon-arrowstop-1-s'></span>").prop('disabled', false);
    else
        $("#generatePdfBtn").html("Please wait...").attr("disabled", "disabled");
}

function labelRect() {
    var badge = $("#editImage");

    var badgePos = badge.position();
    var picHeight = badge.height();
    var picWidth = badge.width();

    var labelPos = Global.compNameLabel.position();
    var labelW = Global.compNameLabel.innerWidth();

    return {
            x: (labelPos.left - badgePos.left) * Global.badgeW / picWidth,
            y: (labelPos.top - badgePos.top) * Global.badgeH / picHeight,
            width: labelW * Global.badgeW / picWidth,
            height: Global.cnSize * Global.badgeH / picHeight
    };
}
