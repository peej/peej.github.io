---
layout: article
title: What are Web Services?
date: Feb 2, 2005
---

[Justin Sampson](http://www.krasama.com/) posted [a great
reply](http://groups.yahoo.com/group/rest-discuss/message/4870) to a
question on the [REST Discuss mailing
list](http://groups.yahoo.com/group/rest-discuss) this evening, here's a
quote:

> The fundamental insight I take from REST as it relates to Web services
> is that well-behaved Web services should feel a lot like well-behaved
> Web sites. A Web service is just a machine-readable Web application,
> and a Web application is just a dynamic Web site. The principles of
> the Web architecture that made it so successful apply to all three.

Stop trying to build RESTful Web services and starting just doing things
the way you've been doing them for years, if it ain't broke, don't fix
it.

What REST is Not
----------------

With all the coverage REST is getting, lots of systems are being touted
as RESTful, so I thought it was about time I wrote not about what REST
is, but what REST is not.

### A messaging system

REST is not a protocol, it is an architectural style, it is a way of
transfering representations of resources between two points. A resource
can be anything, an application object, a database record, etc. and a
representation is a way of expressing that resource in a useful way,
whether that be as a HTML file, an XML document, an image, a comma
separated value, etc.

A messaging system is a way of passing messages between entities, SOAP
is a messaging system. Messaging systems, RPC systems, are useful, they
allow our applications to talk to each other over the network by sending
short messages between one another. The problem with messaging systems
is that they work fine when you control both ends of the equation but
when it comes to scaling them up to the size of the Internet, where
anyone can send a message to anyone else, they quickly fall apart.

HTTP may look like a messaging system at first glance, but it's not,
it's a representation transfer system, no messages are ever sent back
and forth, only requests and responses as representations of the
resources modelled on the server.

### XML over HTTP

Just because you are sending XML over HTTP does not mean your Web
service is RESTful, a lot of Web services that claim to be REST services
are nothing more than XML over HTTP. To be RESTful requires that you
embrace "the cult of REST". This includes:

-   Everything is a resource and every resource has a URL. If you need
    to manipulate it, it needs to be a resource.
-   Resources can be manipulated by the four CRUD methods GET, PUT, POST
    and DELETE.
-   Resources can have multiple representations in different formats,
    but they must all represent the same data, the data that is the
    resource.
-   Resources should link together to allow auto-discovery and provide
    context. Just because it's not HTML being sent doesn't mean you
    forget everything that's good about the Web, a Web service is just a
    machine readable Web site.
-   URLs should encode the nature of the resource and indicate any
    heirarchy between resources. Querystrings should be used for
    queries, not for returning different resources.

If you don't cover all these points then you're not being RESTful,
you're just delivering XML over HTTP (which is fair enough, just don't
claim to be RESTful).

### Tidy URLs

URLs without large querystrings has been a trendy thing in Web circles
for the last 4 or so years and it is one of the things REST says is "a
good thing". But when it comes to REST it isn't just about being neat
and tidy, the poritions of a URL have a meaning, it's not a random
string of characters that happens to point to a file on your Web server.

URLs do not point to files on Web servers, they point to resources. The
querystring portion of the URL is used to pass in query parameters to a
URL, so if you have an index file listing a number of other resources a
querystring can be used to limit the URLs returned in the listing (kind
of like a WHERE clause in SQL). Just because your URLs are tidy, doesn't
mean you're being RESTful.