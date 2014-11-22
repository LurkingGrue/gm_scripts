// ==UserScript==
// @name           Auto-continue VidHuge
// @namespace      rob3c
// @description    Auto-click the continue button on VidHuge
// @include        *www.vidhuge.com/*
// @include        *www.vidbull.com/*
// @include        *vodlocker.com/*
// @include        *faststream.in/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

var submitStatusDiv = $('<div id="submitStatus">FUNKY NIBLETS</div>');
$('div.mblock1-bottom').append(submitStatusDiv);

var submitCounter = 0;

function tryFormSubmit() {
  if (($('#btn_download').attr('disabled') === false)) {
    $('#btn_download').click();
  } else {
    submitCounter++;
    submitStatusDiv.html('Waiting to submit form...' + submitCounter + ' (btn_download.disabled=' + $('#btn_download').attr('disabled') + ')');
  }
}

if($('#btn_download'))
{
  window.setInterval(tryFormSubmit, 1000);  
}
