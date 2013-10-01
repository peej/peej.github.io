---
layout: article
title: HTTP Caching
date: Jun 25, 2006
---

HTTP has a very thorough and well supported caching mechanism, but in this age of the dynamic Web page, it often goes unused when it is needed the most. So what do we, as Web programmers, need to do to make sure our pages are cached correctly? Let's have a look.

The reasoning
-------------

What is the point of caching? The idea is that on the Web, it is often better to have stale data than to wait for the network. Data only changes every so often and even if it has changed, it's not always important that the client has the latest data, so caching it either at the client, or at an intermediary, isn't a problem and should infact be a good idea. [RFC2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html) says:

> Caching would be useless if it did not significantly improve performance. The goal of caching in HTTP/1.1 is to eliminate the need to send requests in many cases, and to eliminate the need to send full responses in many other cases. The former reduces the number of network round-trips required for many operations; we use an "expiration" mechanism for this purpose. The latter reduces network bandwidth requirements; we use a "validation" mechanism for this purpose.

Allowing clients and intermediaries to cache our pages will lighten the load on our servers and create a faster user experience. One of the problems with dynamic Web applications is that your Web server thinks it is sending new data every request and so can't set the correct caching headers, you need to do a little extra work yourself within your application to make sure caching is working for you.

There are two types of caching in HTTP, we'll look at both, how they work, how they work together, and how to make sure your Web application is taking advantage of them.

Expiration
----------

The expiration model is a way for the server to say how long a requested resource stays fresh for, user agents should cache the resource response and re-use it until its cache is no longer fresh.

Expiration is excellent for resources that change at known times or the change very rarely and whose staleness does not matter. For example, images and style sheets that are used across a site often do not change very often and so should be sent with a expiration date of at least 24 hours. The user agent will then only download them once, no matter how many pages of the site they visit.

If we are serving resources from a dynamic data source, for example say we have a graphic that portrays the current weather outside, if we know that the data only updates once an hour, we can set the expiration date to an hour so that clients only request it once per hour.

### Expires header

The simpliest way of doing this is with the HTTP Expires header, it just contains the date and time of when the resource will become stale:

    Expires: Sun, 25 Jun 2006 14:57:12 GMT

### Cache-Control header

The Expires header has a few problems like requiring the server and
client to have clocks that are in sync. So HTTP 1.1 replaced it with the
Cache-Control header that offers more flexibility:

    Cache-Control: max-age=86400, must-revalidate

The cache control header has a number of clauses that can be used to
control the way the client caches the resource.

* **max-age=86400** The number of seconds the resource will be considered fresh, similar to the Expires header except the number of seconds from now is used rather than a specific date/time.
* **s-maxage=86400** The same as max-age, except that it only applies to shared caches.
* **public** Makes the response always cacheable even if it wouldn't normally be cacheable (behind authentication, etc.)
* **no-cache** Forces caches ask the server for validation before releasing a cached copy, so if the server says that the cached version is still fresh it is served from the cache.
* **must-revalidate** Forces caches to obey any freshness information you give them about a resource.
* **proxy-revalidate** The same as must-revalidate except that it only applies to shared (proxy) caches.

Validation
----------

The validation model allows a client to ask the server whether a cached
version of a resource is still fresh. If the client doesn't have a fresh
cached version, the server will respond with a fresh version of the
resource, while if it does, the server will say so and send nothing.

This is useful as it allows our server to tell a client it already has
the freshest version and not do any processing. If the resource is
dynamic, we can save our server from having to do all the work involved
in producing the response since the client already has it in its cache.

### Last-Modified header

Like the expiration model, there are two HTTP headers that control
validation, the Last-Modified header is defined in HTTP 1.0 and sends
the client the date/time when the resource was last modified:

    Last-Modified: Sun, 25 Jun 2006 14:57:12 GMT

When a client sends a "If-Modified-Since" request header, the date/time
sent in that header can be compared with the resources last modified
date/time, and if it matches, a 304 Not Modified HTTP response sent.

### Etag header

The Last-Modified header suffers the same problems as the Expires
header, and thus was replaced in HTTP 1.1 with the Etag header. An Etag
is a string that uniquely identifies a resource, they should be
generated by the server in a way as to change whenever the resource
does, a common Etag value is the MD5 hash of the resource or of the
resources URL and its modified date/time stamp.

When a client sends a "If-None-Match" request header, the Etag value in
that header should be compared to the resource and if it matches, a 304
Not Modified response sent.

Using caching
-------------

So to make sure your dynamic resource behaves well when it comes to HTTP
caching, you need to support validation and optionally send a expiration
header from within your script.

Supporting validation in PHP this is pretty simple, sending the correct
headers is just a case of:

    function sendValidationHeaders($mtime, $etag) {
        header('Last-Modified:'.gmdate('D, j M Y H:i:s', $mtime).' GMT');
        header('ETag: '.$etag);
    }

And doing the actual validation just requires a function like:

    function isModified($mtime, $etag) {
        return !(
            (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) >= $mtime)
        ||
            (isset($_SERVER['HTTP_IF_NONE_MATCH']) && $_SERVER['HTTP_IF_NONE_MATCH'] == $etag)
        );
    }

If you want to tell clients when your resource expires, you need a
function like:

    function sendExpireHeaders($seconds) {
        header('Expires: '.gmdate('D, j M Y H:i:s T', time() + $seconds));
        header('Cache-Control: max-age='.$seconds.', must-revalidate');
    }

Other caches
------------

As well as HTTP caching, your Web application may also want to use
various application caching mechanisms. If you're hitting a database
often you may want to place an object cache like
[Memcache](http://www.danga.com/memcached/) in front of it so that often
requested data can be cached in Web server memory rather than being
re-requested from the database. If your dynamic app has lots of pages
that don't update very often you may want to place a reverse proxy like
[Squid](http://www.squid-cache.org/) in front of it to save
re-generation of all non-changed pages across users. The setting up and
using of other caches are beyond the scope of this article, [an intro to
using Squid as a reverse proxy can be found
here](http://wiki.squid-cache.org/SquidFaq/ReverseProxy) and the [PHP
memcached extensions documentation is
here](http://www.php.net/memcache).

For more info on HTTP caching, check out [section 10 of
RFC2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) and for
an easier read, have a look at Mark Nottingham's [Caching
Tutorial](http://www.mnot.net/cache_docs/).
