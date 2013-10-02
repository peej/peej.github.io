
var HTMLOverlayDebug = false;

function HTMLOverlayInit() {

    var oldOnload = window.onload;
    if (typeof window.onload != "function") {
        window.onload = HTMLOverlay;
    } else {
        window.onload = function() {
            oldOnload();
            HTMLOverlay();
        }
    }

}

function HTMLOverlayGetRequestObject() {
    var requestObj = false;
/*@cc_on @*/
/*@if (@_jscript_version >= 5)
    try {
        requestObj = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            requestObj = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            requestObj = false;
        }
    }
@else
    requestObj = false;
@end @*/
    if (!requestObj && typeof XMLHttpRequest != "undefined") {
      requestObj = new XMLHttpRequest();
    }
    return requestObj;
}

HTMLOverlayInit();

function HTMLOverlay() {
    var links = document.getElementsByTagName("link");
    for (var foo = 0; foo < links.length; foo++) {
        if (links[foo].getAttribute("rel").toLowerCase() == "overlay") {
            HTMLOverlayApply(links[foo].getAttribute("href"));
        }
    }
}

function HTMLOverlayApply(url) {
    if (HTMLOverlayDebug) alert("Applying overlay \"" + url + "\"");
    var requestObj = HTMLOverlayGetRequestObject();
    if (requestObj) {
        requestObj.open("GET", url, true);
        requestObj.onreadystatechange = HTMLOverlayProcess;
        requestObj.send(null);
    }

    function HTMLOverlayProcess() {
        if (requestObj.readyState == 4) {
            var overlay = requestObj.responseText;
            var regexString = "<overlay id=\"([a-z0-9_-]+?)\">((.|\n|\r)+?)</overlay>";
            var regex = new RegExp(regexString, "gim");
            var overlays = overlay.match(regex);

            if (overlays) {
                for (var foo = 0; foo < overlays.length; foo++) {
                    var regex = new RegExp(regexString, "im");
                    var match = overlays[foo].match(regex);
                    var id = match[1];
                    var content = match[2];
                    
                    var element = document.getElementById(id);
                    if (element == null) {
                        alert("HTML Overlay Error: Could not find element for overlay #" + id);
                    } else {
                        
                        var c;
                        if (c = content.match(/<([a-z0-9]+) ?.*? append=".+?" ?.*?>(.|\n|\r)*?<\/\1>/im)) {
                            if (HTMLOverlayDebug) alert("Appending content \"" + c[0] + "\"");
                            content = content.replace(c[0], "");
                            element.innerHTML = element.innerHTML + c[0].replace(/ append=".+?"/, "");;
                        }
                        if (c = content.match(/<([a-z0-9]+) ?.*? prepend=".+?" ?.*?>(.|\n|\r)*?<\/\1>/im)) {
                            if (HTMLOverlayDebug) alert("Prepending content \"" + c[0] + "\"");
                            content = content.replace(c[0], "");
                            element.innerHTML = c[0].replace(/ prepend=".+?"/, "") + element.innerHTML;
                        }
                        if (c = content.match(/<([a-z0-9]+) ?.*? replace=".+?" ?.*?>(.|\n|\r)*?<\/\1>/im)) {
                            if (HTMLOverlayDebug) alert("Replacing in content \"" + c[0] + "\"");
                            content = content.replace(c[0], "");
                            element.innerHTML = c[0].replace(/ replace=".+?"/, "");
                        }
                        if (content.length > 0) { // append the rest
                            if (HTMLOverlayDebug) alert("Appending content \"" + content + "\"");
                            element.innerHTML += content;
                        }
                    }        
                }
            } else {
                alert("HTML Overlay Error: No overlays found in \"" + url + "\"");
            }
        }   
    }
    
}

