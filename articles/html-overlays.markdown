---
layout: article
title: HTML Overlays
date: Sept 14, 2004
---

XUL overlays is a great feature of the excellent Mozilla application
platform, and now [Laurent Jouanneau](http://ljouanneau.com/blog/) and
[Daniel Glazman](http://www.glazman.org/weblog) have created [a version
for
HTML](http://disruptive-innovations.com/zoo/20040830/HTMLoverlays.html "HTML Overlays")
using Javascript to do the legwork.

The idea is to remove navigational elements and other pieces of HTML
document that are repeated across multiple pages, and place them in
separately downloaded files that can be cached and combined with the
rest of the pages content by the browser. A link tag is used to specify
which overlays to use, and a Javascript script is used to get the
overlays and patch them into the document. The idea is good and the
implementation is solid, being based upon the proven technology of XUL
overlays.

Backwards compatibility
-----------------------

I have a problem with the backwards compatibilty of the implementation.
Without Javascript, the browser doesn't load the overlays and you lose
your navigational elements, not only bad for those with JS turned off
but also for [Google](http://www.google.com/).

How about instead of using XML we use HTML, the id's in the overlay file
matching up with the id's in our host document, and the rest of the HTML
being disgarded by the Javascript. That way we can use another mechanism
to include our overlays if Javascript isn't present (iframes, object
tags, a simple hyperlink) and they are human readable in everyones
browsers.

This may remove some of the flexibility, and it doesn't answer all of
the questions, but personally I think this would be a saner way to
introduce HTML overlays.

The problem is that we still have to parse out our HTML. The useful
thing about using XML is that XMLHttpRequest will parse it and return
you a nice DOM tree. We could send our HTML overlay as XML to
XMLHttpRequests and as HTML for regular requests, but this makes things
messy and adds some unwanted complexity. Mozilla and the latest version
of Opera provide us with a DOMParser object we can use to turn our HTML
string into a DOM tree, but that doesn't help IE users.

A better solution
-----------------

The best solution I can think of is to add a new `<overlay>` element to
our HTML overlays to make them easy to extract with a regular
expression. Browsers displaying the HTML would ignore it and our
Javascript to grab the overlays from the HTML would be quick and simple.

    <overlay id="myOverlay">
        <p>This is content in an overlay.</p>
    </overlay>

I've put up a demo of my version of [HTML overlays in
action](/sandbox/overlay/).