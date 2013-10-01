---
layout: article
title: XMLHttpRequest, REST and the Rich User Experience
date: Oct 23, 2004
---

Over the last few years Javascript has come of age. Gone are the
inconsistent browser implementations, so not only is CSS mature enough
to be used seriously, but so is Javascript. And now with the major
browsers all supporting the XMLHttpRequest object, we can create a
truely interactive interface to our web applications.

Using a combination of Javascript with the XMLHttpRequest object, a
server side language like PHP and [REST](/articles/rest) to do the
talking in between, we can add dynamic elements to otherwise clumsy HTML
forms.

Using the XMLHttpRequest Object
-------------------------------

XMLHttpRequest is a Microsoft addition to IE5+ that was cloned by the
Mozilla Project and now by Apple for Safari and Opera (at the time of
writing support in Safari and Opera are new and incomplete, but this
should improve with time). It allows Javascript to send a HTTP request,
but unlike using an Image object, the XMLHttpRequest object allows you
to receive and process the response, it will even parse out an XML
response for you (thus the XML in XMLHttpRequest, although any response
file type will do).

Creating and using the object is easy. Depending on whether the client
is using IE with ActiveX or a standards compliant browser, there are
different ways of instantiating the object, so this function wraps the
process up into an easy to call package:

    function getHTTPObject() {
        if (typeof XMLHttpRequest != 'undefined') {
            return new XMLHttpRequest();
        } try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
        return false;
    }

**Note:** This is an updated version of my original Javascript as
written by [Simon
Willison](http://simon.incutio.com/archive/2006/06/25/fjax).

Then it's just a case of setting the objects properties and letting it
go:

    var http = getHTTPObject();
    http.open("GET", "http://example.org/test.txt", true);
    http.onreadystatechange = function() {
        if (http.readyState == 4) {
            doSomethingWith(http.responseText);
        }
    }
    input.http.send(null);

And Now the REST
----------------

There are a couple of XML based RPC formats available and suitable for
sending information to our Javascript (XML-RPC, SOAP), however they are
all large, bloated and don't use HTTP as it was designed. REST on the
other hand is small, simple and a proven technology, and perfect for
linking our Javascript with our serverside functions.

1.  Since we're getting information from our server, we use our
    XMLHttpRequest object to issue a HTTP GET request to the URL of our
    serverside script.
2.  The script extracts request data from the URL querystring and
    processes the request responding with a plain text formatted file,
    or as a simple XML document.
3.  Our XMLHttpRequest object receives the response and parses out the
    data into Javascript variables. Our client has it's new data without
    the HTML page (the browser or the user) having to issue a separate
    HTTP request.

Obviously a new HTTP request has happened, but it has occured
transparently in the background without our HTML page changing, allowing
us to manipulate our pages DOM with the information received without
having to do a full round trip to the server (and thus refreshing the
page).

An Example
----------

Time for an example. Lets say we have a HTML form that collects a users
address, a usual form for an e-commerce system. Now to make our form
more user friendly we'd like to allow the user to enter their postal
code and get their address automatically entered into the form.

In the past this would have required a round trip to the server,
reposting form data and refreshing the page (or using a popup window and
some Javascript), but using the XMLHttpRequest object we can do it all
transparently to the user.

So first we need our form, here's a quick XHTML file:

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
        <head>
            <title>Your details</title>
            <script type="text/javascript" src="address_from_postcode.js"></script>
        </head>
        <body>
            <form method="post" action="process.php">
                <fieldset class="address">
                    <input type="text" name="address[postcode]" class="postcode" />
                    <input type="button" value="Lookup address" class="lookup" />
                    <textarea class="address"></textarea>
                </fieldset>
                <fieldset>
                    <input type="submit" value="Save" />
                </fieldset>
            </form>
        </body>
    </html>
*address.html - HTML page markup*

We've included our Javascript file `address_from_postcode.js` in the
header and given our address fieldset a classname of `address` that
we'll use to find and attach our behaviour to it's children. We do this
rather than using an ID so that we can have multiple address fields on
the same page.

    window.onload = function() {
        var url = "http://example.org/address\from\postcode.txt?postcode=";
        var fieldsets = document.getElementsByTagName("fieldset");
        for (var foo in fieldsets) {
            if (fieldsets[foo].className == "address") {
                var textareas = fieldsets[foo].getElementsByTagName("textarea");
                for (var bar in textareas) {
                    if (textareas[bar].className == "address") {
                        fieldsets[foo].address = textareas[bar];
                        break;
                    }
                }
                if (fieldsets[foo].address) {
                    var inputs = fieldsets[foo].getElementsByTagName("input");
                    for (var bar in inputs) {
                        if (inputs[bar].className == "lookup") {
                            inputs[bar].http = getHTTPObject();
                            inputs[bar].working = false;
                            inputs[bar].onclick = lookupAddress;
                        }
                        if (inputs[bar].className == "postcode") {
                            fieldsets[foo].postcode = inputs[bar];
                        }
                    }
                } else {
                    alert("No address textarea defined within address fieldset!");
                }
            }
        }
        function lookupAddress() {
            if (!this.working) {
                var http = this.http;
                var address = this.parentNode.address;
                this.http.open("GET", url + escape(this.parentNode.postcode.value), true);
                this.http.onreadystatechange = function() {
                    if (http.readyState == 4) {
                        this.working = false;
                        address.innerHTML = http.responseText;
                    }
                }
                this.http.send(null);
                this.working = true;
            }
        }
    }
*address_from_postcode.js - Javascript behaviour layer*

This code does the following:

1.  Search the DOM for all fieldsets with a class of "address".
2.  For each fieldset, get the first textarea with a class of "address".
3.  Also get the first inputs with a class of "lookup" and "postcode".
4.  Attach to the lookup button, a HTTP object and an on click event.
5.  On click of the button, make sure we're not already waiting for a
    HTTP response and if not issue the HTTP request.
6.  On reception of the HTTP response, set the address textarea to the
    recieved value.

So now to add this complex behaviour to our HTML forms, all we need to
do is include the Javascript file and add the class names to the
relevant elements.

Of course this is just a simple example, I've been using it to
dynamically update dropdowns and autocomplete fields from existing data,
the number of applications of this type of rich forms are unlimited.
