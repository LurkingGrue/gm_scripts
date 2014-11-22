// ==UserScript==
// @name        Uncheck games other than 3-cushion on Kozoom videos
// @namespace   rob3c
// @include     http://www.kozoom.com/en/billiard-carom/videos.html
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @version     1
// ==/UserScript==

$(document).ready(function() {
  // 3-Cushion
//    $("#filter_game_game_2").click();

  // 1-Cushion
  $("#filter_game_game_6").click();

  // Balk-Line 47/2
  $("#filter_game_game_3").click();

  // Balk-Line 47/1
  $("#filter_game_game_4").click();

  // Balk-Line 71/2
  $("#filter_game_game_5").click();

  // Carom Series
  $("#filter_game_game_22").click();

  // Artistic
  $("#filter_game_game_9").click();

  // Free game
  $("#filter_game_game_8").click();

//  $('h2:contains("Sort by table"').find('button.ok').click();
});
