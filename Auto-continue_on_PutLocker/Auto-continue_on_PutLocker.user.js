// ==UserScript==
// @name           Auto-continue on PutLocker
// @namespace      rob3c
// @description    Auto-click continue button on PutLocker videos
// @include        *.putlocker.com/file/*
// @include        *.sockshare.com/file/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

//if ($('.video_player') && $('.play_button')) {
//  alert('video_player.html=' + $('video_player').html());
//  $('.play_button').find('a').click();
//} else {
//  $('#submitButton').val('Continue as Free User').removeAttr('disabled').click();
//  delay(3000);
//  $('#submitButton').click();
//}

//var submitCounter = 0;

function tryFormSubmit() {
//  submitCounter++;
//  $('.ad_728x90_top').html('Waiting to submit form...' + submitCounter);
  $('#submitButton').click();
}

function tryPlayButtonClick() {
  $('.play_button').find('a').click();
}


window.setTimeout(tryFormSubmit, 3500);  
window.setTimeout(tryPlayButtonClick, 1000);