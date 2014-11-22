// ==UserScript==
// @name           Follow Free link on FileNuke
// @namespace      rob3c
// @description    Auto-click the Free link on FileNuke.com
// @include        http://www.filenuke.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

$(document).ready(function() {
  $(".btn-big2-2").click();
  $("#player_img").find('a').click();
});
