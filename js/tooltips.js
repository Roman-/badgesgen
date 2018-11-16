var pageSetupDescr = " This tool will help you to make badges (nametags) for your WCA competition.<br> Any questions/ideas/suggestions: please post in <a href='https://www.speedsolving.com/forum/threads/badges-generator.70946/'>this thread</a>.";
var helpMsgs = {
    "help-bgimg" : "Background image for your badge. IMPORTANT: the image proportions should match the proportions of your insert (the piece of paper that fits in your nametag case)",
    "help-csvfile" : "Your competition .csv file from the WCA containing approved registrations. If you just want to play around with the tool, do not upload anything - the default csv file example is already here!",
    "help-sizemm" : "Measure the physical size of your insert in millimeters. Enter width here; height will be calculated based on your background image",
    "help-empty": "Add extra empty badges to your PDF. If competitors can register in place, you may want to have empty badges printed for them.",
};

$(document).ready(function() {
    $("#description").html(pageSetupDescr);
    $(".help").attr("src", "img/help.png").attr("alt", "?").each(function () {
        $(this).attr('title', helpMsgs[$(this).attr('id')]);
    }).tooltip({
      show: {
        duration: 200,
        delay: 0
      }
    });
});


