// ==UserScript==
// @name        Movreel auto-clicker
// @namespace   rob3c
// @description Auto-click Free Download button on Movreel.com
// @include     *movreel.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==


// <input type="submit" value=" Free Download" style="height: 45px; width: 200px; font-weight: bold;" name="method_free">

$(document).ready(function() {
  var btn = $('input[name="method_free"]');
  if (btn) {
    btn.click();
  }
    
//    <img border="0" name="mysubmit" alt="Submit Query" src="http://movreel.com/images/divx_player.png">
  var playerImage = $('img[name="mysubmit"]');
  if (playerImage) {
    playerImage.parent('a').click();
  }
  
});
