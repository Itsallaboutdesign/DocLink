$(document).ready(function(){
    $('.parallax').parallax();
    $('select').material_select();
    $('.tooltipped').tooltip({delay:20});
    $('.scrollspy').scrollSpy();
    $('.dropdown-button').dropdown({
       inDuration: 300,
       outDuration: 225,
       constrain_width: false, // Does not change width of dropdown to that of the activator
       hover: true, // Activate on hover
       gutter: 0, // Spacing from edge
       belowOrigin: false, // Displays dropdown below the button
       alignment: 'left' // Displays dropdown with edge aligned to the left of button
     }
   );
    heightToWidth();
});

$(window).ready(heightToWidth());
$(window).resize(function(){
    heightToWidth();
});

function heightToWidth(){
    var rw = $('.rounded').width();
    $('.rounded').attr('style','height:'+rw+'px');
    var ow = $('.outline').width();
    $('.outline').attr('style','height:'+ow+'px');
    var sw = $('.squared').width();
    $('.squared').attr('style','height:'+sw+'px');
    var biw = $('.blockImage').width();
    $('.blockImage').attr('style','height:'+biw+'px');
}
