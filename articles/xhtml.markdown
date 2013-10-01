---
layout: article
title: XHTML
date: Feb 14, 2002
---

What is it, why is it, when is it, and how to use it.

**Warning:** This article was written in 2002, 3 years after XHTML
became a standard. I no longer believe that XHTML is a good choice for
authoring on the Web. For more information please read [Ian Hickson's
"Sending XHTML as text/html Considered
Harmful"](http://hixie.ch/advocacy/xhtml) for more information.

Case Of The X
-------------

HTML4 as been around for a while, it is the basis of the modern web,
however it is far from perfect and far from supported. Most people know
about browser incompatibilities, but what most people do not realise is
that HTML has a standard grammar; it is just that browsers do not
comply.

Actually it is not the browser author's fault. To explain this we need
first to look at a little history.

HTML History Lesson
-------------------

SGML (Standard Generalized Markup Language) is a grammar used to mark-up
documents for formatting, it was invented in the 1980's as a standard
way of defining formats on electronic documents.

HTML is a SGML application. That is, it is a set of mark-up that
conforms to the SGML grammar and tells people (or computers) how to
format a document. SGML says an element must look like this, an
attribute like this, etc.

As HTML evolved and the web became more popular, the SGML roots of HTML
started to slip and browsers started allowing HTML authors get away with
not conforming to the HTML standard. This was good for developers as it
gives them an easier ride, however over time it adds inconsistencies
between browsers and leaves us in the current mess of browser
conformity.

How This Relates To XML
-----------------------

You've probably all heard of XML. It is a grammar like SGML, but it has
been specifically designed for the Internet. It too defines how to
structure documents in a rigid way, which makes it easy for programs
(called XML parsers) to interpret XML documents. XHTML is an
implementation of HTML as an XML application, in similar ways that HTML
is an SGML application.

The ultimate goal of XHTML is to allow browsers to do away with their
HTML parsers and basically become XML (and XSL and CSS) parsers. This
has two benefits:

Browsers based on an XML parser can parser and display any XML document
which it has a stylesheet for, whether it be XHTML, WML, or any other
XML application (even one you invented yourself, thus eXtensible).

It removes incompatibilities, as the formatting of an XML document is
defined in a stylesheet and an XML document is strongly typed (an
illegal XML document will generate an XML parser error), so all clients
will display documents the same.

But Browsers Only Support HTML 4
--------------------------------

Wrong! XHTML is an implementation of HTML 4 in XML, thus it is HTML 4
compatible, it will be displayed fine in browsers which support HTML 4.
All that XHTML really does is:

-   Cut out the crap
-   Make HTML a valid XML document
-   Force authors to create valid HTML documents

So XHTML Is The Standard?
-------------------------

Yes, XHTML has been a W3C (the web standards people) recommendation for
over a year (since Jan 2000 to be exact). You can (and should) use it
right now.

"But why should I?" I hear you cry:

-   Do you hate browser incompatibility? Then use XHTML.
-   Are you fed up of having to check your HTML in hundreds of browsers?
    Then use XHTML.
-   Do you want to help push for a standardised XML based web? Then use
    XHTML.
-   Do you want your documents to be future proof? The use XHTML.
-   Do you take pride in your HTML? Then use XHTML.

You probably think that you can write proper HTML4, I did, but if you
haven't read and understood the HTML4 spec then you can guarentee that
your documents are not standard, try running your HTML through the HTML
validator, you will be surprised, I know I was.

So How Do I Write XHTML?
------------------------

The only way to really know is to read the XHTML spec, however it isn't
the easiest document in the World to read, so here are the basic rules:

### Documents must be sent with the correct content type.

Web servers send HTML files with a mimetype definition of `text/html`,
this tells the browser what type of document to expect from a given
request. XHTML is not HTML and should not be sent with the same
mimetype, XHTML should be sent with the mimetype of
`application/xhtml+xml`.

However it's not quite that simple as Internet Explorer does not
understand the `application/xhtml+xml` mimetype and interprets it as
`text/xml` displaying your XHTML file as an XML file. Luckily the W3C
allow us to send HTML conforming XHTML documents with the `text/html`
mimetype which IE will understand and render our document correctly.

Best practice is to get your server to check the types of files the
browser will except and send the content as `application/xhtml+xml` to
browsers that support it, and as `text/html` to those that don't.

### Documents must start with a DOCTYPE definition.

This rule exists for HTML4 too, but browsers let you get away with
missing it out, so most people do. The first line of any XHTML document
should look like this:

`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">`

This defines the document as XHTML1 and tells the browser which DTD
(Document Type Definition) to use. There are three DTDs for XHTML,
Transitional is the best to use if you are moving from HTML4 and want
maximum backwards compatibility.

### All tags must be lower case.

Yes, I don't care if you've used upper case tags before, XML is case
sensitive so \<B\> is different to \<b\>, the XHTML DTDs define all tags
in lower case only, so for your tags to work they must be lower case.

### All attributes must be in quotes.

That is:

`<a href=http://www.example.com>Example</a>`

is not valid XHTML. You must put quotes around the attribute body such
as:

`<a href="http://www.example.com">Example</a>`

### All tags must be closed.

That is if you open a tag like \<p\> then you most also close it with
\</p\>, makes sense really.

### Empty tags must be closed.

This is probably the most alien concept from HTML 4. A tag is empty if
it does not contain text between itself and a closing tag, however in a
valid XML document when you open a tag you must also close it. So:

`<img src="http://www.example.com/image.jpg">`

is not valid XHTML. You must close the tag like this:

\<img src="http://www. example.com/image.jpg"\>\</img\>

This is however annoying, so XML defines a shorthand way of closing
empty tags like this:

`<img src="http://www.example.com/image.jpg" />`

Even the humble line break tag must be closed, ie:

\<br /\>

### You must nest tags correctly.

So you cannot open two tags, and then close them in a different order,
eg:

`<b><i>This is bold and italic</b></i>`

is not valid, you must nest them correctly like:

`<b><i>This is bold and italic</i></b>`

### Tag context

Last but not least and the hardest concept to get hold of, you must use
tags in the correct context. This is almost impossible to get right
without practice or learning the XHTML spec inside out, so the best way
to check if you have done something wrong is to check with the W3C
validator.

Quick Review
------------

-   XHTML is HTML4 compatible
-   Don't forget the DOCTYPE
-   Don't forget to close all tags
-   Use W3Cs validator to check your XHTML (or if I've failed to convert
    you at least your HTML).

Now go forth and prepare your web sites for XML.

### XHTML Links & References

-   [W3C's XHTML Spec](http://www.w3.org/TR/xhtml1/)
-   [W3C's XHTML Transitional
    DTD](http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd)
-   [ZVon XHTML
    Reference](http://www.zvon.org/xxl/xhtmlReference/Output/)
-   [XHTML.org](http://www.xhtml.org/)
-   [Webdev Virtual Library Introdution to
    XHTML](http://www.wdvl.com/Authoring/Languages/XML/XHTML/)
-   [O'Reilly XHTML: The Clean Code
    Solution](http://www.oreillynet.com/pub/a/network/2000/04/28/feature/xhtml_rev.html)
-   [Web Monkey XHTML
    Overview](http://hotwired.lycos.com/webmonkey/00/50/index2a.html)