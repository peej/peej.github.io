---
layout: article
title: Introducing the RMR Web Architecture
date: Nov 28, 2008
---

I talk a lot to people about REST, but with the acronym having become a
commonplace among Web folk, I often find myself having to explain that
what they have read about as REST or think of as REST is actually POX,
HTTP-RPC or whatever you want to call it.

I'm also an advocate of the idea that REST isn't just about "Web
services" but is also a good model for building fast sustainable Web
applications. As such, in my quest to educate the ideas of REST, today I
want to outline a different way to build Web apps, a RESTful way, an
alternative to the popular MVC model, a model I call RMR, or
Resource-Method-Representation.

Model-View-Controller
---------------------

The current popular way of building Web applications is using the MVC
pattern. This pattern separates the application into three parts:

-   The Model models your business objects, the "things" in your
    application, wrapping up data handling and logic.
-   The View is the output to the client.
-   The Controller manages the application flow manipulating data from
    the Model and generate a view.

This architecture has been widely embraced by Web developers even though
it was designed for desktop applications. As far as I'm concerned, MVC
doesn't really work on the Web, it doesn't model and expose resources in
a convenient way (URL routing is evil and actions are methods on
controllers exposed as resources rather than methods on resources
themselves.

It just doesn't model resources, the fundamental element of the Web is
totally ignored. So how can we fix this?

Resource-Method-Representation
------------------------------

We all agree that slicing our code up into pieces is a good idea,
separating concerns allows us to concentrate on the particular task in
hand and make maintenance easier, how can we separate it that makes more
sense in a Web context than MVC?

### Resource

We start with resources. The Web is made up of resources, so to make our
application work with the Web we should model resources. A resource is
an object within a RESTful system, they contain information, are
identified a unique identifier (URLs in HTTP), and respond to the
standard interface (in HTTP the standard HTTP methods of GET, PUT,
etc.).

So in an OO language, a HTTP resource can be thought of as an object
with private member variables and a number of public methods that
correspond to the standard HTTP methods. From an MVC point of view, a
resource can be thought of as a model with a bit of controller thrown
in.

### Method

Each request is routed to a resource automatically since each resource
has a unique URL, and the method corresponding to the HTTP request
method is run. This acts like an MVC controller, doing any operations
necessary to prepare the request response based on the request.

### Representation

Finally, the last part of the puzzle is the response. In a RESTful
system, resources are exposed to the client as representations, where a
representation is in essence a concreting of the resource into a wire
format.

This Web page you are looking at right now for example, is a HTML
representation of the resource that is this article. There could be
other representations, you could view this article as a ASCII text file,
or a PDF document, if I'd made them available to you.

So the representation is like a view in MVC, we give it a resource
object and tell it to serialize the data into it's output format.

Putting it into Practice
------------------------

So lets create some example code of how we might set up an RMR system.
We'll do it in pseudo-code to keep things quick and simple.

### Front Controller

First we'll need a front controller to handle all incoming requests and
to do the routing:

    request = readRequestData();
    resource = loadResourceForThisRequest(request.url);
    response = callRequestMethod(request, resource);
    response.output();

This is pretty similar to an MVC front controller, we read data from the
request and do something depending on what's there. The only real
question is where do we load a resource from for a give URL?

A simple resource it might just be a class that pulls some data from
somewhere, or no data as all the data may be in the representation (as
with a HTML page).

The other case is that we have a collection of data we want to expose as
resources, like a bunch of weblog posts, or the users of the
application, or stock in a warehouse,.. you get the idea. In is case we
probably want to map our collection URLs to a resource class that pulls
a row from a database table.

### Resource Class

To program our application, we write resource classes to model our
application data, so what could a base resource class look like:

    class Resource {
        private resourceData = [];
        method constructor(request, dataSource) {
            // load data from data source
        }
        method get(request) {
            return new Response(200, getRepresentation(request.url, resourceData));
        }
        method put(request) {
            return new Response(405);
        }
        method post(request) {
            return new Response(405);
        }
        method delete(request) {
            return new Response(405);
        }
    }

Our class will load it's data on construction and then run one of the
request methods. The methods that correspond to PUT, POST and DELETE
requests all return a 405 response object (Method Not Allowed) since we
don't want them to do anything by default, while our GET method returns
a representation that corresponds to the request URL and the data loaded
into the resource.

### Routing

The final piece of the puzzle is how we route incoming requests to their
respective resource classes. There are many ways to do this and the way
you choose depends on personal preference.

We could follow a convention, saying that a URL of a format `/something`
maps to a resource class called `Something`, and then for collections of
resources we could say that any URL of a format `/something/item` would
map to a single resource class representing the resources in the
collection called something like `SomethingItem`.

The other extreme would be to map each URL or collection of URLs
explicitly to a resource class.

Conclusion
----------

So given a bunch of resource classes, some representations, and a way to
map URLs to resource classes and resource methods to representations, we
can build up a Web application in a RESTful way. Add in some HTTP
goodness like conditional GET and cache headers, and we've got a pretty
good system.