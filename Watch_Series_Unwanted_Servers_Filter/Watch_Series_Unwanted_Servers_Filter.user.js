// ==UserScript==
// @name           Watch Series Unwanted Servers Filter
// @namespace      rob3c
// @description    Remove unwanted filters from Watch Series episode pages
// @include        http://watchseries.*/episode/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==


function removeBadServerLinks() {
	var badServers = [
	  'allmyvideos.net',
	  'altervideo.net',
	  'clicktoview.org',
  	'divxstage.eu',
  	'filebox.com',
  	'mixturecloud.com',
  	'muchshare.net',
  	'uploadc.com',
    'uploadc.com flv',
  	'uploadc.com mp4',
    'uploadc.com p4.',
    'veevr.com',
    'vidup.me'
	];   
	
	$('div.site').filter(function() {
  	return $.inArray($.trim($(this).html()), badServers) > -1;
	}).parent().parent().remove();
};


function wrapUpdatePage() {
  var originalUpdatePage = unsafeWindow.updatepage;
  
  unsafeWindow.updatepage = function (str, where) {
    var originalResult = originalUpdatePage(str, where);
    
    if (where === "show")
    {
      removeBadServerLinks();
    };
      
    return originalResult;
  };
};


$(document).ready(function() {
//  $('body').bind('click', function(e){ removeBadServerLinks(); });

  removeBadServerLinks();
  
  wrapUpdatePage();  
  
  var idStart = document.URL.lastIndexOf("-") + 1;
  var idLength = document.URL.lastIndexOf(".") - idStart;
  var episodeId = document.URL.substr(idStart, idLength);

  unsafeWindow.show_links(episodeId, 'all');
});
