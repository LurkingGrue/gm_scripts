// ==UserScript==
// @name           YouTube Auto Buffer & Auto HD & Remove Ads
// @namespace      userscripts.org
// @description    Buffers the video without autoplaying, removes in-video ads, and puts it in hd if the option is on. For Firefox and Opera
// @include        http://*.youtube.com/*
// @include        http://youtube.com/*
// @copyright      JoeSimmons
// @version        1.2.5
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @require        http://sizzlemctwizzle.com/updater.php?id=49366
// ==/UserScript==

var GM_config = {
 storage: 'GM_config', // This needs to be changed to something unique for localStorage
 init: function() {
        // loop through GM_config.init() arguements
	for(var i=0,l=arguments.length,arg; i<l; ++i) {
		arg=arguments[i];
		switch(typeof arg) {
            case 'object': for(var j in arg) { // could be a callback functions or settings object
							switch(j) {
							case "open": this.onOpen=arg[j]; delete arg[j]; break; // called when frame is gone
							case "close": this.onClose=arg[j]; delete arg[j]; break; // called when settings have been saved
							case "save": this.onSave=arg[j]; delete arg[j]; break; // store the settings objects
							default: var settings = arg;
							}
			} break;
            case 'function': this.onOpen = arg; break; // passing a bare function is set to open
                        // could be custom CSS or the title string
			case 'string': if(arg.indexOf('{')!=-1&&arg.indexOf('}')!=-1) var css = arg;
				else this.title = arg;
				break;
		}
	}
	if(!this.title) this.title = 'Settings - Anonymous Script'; // if title wasn't passed through init()
	var stored = this.read(), // read the stored settings
		passed_settings = {},
		passed_values = {};
	for (var i in settings) { // for each setting
            passed_settings[i] = settings[i];
			if(",save,open,close".indexOf(i) == -1) {
            // The code below translates to:
            // if a setting was passed to init but wasn't stored then 
            //      if a default value wasn't passed through init() then use null
            //      else use the default value passed through init()
            // else use the stored value
            var value = typeof stored[i] == "undefined" ? (typeof settings[i]['default'] == "undefined" ? null : settings[i]['default']) : stored[i];
            
            // If the value isn't stored and no default was passed through init()
            // try to predict a default value based on the type
            if (value === null) {
                switch(settings[i].type) {
                    case 'radio': case 'select':
                        value = settings[i].options[0]; break;
                    case 'checkbox':
                        value = false; break;
                    case 'int': case 'float':
                        value = 0; break;
                    default:
					value = (typeof stored[i]=="function") ? stored[i] : "";
                }
			}
            }
            passed_values[i] = value;
	}
	this.settings = passed_settings;
	this.values = passed_values;
	if (css) this.css.stylish = css;
 },
 open: function() {
 if(document.evaluate("//iframe[@id='GM_config']",document,null,9,null).singleNodeValue) return;
	// Create frame
	document.body.appendChild((GM_config.frame=GM_config.create('iframe',{id:'GM_config', style:'position:fixed; top:0; left:0; opacity:0; display:none; z-index:999; width:75%; height:75%; max-height:95%; max-width:95%; border:1px solid #000000; overflow:auto;'})));
        GM_config.frame.src = 'about:blank'; // In WebKit src can be set until it is added to the page
	GM_config.frame.addEventListener('load', function(){
		var obj = GM_config, frameBody = this.contentDocument.getElementsByTagName('body')[0], create=obj.create, settings=obj.settings;
		obj.frame.contentDocument.getElementsByTagName('head')[0].appendChild(obj.create('style',{type:'text/css',textContent:obj.css.basic+obj.css.stylish}));

		// Add header and title
		frameBody.appendChild(obj.create('div', {id:'header',className:'config_header block center', textContent:obj.title}));

		// Append elements
		var anch = frameBody, secNo = 0; // anchor to append elements
		for (var i in settings) {
			var type, field = settings[i], Options = field.options, label = field.label, value = obj.values[i];
			if (field.section) {
				anch = frameBody.appendChild(create('div', {className:'section_header_holder', kids:[
				  create('div', {className:'section_header center',innerHTML:field.section[0]})],
				  id:'section_'+secNo}));
				if(field.section[1]) anch.appendChild(create('p', {className:'section_desc center',innerHTML:field.section[1]}));
				secNo++;
			}
			switch(field.type) {
				case 'textarea':
					anch.appendChild(create('div', {title:field.title||'',kids:[
						create('span', {textContent:label, className:'field_label'}),
						create('textarea', {id:'field_'+i,innerHTML:value,cols:(field.cols?field.cols:20),rows:(field.rows?field.rows:2)})
					], className: 'config_var'}));
					break;
				case 'radio':
					var boxes = [];
					for (var j = 0,len = Options.length; j<len; j++) {
						boxes.push(create('span', {textContent:Options[j]}));
						boxes.push(create('input', {value:Options[j],type:'radio',name:i,checked:Options[j]==value?true:false}));
					}
					anch.appendChild(create('div', {title:field.title||'',kids:[
						create('span', {textContent:label, className:'field_label'}),
						create('div', {id:'field_'+i,kids:boxes})
					], className: 'config_var'}));
					break;
				case 'select':
					var options = new Array();
					for (var j in Options) options.push(create('option',{textContent:Options[j],value:j,selected:Options[j]==value?true:false}));
					anch.appendChild(create('div', {title:field.title||'',kids:[
						create('span', {textContent:label, className:'field_label'}),
						create('select',{id:'field_'+i,kids:options})
					], className: 'config_var'}));
					break;
				case 'checkbox':
					anch.appendChild(create('div', {title:field.title||'',kids:[
						create('label', {textContent:label, className:'field_label', "for":'field_'+i}),
						create('input', {id:'field_'+i,type:'checkbox',value:value,checked:value})
					], className: 'config_var'}));
					break;
				case 'button':
				var tmp;
					anch.appendChild(create('div', {kids:[
						(tmp=create('input', {id:'field_'+i,type:'button',value:label,size:(field.size?field.size:25),title:field.title||''}))
					], className: 'config_var'}));
					if(field.script) obj.addEvent(tmp, 'click', field.script);
					break;
				case 'hidden':
				anch.appendChild(create('div', {title:field.title||'',kids:[
						create('input', {id:'field_'+i,type:'hidden',value:value})
					], className: 'config_var'}));
					break;
				default:
					anch.appendChild(create('div', {title:field.title||'',kids:[
						create('span', {textContent:label, className:'field_label'}),
						create('input', {id:'field_'+i,type:'text',value:value,size:(field.size?field.size:25)})
					], className: 'config_var'}));
			}
		}

		// Add save and close buttons
		frameBody.appendChild(obj.create('div', {id:'buttons_holder', kids:[
			obj.create('button',{id:'saveBtn',textContent:'Save',title:'Save options and close window',className:'saveclose_buttons',onclick:function(){GM_config.close(true)}}),
			obj.create('button',{id:'cancelBtn', textContent:'Cancel',title:'Close window',className:'saveclose_buttons',onclick:function(){GM_config.close(false)}}),
			obj.create('div', {className:'reset_holder block', kids:[
			obj.create('a',{id:'resetLink',textContent:'Restore to default',href:'#',title:'Restore settings to default configuration',className:'reset',onclick:obj.reset})
		]})]}));

		obj.center(); // Show and center it
		window.addEventListener('resize', obj.center, false); // Center it on resize
		if (obj.onOpen) obj.onOpen(); // Call the open() callback function
		
		// Close frame on window close
		window.addEventListener('beforeunload', function(){GM_config.remove(this);}, false);
	}, false);
 },
 close: function(save) {
	if(save) {
		var type, fields = this.settings, isNum=/^[\d\.]+$/, typewhite=/radio|text|hidden|checkbox/;
		for(f in fields) {
			var field = GM_config.frame.contentDocument.getElementById('field_'+f);
			if(typewhite.test(field.type)) type=field.type;
				else type=field.tagName.toLowerCase();
			switch(type) {
				case 'text':
					this.values[f] = ((this.settings[f].type=='text') ? field.value : ((isNum.test(field.value) && ",int,float".indexOf(","+this.settings[f].type)!=-1) ? parseFloat(field.value) : false));
					if(this.values[f]===false) {
                                          alert('Invalid type for field: '+f+'\nPlease use type: '+this.settings[f].type);
                                          return;
                                        }
					break;
				case 'hidden':
					this.values[f] = field.value.toString();
					break;
				case 'textarea':
					this.values[f] = field.value;
					break;
				case 'checkbox':
					this.values[f] = field.checked;
					break;
				case 'select':
					this.values[f] = field[field.selectedIndex].value;
					break;
				case 'div':
					var radios = field.getElementsByTagName('input');
					if(radios.length>0) for(var i=radios.length-1; i>=0; i--) {
						if(radios[i].checked) this.values[f] = radios[i].value;
					}
					break;
			}
		}
                if(this.onSave) this.onSave(); // Call the save() callback function
                this.save();
	}
	if(GM_config.frame) this.remove(GM_config.frame);
	delete GM_config.frame;
        if(this.onClose) this.onClose(); //  Call the close() callback function
 },
 set: function(name,val) {
	this.values[name] = val;
 },
 get: function(name) {
	return this.values[name];
 },
 isGM: typeof GM_getValue != 'undefined' && typeof GM_getValue('a', 'b') != 'undefined',
 log: (this.isGM) ? GM_log : ((window.opera) ? opera.postError : console.log),
 save: function(store, obj) {
    try {
      var val = JSON.stringify(obj||this.values);
      (this.isGM?GM_setValue:(function(name,value){return localStorage.setItem(name,value)}))((store||this.storage),val);
    } catch(e) {
      this.log("GM_config failed to save settings!");
    }
 },
 read: function(store) {
    try {
      var val = (this.isGM?GM_getValue:(function(name,def){return localStorage.getItem(name)||def}))((store||this.storage), '{}'), rval;
      rval = JSON.parse(val);
    } catch(e) {
      this.log("GM_config failed to read saved settings!");
      rval = {};
    }
    return rval;
 },
 reset: function(e) {
	e.preventDefault();
	var type, obj = GM_config, fields = obj.settings;
	for(f in fields) {
		var field = obj.frame.contentDocument.getElementById('field_'+f);
		if(field.type=='radio'||field.type=='text'||field.type=='checkbox') type=field.type;
		else type=field.tagName.toLowerCase();
		switch(type) {
			case 'text':
				field.value = obj.settings[f]['default'] || '';
				break;
			case 'hidden':
				field.value = obj.settings[f]['default'] || '';
				break;
			case 'textarea':
				field.value = obj.settings[f]['default'] || '';
				break;
			case 'checkbox':
				field.checked = obj.settings[f]['default'] || false;
				break;
			case 'select':
				if(obj.settings[f]['default']) {
					for(var i=field.options.length-1; i>=0; i--)
					if(field.options[i].value==obj.settings[f]['default']) field.selectedIndex=i;
				}
				else field.selectedIndex=0;
				break;
			case 'div':
				var radios = field.getElementsByTagName('input');
				if(radios.length>0) for(var i=radios.length-1; i>=0; i--) {
					if(radios[i].value==obj.settings[f]['default']) radios[i].checked=true;
				}
				break;
		}
	}
 },
 values: {},
 settings: {},
 css: {
 basic: 'body {background:#FFFFFF;}\n' +
 '.indent40 {margin-left:40%;}\n' +
 '* {font-family: arial, tahoma, sans-serif, myriad pro;}\n' +
 '.field_label {font-weight:bold; font-size:12px; margin-right:6px;}\n' +
 '.block {display:block;}\n' +
 '.saveclose_buttons {\n' +
 'margin:16px 10px 10px 10px;\n' +
 'padding:2px 12px 2px 12px;\n' +
 '}\n' +
 '.reset, #buttons_holder, .reset a {text-align:right; color:#000000;}\n' +
 '.config_header {font-size:20pt; margin:0;}\n' +
 '.config_desc, .section_desc, .reset {font-size:9pt;}\n' +
 '.center {text-align:center;}\n' +
 '.section_header_holder {margin-top:8px;}\n' +
 '.config_var {margin:0 0 4px 0;}\n' +
 '.section_header {font-size:13pt; background:#414141; color:#FFFFFF; border:1px solid #000000; margin:0;}\n' +
 '.section_desc {font-size:9pt; background:#EFEFEF; color:#575757; border:1px solid #CCCCCC; margin:0 0 6px 0;}\n' +
 'input[type="radio"] {margin-right:8px;}',
 stylish: ''},
 create: function(a,b) {
	var ret=window.document.createElement(a);
	if(b) for(var prop in b) {
		if(prop.indexOf('on')==0) ret.addEventListener(prop.substring(2),b[prop],false);
		else if(prop=="kids" && (prop=b[prop])) for(var i=0; i<prop.length; i++) ret.appendChild(prop[i]);
		else if(",style,accesskey,id,name,src,href,for".indexOf(","+prop.toLowerCase())!=-1) ret.setAttribute(prop, b[prop]);
		else ret[prop]=b[prop];
	}
	return ret;
 },
 center: function() {
	var node = GM_config.frame, style = node.style, beforeOpacity = style.opacity;
	if(style.display=='none') style.opacity='0';
	style.display = '';
	style.top = Math.floor((window.innerHeight/2)-(node.offsetHeight/2)) + 'px';
	style.left = Math.floor((window.innerWidth/2)-(node.offsetWidth/2)) + 'px';
	style.opacity = '1';
 },
 run: function() {
    var script=this.getAttribute('script');
    if(script && typeof script=='string' && script!='') {
      func = new Function(script);
      setTimeout(func, 0);
    }
 },
 addEvent: function(el,ev,scr) { el.addEventListener(ev, function() { typeof scr == 'function' ? setTimeout(scr, 0) : eval(scr) }, false); },
 remove: function(el) { if(el && el.parentNode) el.parentNode.removeChild(el); }
};

