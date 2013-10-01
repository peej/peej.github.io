---
layout: article
title: XML is not a Data Transfer Format
date: Jun 18, 2005
---

A project I've been having a small part of at work involves a Flash
element talking to a bunch of heavy chunking PHP scripts thrashing a
MySQL data to within an inch of it's life. The Flash comes back to the
server every now and then asking for new data for that particular user
(and sends some data back too).

It was decided without any thought as to why by the Flash team to format
this data as XML. The reason being that they already had libraries for
parsing XML into native ActionScript variables.

The problem with this is of course that XML is a markup language for
formatting documents and adding meaning to data, not a data transfer or
serialisation format. It's just too verbose for doing that, especially
when you consider that this campaign is going out to a large userbase
and every ounce of server power and bandwidth is precious.

XML is useful if the data you are transfering is actually a document and
needs marking up like you would a document, but if it's not, if you're
just doing data transfer then there ar far better formats which are just
as easy to parse ([JSON](http://www.json.org/) for one rings a bell). In
our case, the data sent to the Flash is always the same, so a simple
string of characters pushed over HTTP would have worked great, have made
data parsing and generation fast, and have cut the bandwidth used by a
factor of 5 at least. When you're talking about half a million requests
an hour, cutting the client/server bandwidth by 5 is a big deal.

The moral of this story is, use the correct encoding format for the
correct situation. XML is great, but if all you have is a hammer
everything looks like a nail. Another reason for REST/HTTP's success,
content type neutrality.