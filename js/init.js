$(document).ready(function(){
    $('.parallax').parallax();
    $('select').material_select();
    $('.tooltipped').tooltip({delay:20});
    $('.scrollspy').scrollSpy();
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
