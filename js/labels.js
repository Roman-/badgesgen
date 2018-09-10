function createLabel(source) {
    var labelDiv = $("<div class='label'></div>").draggable();

    var result = {
        div: labelDiv,
        visible: true,
        size: 0,
        multiline: false,
        centered: false,
        fontWeight: "normal",
        color: null,
        rect: null,
        source: source,
        font: {
            base64: null, // uploaded font base64-encoded
            ext: "", // extention: otf, ttf or woff
            name: "" // font name
        }
    };
    return result;
}

function addLabel(source) {
    var l = createLabel(source);
    $("#labelsWrap").append(l.div);

    /////////////////////////  CONTROLS
    var controlGroup = $("<div class='controlGroup'></div>");

    function addControl(name, element) {
        var elId = randomString();
        var elLabel = $("<label for='"+elId+"'>"+name+" </label>");
        element.attr("id", elId).trigger("change");
        controlGroup.append(elLabel).append(element);
    }

    // show
    addControl("Visible", $("<input type='checkbox' checked/>").change(function() {
        l.visible = this.checked;
        changeVisibility(l.div, this.checked);
    }));

    // text size
    var sizeInput = $("<input value='"+Global.defaults[source].size+"'/>");
    addControl("Text size", sizeInput);
    sizeInput.spinner({
        min: 1,
        stop: function( event, ui ) {
            var val = $(this).spinner("value");
            l.div.css("font-size", val + "px");
            l.size = val;
        },
    }).spinner("stepUp").spinner("stepDown"); // trigger spinner CHANGE event

    // color
    addControl("Text color", $("<input type='color' value='"+Global.defaults[source].color+"'/>").change(function() {
        l.div.css("color", $(this).val());
        l.color = $(this).val();
    }));

    // bold
    var elControlBold = $("<input type='checkbox' "+(Global.defaults[source].bold?"checked":"")+"/>").change(function() {
        l.fontWeight = this.checked?"bold":"normal";
        l.div.css("font-weight", l.fontWeight);
    });
    addControl("Bold", elControlBold);

    // multiline (only for names)
    if (source == 'name')
        addControl("Multiline", $("<input type='checkbox' "+(Global.defaults[source].multiline?"checked":"")+"/>").change(function() {
            l.multiline = this.checked;
            updateLabelPreview(l)
        }));

    // centered
    addControl("Centered", $("<input type='checkbox' "+(Global.defaults[source].centered?"checked":"")+"/>").change(function() {
        l.centered = this.checked;
        l.div.css("text-align", this.checked ? "center":"left")
    }));

    // font
    var fontUpload = $("<input type='file' accept='.otf, .ttf' hidden/>").change(function() { onUploadFont(l, this) });
    var fontSelect = $("<select></select>");

    var fIndex = 0;
    Global.predefinedFonts.forEach(function(font) {
        fontSelect.append($('<option>', {
            value: font,
            text: font.charAt(0).toUpperCase() + font.substr(1),
            selected: (font == Global.defaults[source].fontName)
        }));
    });
    fontSelect.append($('<option>', { value: 0, text: "custom..." }));
    controlGroup.append(fontSelect);
    fontSelect.selectmenu().on('selectmenuchange',
            function () {fontChanged(l, fontSelect, fontUpload, elControlBold)})
        .selectmenu("refresh").trigger("selectmenuchange");


    /////////////////////////  ADD CONTROLS TO THE DIALOG INTERFACE
    controlGroup.controlgroup({ "direction": "vertical" });
    var accHeader = $("<h3>"+getLabelUiName(l)+"</h3>");
    $("#labelsMenuWrap").append(accHeader).append(controlGroup).accordion("refresh");
    l.div.click(function () {accHeader.trigger("click")});

    updateLabelPreview(l);
    locateLableInTheMid(l.div);
    Global.labels.push(l);
}

function fontChanged(l, fontSelect, fontUpload, elControlBold) {
    const val = fontSelect.selectmenu("refresh").val();
    var boldControls = $.extend({}, elControlBold, $("label[for='" + elControlBold.attr('id') + "']"));
    if (val == 0) { // custom font (don't allow to make it bold)
        // unmark "bold"
        elControlBold.prop('checked', false).trigger("change");
        boldControls.hide();
        fontUpload.click(); // init font loading dialog
    } else { // existing font
        l.font.base64 = null;
        l.font.name = val;
        l.div.css("font-family", fontSelect.children("option").filter(":selected").text());
        fontUpload.prop("value", "");
        boldControls.show();
    }
}

function updateLabelPreview(l) {
    // remember position before text changed
    var oldLeft = l.div.position().left,
        oldWidth = l.div.innerWidth();

    // change text
    l.div.html(compLabelPreviewText(getLabelPreview(l), l.multiline));

    // keep it in the same position
    if (l.centered)
        l.div.css("left", oldLeft + (oldWidth - l.div.innerWidth())/2);
}

function locateLableInTheMid(div) {
    var badge = $("#editImage");
    var badgePos = badge.offset();
    var posTop = (Global.labels.length == 0) ?
        badgePos.top + (badge.innerHeight() - div.innerHeight())/2 :
        Global.labels[Global.labels.length - 1].div.position().top + Global.labels[Global.labels.length - 1].div.innerHeight();
    var posLeft = badgePos.left + (badge.innerWidth() - div.innerWidth())/2;
    div.css({
        position:'absolute',
        top: posTop,
        left: posLeft,
    });
}

function getLabelText(csvItr, label) {
    switch(label.source) {
        case "name": return getCompetitorName(csvItr);
        case "country": return getCompetitorCountry(csvItr);
        case "wcaid": return getCompetitorWcaId(csvItr);;
        default: return "source undefined";
    }
}

function getLabelPreview(label) {
    switch(label.source) {
        case "name": return getCompetitorNamePreview(label);
        case "country": return "Country";
        case "wcaid": return "2012STRA02";
        default: return "(source undefined)";
    }
}

// Text next to the "settings" button
function getLabelUiName(label) {
    switch(label.source) {
        case "name": return "Name ";
        case "country": return "Country ";
        case "wcaid": return "WCA ID ";
        default: return "(source undefined) ";
    }
}
