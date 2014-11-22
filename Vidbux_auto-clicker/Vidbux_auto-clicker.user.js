// ==UserScript==
// @name           Vidbux auto-clicker
// @namespace      rob3c
// @description    Automatically click the human verification button
// @include        *180upload.com/*
// @include        *180upload.com/*
// @include        *movshare.net/video/*
// @include        *vidbux.com/*
// @include        *vidxden.com/*
// @include        *played.to/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

$(document).ready(function() {
//  if (!$("#flvplayer")) {
    var btn = $('input[value="Continue to Video"]');
    if (btn) {
//      alert("Continue to Video button exists!");
      btn.click();
    }
//  }
});
