// ==UserScript==
// @name           Continue Button Countdown Bypass
// @namespace      rob3c
// @description    Bypass continue button countdowns on GorillaVid-like sites
// @include        *daclips.in/*
// @include        *gorillavid.in/*
// @include        *movpod.in/*
// @include        *vreer.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

//if($('#cxc')) {
//  alert('countdown value is ' + $('#cxc').text());
//}

var submitCounter = 0;

function tryFormSubmit() {
  var btnDownloadSpan = $('#btn_download_span.btn-big');
  
  if (btnDownloadSpan) {
//    alert('found btn_download_span with class btn-big :)');
    var freeDownloadForm = btnDownloadSpan.parents('form');
    if (freeDownloadForm) {
//    alert('found free download form :)');
      freeDownloadForm.submit();
    } else {
//      alert('did NOT find free download form :(');
      $('#content').find('form').submit();
    }
  } else {
    submitCounter++;
    $('#head_title').html('Waiting to submit form...' + submitCounter);
  }
}

if($('#btn_download_span'))
{
// eliminate the annoying clickbank popup ad
  document.onclick = null;

// THIS COMMENTED-OUT CODE DOES ENABLE THE BUTTON AND 
// SUBMIT THE FORM, BUT THE SERVER REJECTS IT AS 
// SKIPPING THE COUNTDOWN. THAT'S WHY WE HAVE TO JUST
// CHECK EVERY SECOND UNTIL THE BUTTON IS ENABLED.
//
//  alert($('#btn_download_span').html());
//  $('#btn_download_span').attr('class', 'btn-big');
//  $('#btn_download').disabled = false;
//  $('#countdown_str').css('display', 'none');
//  $('#load_img').css('visibility', 'hidden');
//  $('#head_title').html('Click button below to proceed...');
//    $('#content').find('form').submit();
  
  window.setInterval(tryFormSubmit, 1000);  
}
