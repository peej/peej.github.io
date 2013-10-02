/*
 * Javascript WYSIWYG HTML control
 * Version 0.2
 *
 * Copyright (c) 2004 Paul James
 * All rights reserved.
 *
 * This software is covered by the BSD License, please find a copy of this
 * license at http://peej.co.uk/sandbox/wysiwyg/
 */

// these are constants but IE doesn't like the const keyword
var WYSIWYG_VALUE_NONE = 0;
var WYSIWYG_VALUE_PROMPT = 1;
var WYSIWYG_VALUE_FUNCTION = 2;
var WYSIWYG_BUTTONS_AS_FORM_ELEMENTS = false;

// define toolbar buttons
if (!wysiwyg_toolbarButtons) {
    var wysiwyg_toolbarButtons = new Array(
        //command, display name, value, title, prompt/function, default text
        ["bold", "Strong", WYSIWYG_VALUE_NONE, "Give text strength"],
        ["italic", "Emphasis", WYSIWYG_VALUE_NONE, "Give text emphasis"],
        ["createlink", "Link", WYSIWYG_VALUE_PROMPT, "Create a hyperlink", "Enter the URL:", "http://"],
        ["unlink", "Unlink", WYSIWYG_VALUE_NONE, "Remove hyperlink"],
        ["insertimage", "Image", WYSIWYG_VALUE_PROMPT, "Insert an image", "Enter the URL of the image:", "http://"],
        ["inserthorizontalrule", "Rule", WYSIWYG_VALUE_NONE, "Insert horizontal rule"],
        ["div"], // place a toolbar divider
        ["formatblock", "Headling 1", "<H1>", "Make top level heading"],
        ["formatblock", "Headling 2", "<H2>", "Make 2nd level heading"],
        ["formatblock", "Headling 3", "<H3>", "Make 3rd level heading"],
        ["formatblock", "Paragraph", "<P>", "Make a paragraph"],
        ["formatblock", "Monospace", "<PRE>", "Make paragraph monospaced text"],
        ["insertunorderedlist", "List", null, "Make an unordered list"],
        ["insertorderedlist", "Ordered List", null, "Make an ordered list"],
        ["div"], // place a toolbar divider
        ["toggleview", "Source", "Compose", "Switch views"]
    );
}

// map control elements to desired elements
if (!wysiwyg_elementMap) {
    var wysiwyg_elementMap = new Array(
        //control regex, desired regex replacement
        [/<(B|b|STRONG)>(.*?)<\/\1>/gm, "<strong>$2</strong>"],
        [/<(I|i|EM)>(.*?)<\/\1>/gm, "<em>$2</em>"],
        [/<P>(.*?)<\/P>/gm, "<p>$1</p>"],
        [/<H1>(.*?)<\/H1>/gm, "<h1>$1</h1>"],
        [/<H2>(.*?)<\/H2>/gm, "<h2>$1</h2>"],
        [/<H3>(.*?)<\/H3>/gm, "<h3>$1</h3>"],
        [/<PRE>(.*?)<\/PRE>/gm, "<pre>$1</pre>"],
        [/<A (.*?)<\/A>/gm, "<a $1</a>"],
        [/<IMG (.*?)>/gm, "<img $1 alt=\"Image\" />"],
        [/<img (.*?)>/gm, "<img $1 />"], 
        [/<LI>(.*?)<\/LI>/gm, "<li>$1</li>"],
        [/<UL>(.*?)<\/UL>/gm, "<ul>$1</ul>"],
        [/<span style="font-weight: normal;">(.*?)<\/span>/gm, "$1"],
        [/<span style="font-weight: bold;">(.*?)<\/span>/gm, "<strong>$1</strong>"],
        [/<span style="font-style: italic;">(.*?)<\/span>/gm, "<em>$1</em>"],
        [/<span style="(font-weight: bold; ?|font-style: italic; ?){2}">(.*?)<\/span>/gm, "<strong><em>$2</em></strong>"],
        [/<([a-z]+) style="font-weight: normal;">(.*?)<\/\1>/gm, "<$1>$2</$1>"],
        [/<([a-z]+) style="font-weight: bold;">(.*?)<\/\1>/gm, "<$1><strong>$2</strong></$1>"],
        [/<([a-z]+) style="font-style: italic;">(.*?)<\/\1>/gm, "<$1><em>$2</em></$1>"],
        [/<([a-z]+) style="(font-weight: bold; ?|font-style: italic; ?){2}">(.*?)<\/\1>/gm, "<$1><strong><em>$3</em></strong></$1>"],
        [/<(br|BR)>/g, "<br />"],
        [/<(hr|HR)( style="width: 100%; height: 2px;")?>/g, "<hr />"]
    );
}

// attach to window onload event
if (document.getElementById && document.designMode) {
    if (window.addEventListener){
        window.addEventListener("load", wysiwyg, false);
    } else if (window.attachEvent){
        window.attachEvent("onload", wysiwyg);
    } else {
        alert("Could not attach event to window.");
    }
}
    
