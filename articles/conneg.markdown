---
layout: article
title: Content Negotiation
date: Jul 23, 2005
---

[Content negotiation](http://gewis.win.tue.nl/~koen/conneg/) is something I've been looking at lately as part of the development of my RESTful Web management system I'm working on in my spare time. The idea is as old as the Web itself and is simple to understand, for a single resource you have multiple representations in different data formats and which one we send depends on the accept headers sent by the client.

We all know it's good practice to trim file extensions from your URLs so that you are not tied to a particular data format. Content negotiation says that a URL like `http://www.example.org/example` would be translated by <abbr title="content negotiation">conneg</abbr> to `http://www.example.org/example.html` if the client wants HTML and the file `example.html` exists.

By translated, I don't mean changed, this all happens transparently to the client. Also, an interesting affect is that now we have multiple URLs for the same resource. We have a single URL that will in effect alias the URL that best suits the client, and a number of URLs for each data format.

I came across this article on [the MSDN Magazine site](http://msdn.microsoft.com/msdnmag/default.aspx), the first article in the "inside MSDN" column about the new MSDN site, [Designing URLs for MSDN2](http://msdn.microsoft.com/msdnmag/issues/05/02/InsideMSDN/default.aspx). Someone's going to fix the mess that is MSDN I thought, excellent, maybe someone will tidy up those URLs and remove all those .aspx extensions.

> Some people wonder why we bother with the .aspx extension, as it ties us to a particular technology. Others wonder why we aren't using ASP.NET when we tell them they should (we are using ASP.NET, but without the .aspx it might appear as though we're not). To make both groups happy, we chose to use the .aspx extension, but you can leave it off if you feel like it.

So sod having the ability to deliver content in the format best suited to clients, and lets use our URLs to advertise our server technology. And while we're at it lets not use language negotiation to deliver the correct language for the clients locale, but instead use a made up bracket notation which we'll append to the URL.

Conneg is great, for example, you can have one URL for your homepage and deliver HTML to Web browsers and RSS to feed readers, all totally transparently to the clients. People should be using this stuff, just a shame that a high tech. company like Microsoft isn't leading the way.

With [a recent thread](http://groups.yahoo.com/group/rest-discuss/message/5138) on [the REST Discuss mailing list](http://groups.yahoo.com/group/rest-discuss) I thought it'd be useful to recap the issues it raised.

The idea behind content negotiation is that a resource may have multiple representations in different formats, so a client can recieve the best representation for it's abilities. So for example requesting http://example.org/theNews could return a HTML document for a HTML browser and a PDF document for a PDF viewer.

But what happens when I want to PUT a new HTML version of my resource, one that fixes a mistake in my markup, if I PUT to http://example.org/theNews then how does my server know which representation to alter? Am I replacing both representations with a single new resource, or just updating one? That's why one of the golden rules of REST <a href="http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm#sec_5_2_1_1">as mentioned in Roy's thesis</a> is:

> The key abstraction of information in REST is a resource. Any information that can be named can be a resource: a document or image, a temporal service (e.g. "today's weather in Los Angeles"), a collection of other resources, a non-virtual object (e.g. a person), and so on. In other words, any concept that might be the target of an author's hypertext reference must fit within the definition of a resource. A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time.

So for our example URL of http://example.org/theNews that returns either a HTML or a PDF document, we also have two other resources, one for the HTML document and one for the PDF document. By convention (and because it makes <abbr title="content negotiation">conneg</abbr> easier) we'll reference these at http://example.org/theNews.html and http://example.org/theNews.pdf respectively.

In this way, we get the power of being able to say to a client, "go to this URL and there'll be something useful you can consume", but we can also do our CRUD operations to manage each individual representation.

A lot of this is academic in the real world, content negotiation is one of those things which will rarely be used, however it does a good job at showing why the golden rule of "everything should be a resource" is important. If we might want to be able to access it, edit it, delete it, make it a resource, <a href="http://lists.w3.org/Archives/Public/www-archive/2002Sep/0152.html">URLs are cheap</a>.