// Allow opera to use the GM functions, but re-written (from TarquinWJ)
if(window.opera) {
GM_xmlhttpRequest = XMLHttpRequest;
GM_log = opera.postError;
window._content = window;
function GM_setValue( cookieName, cookieValue, lifeTime ) {
	if( !cookieName ) { return; }
	if( lifeTime == "delete" ) { lifeTime = -10; } else { lifeTime = 31536000; }
	document.cookie = escape( cookieName ) + "=" + escape( cookieValue ) +
		";expires=" + ( new Date( ( new Date() ).getTime() + ( 1000 * lifeTime ) ) ).toGMTString() + ";path=/";
}
function GM_getValue( cookieName, oDefault ) {
	var cookieJar = document.cookie.split( "; " );
	for( var x = 0; x < cookieJar.length; x++ ) {
		var oneCookie = cookieJar[x].split( "=" );
		if( oneCookie[0] == escape( cookieName ) ) {
			try {
				eval('var footm = '+unescape( oneCookie[1] ));
			} catch(e) { return oDefault; }
			return footm;
		}
	}
	return oDefault;
}
function GM_deleteValue( oKey ) {
	GM_setValue( oKey, '', 'delete' );
}
}

// Get ID
function $(ID,root) {return (root||document).getElementById(ID);}

