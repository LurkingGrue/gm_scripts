// ==UserScript==
// @name           zSHARE timer skip
// @namespace      rob3c
// @description    Adds direct link to skip the zSHARE download timer
// @include        http://www.zshare.net/download/*
// ==/UserScript==

window.status="Rob is cool!";

var linkRegEx = new RegExp("'(h','t','t','p'.*)'\\);");

var linkArrayText = linkRegEx.exec(document.body.innerHTML)[0].split("','");

var directDownloadLink = linkArrayText.join('');

directDownloadLink = directDownloadLink.substring(1,directDownloadLink.length-3);

window.status=directDownloadLink;

var dl_element = document.getElementById("download");
//If this is not the image button at http://www.zshare.com/images/download.gif
if (dl_element.type != 'hidden')
{
	var html_to_add = document.createElement("a");
	html_to_add.setAttribute("href",directDownloadLink);
	html_to_add.innerHTML = "<center><b>CLICK TO SKIP TIMER</b></center>";
	var daddy = dl_element.parentNode;
	daddy.appendChild(html_to_add);
}