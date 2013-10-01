---
layout: article
title: Hypermedia as the Engine of Application State
date: Dec 29, 2007
---

REST defines four constraints upon the architecture of a Web
application:

-   A universal syntax for resource-identification
-   A set of well-defined operations
-   Having a shared set of media-types
-   Hypermedia for application state-transitions

The first three are well understood but the fourth tends to slip through
peoples thoughts when in fact it's one of the most important and easiest
to grasp of the RESTful concepts.

There's always talk of a need for some kind of description language for
the Web, a way for clients to know what resources are out there and
which actions can be done upon them. But of course, in a RESTful system,
you don't need such a thing as hypermedia and the well-defined set of
operations (the HTTP methods) take care of it.

Using hypermedia
----------------

So, lets say we have an application, maybe it's a ordering process
application that allows clients to place orders for different kinds of
widgets.

We could have a client application that has all of the processing data
baked into it, it could know the IDs of all the widgets up front, it
could know how to format and submit an order, but this would closely tie
our client application to our server application creating tight coupling
between the two.

RESTful systems avoid this kind of tight coupling by using hypermedia to
guide the client application. So instead of having a hard coded client,
we have a generic "order processing" client that knows how to interpret
the representations our server produces and take certain actions
depending on their contents.

So lets presume that we want an automated system to place an order for
widgets everyday based on the level of widget stock in our own stores,
we wouldn't want to run out of widgets now would we. An interaction with
the service might look something like this:

### Client request
    GET /
    Host: widget-store.example.com
    Accept: application/x-order-process+xml

### Server response
    Etag: "1f0417-14d6-7f24a1c0"
    Content-Length: 369
    Content-Type: application/x-order-process+xml

    <?xml version="1.0"?>
    <shop checkout="/checkout">
        <catalogue>
            <item stockNumber="123" name="Small Widget" href="/products/123" />
            <item stockNumber="456" name="Medium Widget" href="/products/456" />
            <item stockNumber="789" name="Large Widget" href="/products/789" />
            <item stockNumber="abc" name="Sparkling Widget" href="/products/abc" />
        </catalogue>
    </shop>

So our generic client application makes a HTTP GET request to our widget
stores primary URL (aka its homepage). This is the only thing we need to
tell our application up front, as long as both the widget store and our
application can understand each others representations we're in
business, this is why we have standard for document formats (like HTML,
CSS, JPEG, etc. or in this case the freshly created just for this task
"`application/x-order-process+xml`").

The respresentation our application gets back outlines the widgets
available from the store and how to place an order. Our application
knows that item nodes within a catalogue node are widgets we can
purchase, it also knows that the checkout attribute of the shop node
contains the URL that begins the order placing process.

### Client request
    GET /products/789
    Host: widget-store.example.com
    Accept: application/x-order-process+xml

### Server response
    Content-Type: application/x-order-process+xml

    <?xml version="1.0"?>
    <product>
        <stockNumber>789</stockNumber>
        <name>Large Widget</name>
        <stockLevel>2</stockLevel>
        <price currency="GBP">7.99</price>
        <description>This widget is larger than the standard widget in both size and price</description>
    </product>

Our client application knows that we're running out of "789" widgets, so
we need to order some more. So we get the URL for the "789" widgets from
the stock list and GET a representation that shows our application that
they have 2 in stock. Luckily we don't use many "789" widgets so we only
need to order 1 to keep our stock levels happy.

If we also need some other widgets we can repeat this procedure building
up a list of stock numbers and quantities of all the widgets we require.
If they don't have enough in stock, our application can issue some kind
of warning, maybe it can e-mail you to warn you that we might be about
to run out of something.

Once our application knows what it wants to order, it can GET the
checkout URL:

### Client request
    GET /checkout
    Host: widget-store.example.com
    Accept: application/x-order-process+xml

