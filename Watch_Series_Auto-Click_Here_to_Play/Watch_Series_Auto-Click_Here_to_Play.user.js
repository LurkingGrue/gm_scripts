// ==UserScript==
// @name           Watch Series Auto-Click Here to Play
// @namespace      rob3c
// @description    Automatically click the Click Here to Play button
// @include        http://watchseries.*/open/cale/*.html
// @include        http://watchseries.*/open/cale/*/idepisod/*.html
// @exclude        http://watchseries.*/open/cale/*/idepisod/undefined
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

$(document).ready(function() {
  window.location.href = $('a.myButton').attr('href');
});