// Created by avg, modified by JoeSimmons
function create(a,b,c) {
	if(a=="text") {return document.createTextNode(b);}
	var ret=document.createElement(a.toLowerCase());
	if(b) for(var prop in b) if(prop.indexOf("on")==0) ret.addEventListener(prop.substring(2),b[prop],false);
		else if(",style,accesskey,id,name,src,href".indexOf(","+prop.toLowerCase())!=-1) ret.setAttribute(prop.toLowerCase(), b[prop]);
		else ret[prop]=b[prop];
	if(c) for(var i=0,l=c.length; i<l; i++) ret.appendChild(c[i]);
	return ret;
}

// setVar by JoeSimmons
// Syntax: "autoplay=1&hq=0&ads=1".setVar("ads", "0").setVar("hq", "1");
String.prototype.setVar = function(q, v) {
var regex = new RegExp("([\&\?])?"+q+"=[^\&\#]*", "g");
return regex.test(this) ? this.replace(regex, "$1"+q+"="+v) : this+"&"+q+"="+v;
}

String.prototype.getPref = function(s, splitter) {
return this.split(s+"=")[1].split((splitter||"&"))[0];
};

var navID = "watch-headline-user-info";

function main(GM_config) {

if($(navID) && $("movie_player")) {
GM_config.init("YouTube Auto Buffer Options", {
autoPlay : {label:"Autoplay?", type:"checkbox", "default":true},
autoBuffer : {label:"Autobuffer?", type:"checkbox", "default":true},
autoHD : {label:"Auto HD", type:"checkbox", "default":true},
hideAds : {label:"Hide in-video ads?", type:"checkbox", "default":true},
hideAnnotations : {label:"Hide annotations?", type:"checkbox", "default":true}
}, "#config_header {font-size:16pt !important;} .config_var {margin-left:20% !important;} #header {margin-bottom:30px !important;} .indent40 {margin-left:20% !important;}", {
open : function(){ var frame=GM_config.frame; frame.style.height="50%";frame.style.width="50%"; GM_config.center(); }
});
$(navID).appendChild(create("button", { id: "watch-options", className: "yt-uix-button yt-uix-tooltip", type: "button", textContent: "Autobuffer Options", title: "Click here to set default Autobuffer options", onclick: GM_config.open }));

var mp = $("movie_player"),
	mpC = mp.cloneNode(true),
	regex = {
			ads:/[\&\?]?(ad_|infringe|invideo|watermark)([^=]*)?=[^\&]*/gi,
			begin_end:/(^[\&\?]*)|([\&\?]*$)/g
			},
	fmt_map = unescape(mpC.getAttribute("flashvars").getPref("fmt_map")),
	fv = mpC.getAttribute("flashvars").setVar("autoplay", (GM_config.get("autoPlay")&&!GM_config.get("autoBuffer")?"1":"0")).setVar("enablejsapi", "1").setVar("fs", "1").setVar("iv_load_policy", (GM_config.get("hideAnnotations")?"3":"1"));
switch(GM_config.get("autoHD").toString()) {
case "false": fv = fv.setVar("vq", "0"); break;
case "true": if(fmt_map.indexOf("37/4000000/9/0/115")!=-1) fv = fv.setVar("vq", "hd1080");
			else if(fmt_map.indexOf("22/2000000/9/0/115")!=-1) fv = fv.setVar("vq", "hd720");
			else if(fmt_map.indexOf("35/640000/9/0/115")!=-1 || fmt_map.indexOf("34/0/9/0/115")!=-1 || fmt_map.indexOf("18/512000/9/0/115")!=-1) fv = fv.setVar("vq", "2");
			else fv.setVar("vq", "0"); break;
}
if(GM_config.get("hideAds")) {fv = fv.replace(regex["ads"],"")+"&invideo=false";}
mpC.setAttribute("flashvars", fv.replace(regex["begin_end"],""));
mp.parentNode.replaceChild(mpC, mp);

if(GM_config.get("autoBuffer")) {
function onYouTubePlayerReady(playerId){
g_YouTubePlayerIsReady=true;
var player = document.getElementById("movie_player");
player.playVideo();
player.addEventListener("onStateChange","handleWatchPagePlayerStateChange");
player.addEventListener("onPlaybackQualityChange","onPlayerFormatChanged");
intv = window.setInterval(pauseOnStart, 50);
}
function onytplayerStateChange(){return true};
function pauseOnStart() {
if(document.getElementById("movie_player").getPlayerState()==1) {
window.clearTimeout(intv);
var pos=document.getElementById("pauseOnStart"); pos.parentNode.removeChild(pos);
var mp=document.getElementById("movie_player"), vol=mp.getVolume(), muted=mp.isMuted();
if(vol>0 && !muted) {mp.setVolume(0);}
window.setTimeout(function(mp, vol, muted){
mp.seekTo(0);
window.setTimeout(function(mp, vol, muted) {
document.getElementById("movie_player").pauseVideo();
window.setTimeout(function(mp, vol, muted) {if(vol>0 && !muted) {mp.setVolume(vol);}}, 100, mp, vol, muted);
}, 100, mp, vol, muted);
}, 2500, mp, vol, muted);
}
}
var head = document.getElementsByTagName("head")[0],
	aS = document.createElement("script");
if(!head) {return;}
aS.type = "text/javascript";
aS.id = "pauseOnStart";
try {aS.innerHTML = "var intv;\n"+onYouTubePlayerReady+"\n"+onytplayerStateChange+"\n"+pauseOnStart;}
catch(e) {aS.innerText = "var intv;\n"+onYouTubePlayerReady+"\n"+onytplayerStateChange+"\n"+pauseOnStart;}
head.appendChild(aS);
}
}

}

function waitForReady(GM_config) {
if($(navID) && $("movie_player")) {
window.clearInterval(intv);
main(GM_config);
}
sec++;
if(sec == 40) {
window.clearInterval(intv);
}
}

var intv=window.setInterval(waitForReady, 250, GM_config), sec=0;