// init wysiwyg
function wysiwyg() {
    
    createWysiwygControls();
    setTimeout(initWysiwygControls, 1); // do this last and after a slight delay cos otherwise it can get turned off in Gecko
    
    // turn textareas into wysiwyg controls
    function createWysiwygControls() {
        var textareas = document.getElementsByTagName("textarea");
        for (var foo = 0; foo < textareas.length; foo++) {
            if (textareas[foo].className.indexOf("wysiwyg") > -1) {
                var wysiwyg = document.createElement("div");
                var control = document.createElement("iframe");
                var textarea = textareas[foo];
                wysiwyg.className = "wysiwyg";
                control.src = textarea.className.match(/[a-zA-Z0-9_.-]+\.html/);
                control.className = "";
                wysiwyg.appendChild(control);
                wysiwyg.control = control;
                textarea.style.display = "none";
                textarea.className = "";
                textarea.parentNode.replaceChild(wysiwyg, textareas[foo]);
                wysiwyg.appendChild(textarea);
                wysiwyg.textarea = textarea;
                createToolbar(wysiwyg);
            }
        }
    }
    
    // get controls from DOM
    function getWysiwygControls() {
        var divs = document.getElementsByTagName("div");
        var wysiwygs = new Array();
        for (var foo = 0, bar = 0; foo < divs.length; foo++) {
            if (divs[foo].className == "wysiwyg") {
                wysiwygs[bar] = divs[foo];
                bar++;
            }
        }
        return wysiwygs;
    }
    
    // initiate wysiwyg controls
    function initWysiwygControls() {
        var wysiwygs = getWysiwygControls();
        if (!wysiwygs[0]) return; // no wysiwygs needed
        if (!wysiwygs[0].control.contentWindow) { // if not loaded yet, wait and try again
            setTimeout(initWysiwygControls, 1);
            return;
        }
        for (var foo = 0; foo < wysiwygs.length; foo++) {
            // turn on design mode for wysiwyg controls
            wysiwygs[foo].control.contentWindow.document.designMode = "on";
            // attach submit method
            var element = wysiwygs[foo].control;
            while (element.tagName && element.tagName.toLowerCase() != "form") {
                if (!element.parentNode) break;
                element = element.parentNode;
            }
            if (element.tagName && element.tagName.toLowerCase() == "form" && !element.wysiAttached) {
                if (element.onsubmit) {
                    element.onsubmit = function() {
                        element.onsubmit();
                        wysiwygSubmit();
                    }
                } else {
                    element.wysiAttached = true;
                    element.onsubmit = wysiwygSubmit;
                }
            }
        }
        // schedule init of content (we do this due to IE)
        setTimeout(initContent, 1);
    }

    // set initial content    
    function initContent() {
        var wysiwygs = getWysiwygControls();
        for (var foo = 0; foo < wysiwygs.length; foo++) {
            wysiwygUpdate(wysiwygs[foo]);
        }
    }

    // create a toolbar for the control
    function createToolbar(wysiwyg) {
        var toolbar = document.createElement("div");
        var bar = 0;
        toolbar.className = "toolbar toolbar" + bar;
        for (var foo = 0; foo < wysiwyg_toolbarButtons.length; foo++) {
            if (wysiwyg_toolbarButtons[foo][0] == "toggleview") {
                var button = createButton(wysiwyg, foo);
                button.onclick = toggleView;
                button.htmlTitle = wysiwyg_toolbarButtons[foo][1];
                button.composeTitle = wysiwyg_toolbarButtons[foo][2];
                toolbar.appendChild(button);
            } else if (wysiwyg_toolbarButtons[foo].length >= 3) {
                var button = createButton(wysiwyg, foo);
                button.onclick = execCommand;
                toolbar.appendChild(button);
            } else if (wysiwyg_toolbarButtons[foo][0] == "div") {
                var divider = document.createElement("div");
                divider.className = "divider";
                toolbar.appendChild(divider);
            } else {
                bar++;
                wysiwyg.insertBefore(toolbar, wysiwyg.control);
                var toolbar = document.createElement("div");
                toolbar.className = "toolbar toolbar" + bar;
            }
        }
        wysiwyg.insertBefore(toolbar, wysiwyg.control);
    }
    
    // create a button for the toolbar
    function createButton(wysiwyg, number) {
        if (WYSIWYG_BUTTONS_AS_FORM_ELEMENTS) {
            var button = document.createElement("input");
            button.type = "button";
            button.value = wysiwyg_toolbarButtons[number][1];
        } else {
            if (document.all) { // IE needs the buttons to be anchors
                var button = document.createElement("a");
                button.href = "";
            } else {
                var button = document.createElement("span");
            }
            button.appendChild(document.createTextNode(wysiwyg_toolbarButtons[number][1]));
        }
        button.number = number;
        button.className = "toolbarButton toolbarButton" + number;
        button.command = wysiwyg_toolbarButtons[number][0];
        if (wysiwyg_toolbarButtons[number][2]) button.commandValue = wysiwyg_toolbarButtons[number][2];
        if (wysiwyg_toolbarButtons[number][3]) button.title = wysiwyg_toolbarButtons[number][3];
        button.wysiwyg = wysiwyg;
        return button;
    }
   
    // execute a toolbar command
    function execCommand() {
        var value = null;
        switch(this.commandValue) {
        case WYSIWYG_VALUE_NONE:
            value = null;
            break;
        case WYSIWYG_VALUE_PROMPT:
            if (wysiwyg_toolbarButtons[this.number][4]) var promptText = wysiwyg_toolbarButtons[this.number][4]; else var promptText = "";
            if (wysiwyg_toolbarButtons[this.number][5]) var defaultText = wysiwyg_toolbarButtons[this.number][5]; else var defaultText = "";
            var value = prompt(promptText, defaultText);
            if (!value) return false;
            break;
        case WYSIWYG_VALUE_FUNCTION:
        
        default:
            value = this.commandValue;
        }
        if (this.command instanceof Array) { // if command is array, execute all commands
            for (var foo = 0; foo < this.command.length; foo++) {
                if (this.command[foo] == "insertcontent") {
                    insertContent(this.wysiwyg, value);
                } else {
                    this.wysiwyg.control.contentWindow.document.execCommand(this.command[foo], false, value);
                }
            }
        } else {
            if (this.command == "insertcontent") {
                insertContent(this.wysiwyg, value);
            } else {
                this.wysiwyg.control.contentWindow.document.execCommand(this.command, false, value);
            }
        }
        textareaUpdate(this.wysiwyg);
        this.wysiwyg.control.contentWindow.focus();
        return false;
    }
    
    // insert HTML content into control
    function insertContent(wysiwyg, content) {
        var textarea = wysiwyg.textarea;
        var control = wysiwyg.control;
        if (document.selection) { // IE
            control.focus();
            sel = document.selection.createRange();
            sel.text = content;
        } else { // Mozilla
            var sel = control.contentWindow.getSelection();
            var range = sel.getRangeAt(0);
            sel.removeAllRanges();
            range.deleteContents();
            var oldContent = control.contentWindow.document.body.innerHTML;
            var inTag = false;
            var insertPos = 0;
            for (var foo = 0, pos = 0; foo < oldContent.length; foo++) {
                var aChar = oldContent.substr(foo, 1);
                if (aChar == "<") {
                    inTag = true;
                }
                if (!inTag) {
                    pos++;
                    if (pos == range.startOffset) {
                        insertPos = foo + 1;
                    }
                }
                if (aChar == ">") {
                    inTag = false;
                }
            }
            control.contentWindow.document.body.innerHTML = oldContent.substr(0, insertPos) + content + oldContent.substr(insertPos, oldContent.length);
        }
        textareaUpdate(wysiwyg);
    }
    
    // show textarea view
    function toggleView() {
        var control = this.wysiwyg.control;
        var textarea = this.wysiwyg.textarea;
        var toolbars = this.wysiwyg.getElementsByTagName("div");
        if (textarea.style.display == "none") {
            textareaUpdate(this.wysiwyg);
            control.style.display = "none";
            textarea.style.display = "block";
            for (var foo = 0; foo < toolbars.length; foo++) {
                for (var bar = 0; bar < toolbars[foo].childNodes.length; bar++) {
                    var button = toolbars[foo].childNodes[bar];
                    if (button.command != "toggleview") {
                        if (button.tagName != "DIV") button.disabled = true;
                        button.oldClick = button.onclick;
                        button.onclick = null;
                        button.oldClassName = button.className;
                        button.className += " disabled";
                    }
                }
            }
        } else {
            wysiwygUpdate(this.wysiwyg);
            textarea.style.display = "none";
            control.style.display = "block";
            control.contentWindow.document.designMode = "on";
            for (var foo = 0; foo < toolbars.length; foo++) {
                for (var bar = 0; bar < toolbars[foo].childNodes.length; bar++) {
                    var button = toolbars[foo].childNodes[bar];
                    if (button.command != "toggleview") {
                        if (button.tagName != "DIV") button.disabled = false;
                        if (button.oldClick) button.onclick = button.oldClick;
                        if (button.oldClassName) button.className = button.oldClassName;
                    }
                }
            }
        }
        return false;
    }
    
    // update the textarea to contain the source for the wysiwyg control
    function textareaUpdate(wysiwyg) {
        var html = wysiwyg.control.contentWindow.document.body.innerHTML;
        for (var foo = 0; foo < wysiwyg_elementMap.length; foo++) {
            html = html.replace(wysiwyg_elementMap[foo][0], wysiwyg_elementMap[foo][1]);
        }
        wysiwyg.textarea.value = html;
    }
    
    // update the wysiwyg to contain the source for the textarea control
    function wysiwygUpdate(wysiwyg) {
        wysiwyg.control.contentWindow.document.body.innerHTML = wysiwyg.textarea.value;
    }
    
    // update for upon submit
    function wysiwygSubmit() {
        var divs = this.getElementsByTagName("div");
        for (var foo = 0; foo < divs.length; foo++) {
            if (divs[foo].className == "wysiwyg") {
                textareaUpdate(divs[foo]);
            }
        }
    }

}
