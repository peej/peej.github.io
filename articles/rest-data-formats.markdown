---
layout: article
title: REST Data Format Confusion
date: Jan 15, 2005
---

One of the problems people have with the REST architectural style is its
lack of definition of a common data format, but that is actually one of
the powerful features of REST based systems.

It's very attractive to programmers to have a single all in one protocol
and encoding format, programmers like to think in terms of functions and
parameters which is what you get with XML-RPC and SOAP. They have their
own way of representing common data formats in XML, meaning you can pass
values back and forth without having to write or decode any XML, the
libraries do it all for you.

The problem comes when you want to pass something more than a simple
data value back and forth. If you define a data format like XML-RPC or
SOAP do, then you'd better make sure it covers all posibilities. How for
example do I pass a binary file back from an XML-RPC request? I have to
encode somehow into the XML-RPC XML response. Fun.

REST doesn't work that way, which is alien to most programmers. It works
with URLs and representations, so rather than calling a function with a
set of parameters, you're fetching the state of a resource. Working with
REST requires you to write applications in a RESTful way, rather than
just bolting HTTP based RPC onto a procedural way of thinking.

With a REST based system, my HTTP response body for that request is just
the image itself, no messing around with XML, HTTP handles it all, and
why not, it's proved technology, millions of images are already
transfered that way everyday.

XML is great, it gives us a way of formatting and encoding arbitory data
in a way we can easily get it back with standard tools. But XML is not
the answer to all of our problems, it's a tool suitable for some
problems, you wouldn't use a hammer to fit your broken window, don't use
XML to do things other formats do better. That said, XML is great, the
best thing about it is the X, the extensible, the fact it lets us define
our own formats for our data, with SOAP and XML-RPC we throw away that
power.

Mixing transport with data encoding is limiting and dangerous. What if
HTTP had also defined its data encoding instead of HTML being a separate
layer on top? Then the Web wouldn't have any graphics, no CSS or
Javascript, no binary file downloads, and no XML or Web Services.

One of peoples favourite arguments about having a standard data encoding
is that it means it saves you from writing extra code. [Brent
Simmons](http://inessential.com/) said recently:

> [REST] doesn't say anything about how data is formatted. So you have
> to parse documents. With XML-RPC, assuming you have a library, you
> never have to parse anything.

Well, assuming you have an XML library, you never have to parse
anything, that's the reason for XML, to create a standard document
format you can use off the shelf libraries to parse. It doesn't matter
what tags are in the XML, a decent XML library will get you the values
and structures from the XML document in a nice native format for your
programming language without you having to lift a finger.

Further more, REST doesn't stop you from using a standard XML data
format if that's what's best for your application, although it is most
likely you'll end up with a meaningless response package that only makes
sense in the context of your application and is less RESTful than it
could be. Instead of XML containing users with addresses, you'll have
arrays full of strings, not very semantic, not very RESTful, not really
what everyone had in mind when XML was invented.

So get over the common data format idea, embrace custom response formats
that make sense with respect to the resource being sent, and think
RESTfully when designing your applications from the ground up.