### Server response
    Content-Type: application/x-order-process+xml

    <?xml version="1.0"?>
    <order
        submit="/checkout/submit"
        method="post"
        type="application/x-order-process+xml"
    >
        <input name="name"/>
        <input name="company"/>
        <input name="address"/>
        <multiple name="item">
            <input name="stockNumber"/>
            <input name="quantity"/>
            <input name="totalPrice"/>
        </multiple>
        <input name="total"/>
    </order>

Now if you're thinking "that looks like a HTML form with different tags"
then you're right. HTML forms are HTMLs way of showing the client (in
its case a HTML browser) how to send data to the server, and this is our
"order process" applications way.

Using this, our application can formulate a representation to send to
the server to place our order:

### Client request
    POST /checkout/submit
    Host: widget-store.example.com
    Content-type: application/x-order-process+xml

    <?xml version="1.0"?>
    <order>
        <name>Jack Bauer</name>
        <company>CTU</company>
        <address>Los Angeles</address>
        <item>
            <stockNumber>789</stockNumber>
            <quantity>1</quantity>
            <totalPrice>7.99</totalPrice>
        </item>
        <total>7.99</total>
    </order>

### Server response
    Content-Type: application/x-order-process+xml

    <?xml version="1.0"?>
    <confirmation orderNumber="123-456" href="/orders/123-456"/>

But why go through all of this rather than just hardcode the required
representation into our client? Well we could, but then the client would
be tightly coupled to the server, so if the server changed, the client
would need to change too. Not a problem when you control both the server
and the client, but if like in our example, the widget company runs the
server and we run the client, then we'd be in trouble if the widget
company decided that an extra step was required in the ordering process,
say an extra confirmation stage.

### Client request
    POST /checkout/submit
    Host: widget-store.example.com
    Content-type: application/x-order-process+xml

    <?xml version="1.0"?>
    <order>
        <name>Jack Bauer</name>
        <company>CTU</company>
        <address>Los Angeles</address>
        <item>
            <stockNumber>789</stockNumber>
            <quantity>1</quantity>
            <totalPrice>7.99</totalPrice>
        </item>
        <total>7.99</total>
    </order>

### Server response
    Content-Type: application/x-order-process+xml

    <?xml version="1.0"?>
    <confirmation
        orderNumber="123-456"
        href="/orders/123-456"
        submit="/orders/123-456/confirm" method="post"
        type="application/x-order-process+xml"
    />

### Client request
    POST /orders/123-456/confirm
    Host: widget-store.example.com
    Content-type: application/x-order-process+xml

    <?xml version="1.0"?>
    <order>
        <name>Jack Bauer</name>
        <company>CTU</company>
        <address>Los Angeles</address>
        <item>
            <stockNumber>789</stockNumber>
            <quantity>1</quantity>
            <totalPrice>7.99</totalPrice>
        </item>
        <total>7.99</total>
    </order>

### Server response
    Content-Type: application/x-order-process+xml

    <?xml version="1.0"?>
    <confirmation orderNumber="123-456" href="/orders/123-456"/>

So as long as our client application knows how to understand and
generate "`application/x-order-process+xml`" documents, and as long as
the server also only generates and receives
"`application/x-order-process+xml`" documents, then everything will keep
on working, even if things change at either end.

All of this and no resource description in sight. All the co-ordination
is dictated by the fact that we have a uniform interface defined by the
HTTP and URI specifications, and that we have decided upon a standard
grammar for our representation exchanges.

Web services as Web sites
-------------------------

None of this is rocket science, none of it is new, we've been building
Web applications for human consumption using HTML as our representation
grammar for the last 15 years, so why change anything for robot
consumption?

When it comes to building a Web "service", remember that you are really
just building a Web site with a different representation format. The
most important thing you can do is to get your format hammered down from
the start (or pick an existing format if it suits your needs or extend
an existing format if it doesn't so at least you can gain some network
effects from it, Atom is a good place to start for many uses).

So next time someone goes on about how RESTful systems can't possibly
work because they need some kind of description language to enable
clients to be wired to servers, remind them of hypermedia and point them
to any part of the Web for a real World example of REST in action.