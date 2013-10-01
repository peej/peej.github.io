---
layout: article
title: Representational State Transfer
date: May 2, 2002
---

Representational State Transfer (REST)
======================================

REST (REpresentational State Transfer) is a phrase coined by [Roy
Fielding](http://www.ics.uci.edu/~fielding/) in his dissertation
[Architectural Styles and the Design of Network-based Software
Architectures](http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm).
It is an attempt to describe the undocumented architectural design
principles behind the Web. In fact you are using the World's largest and
most popular REST system right now, yes, the World Wide Web.

> "The World Wide Web architecture has evolved into a novel
> architectural style that I call 'representational state transfer.'
> Using elements of the client/server, pipe-and-filter, and distributed
> objects paradigms, this style optimises the network transfer of
> representations of a resource. A Web-based application can be viewed
> as a dynamic graph of state representations (pages) and the potential
> transitions (links) between states. The result is an architecture that
> separates server implementation from the client's perception of
> resources, scales well with large numbers of clients, enables transfer
> of data in streams of unlimited size and type, supports intermediaries
> (proxies and gateways) as data transformation and caching components,
> and concentrates the application state within the user agent
> components." - Roy Fielding

With all the talk of Web Services by the big software companies of this
World, REST has (or will, maybe) come back into the limelight as an HTTP
RPC protocol (like SOAP and XML-RPC).

The Web As We Know It
---------------------

What REST basically says is "the Web is cool, HTTP is cool, and it
already does everything we want and it works! Why do we need anything
more?"

The Web as defined by Tim Berners-Lee consists of three elements:

-   URI (Uniform Resource Identifier) - The way of uniquely identifying
    resources on the network.
-   HTTP (HyperText Transfer Protocol) - The protocol used to request a
    resource from a URI and respond to requests.
-   HTML (HyperText Markup Language) - The content format of resources
    to be returned.

The interesting aspect of this mixture is the HTTP.

We all use it everyday, but why is it so interesting. Well HTTP is a
very cleverly designed protocol, it defines a small global set of verbs
(the HTTP Methods: GET, POST, PUT, DELETE, etc) and applies them to a
potentially infinite set of nouns (URIs). Most of the time when using
the Web, you use the HTTP GET method to retrieve documents, if you're
submitting some form data you may use the POST method, there are however
a whole handful of other useful methods defined but rarely used on the
Web but perfect for REST based Web Services.

HTTPs power comes from its simplicity and extensibility. The ability to
distribute any payload with headers, using predefined methods and its
built-in support for URIs and resources, makes it really special. URIs
are the defining characteristic of the Web, the mojo that makes it work
and scale. HTTP as a protocol keeps them front and center by defining
all methods as operations on URI-addressed resources.

Tell Me The REST
----------------

Stupid acronym puns aside, the idea of REST is to take what we all take
for granted in the Web (ie. HTTP and URIs) and use it with other
payloads (other than HTML, images, etc.) and other HTTP Methods than the
usual GET and POST. REST defines identifiable resources (URIs), and
methods for accessing and manipulating the state of those resources
(HTTP Methods).

HTTP messaging formats like SOAP and XML-RPC are supposedly the next big
thing in the ever-developing world of the Web and the Internet. The idea
of being able to link applications together using a standard open RPC
format over HTTP connections shows great promise for distributed
computing and interoperability, but the major problem with them is they
purposefully break the HTTP spec by adding another layer of abstraction
onto HTTP rather than using the protocol as it was designed. REST says
this extra layer is an unnecessary layer of complexity.

SOAP and XML-RPC are both designed to operate from a single URI with
methods being invoked from within the request payload. This fails to use
URIs as they were designed to be used. A URI is a unique resource on the
network and as such, each method in your RPC call should use a unique
URI.

Using REST this is the case, and depending on your request method,
different actions can be invoked. REST uses HTTP as it was designed, if
you want to get some data you use a HTTP GET request, if you want to
delete a record from a database you use a HTTP DELETE request, etc.

Advantages of REST
------------------

-   It uses well documented, well established, well used technology and
    methodology.
-   It's already here today; in fact it's been here for the last 12
    years!
-   Resource centric rather than method centric.
-   Given a URI anyone already knows how to access it.
-   It's not another protocol on top of another protocol on top of
    another protocol on top of...
-   The response payload can be of any format (some may call this a
    disadvantage, however the Web copes with it, it's just a case of
    defining the application grammar).
-   Uses the inherent HTTP security model, certain methods to certain
    URIs can easily be restricted by firewall configuration, unlike
    other XML over HTTP messaging formats.
-   REST makes sense, use what we already have; it is the next logical
    extension of the web.

Differences Between REST and RPC
--------------------------------

REST is not RPC, RPC says, "define some methods that do something"
whereas REST says, "define some resources and they will have these
methods".

It is a subtle but vital difference, when given a URI anyone knows they
can interact with it via the predefined set of methods and receive
standard HTTP responses in return. So given http://www.peej.co.uk/ I
know I can issue a GET on it and receive something meaningful back. I
may then try a PUT on it to change it and receive a meaningful HTTP
error code since I'm not authorised to meddle with it.

Conclusion
----------

The Web of yesterday was all about transferring documents over the
network to a users eyes, the Web of today adds the delivering of Web
based services (ala e-mail, recruitment, etc.) to the mix, the Web of
tomorrow will extend this information and service source from just being
a user experience to being a generic client system.

SOAP, XML-RPC, and other XML messaging over HTTP protocols may be the
way this new era of the Web is created, the big (and not so big)
corporates certainly think so, but REST shows that the infrastructure to
do these types of machine to machine communications is already in place
and has been since HTTP, the URI, and the Web was invented.

### References

-   [Architectural Styles and the Design of Network-based Software
    Architectures](http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm)
-   [RESTWiki](http://internet.conveyor.com/RESTwiki/)