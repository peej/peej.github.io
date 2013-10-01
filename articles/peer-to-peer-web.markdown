---
layout: article
title: Is Bit Torrent the future of the Web?
date: Mar 13, 2007
---

Håkon Lie of Opera Software spoke at a [Silicon Valley WebBuilder
event](http://video.yahoo.com/video/play?vid=cccd4aa02a3993ab06e56af731346f78.2006940&fr=)
at Yahoo earlier this month talking about the future of the browser. One
thing he talked about was experimental native support for video formats,
bypassing the 12 year old and crumbling Netscape plug-in format. This
seems like an obvious idea seeing as the amount of video we have online
these days, why not roll these things into a browser and make a more
seemless experience.

This got me thinking about what else could be in the future for the
browser and for the Web in general, not the obvious things in the near
future like HTML5 support, CSS3 or native media format support. My mind
went straight to Bit Torrent.

The obvious place for Bit Torrent is for file downloads, again Opera are
miles ahead of the game by baking a torrent client into Opera in 2005,
but I'm thinking of something all together more radical.

A major problem with the Web as it is today is bandwidth. We're all
familiar with the [Slashdot
effect](http://en.wikipedia.org/wiki/Slashdot_effect), as soon as
something becomes popular the servers melt and server admins get very
nervous. Bit Torrent on the other hand loves it when the heat is on, so
surely there's a way we can leverage that power in the Web.

Using Bit Torrent to power the Web
----------------------------------

The obvious way to use Bit Torrent would be to fetch inline assets
associated with a Web page; images, Flash movies, and other static
content we'd otherwise be HTTP GETting. I'm not an expect in how the Bit
Torrent protocol works, but I'd imagine that it wouldn't be too
difficult to provide all the assets for a page as a torrent file and
cause each browser accessing the page (and sitting on the page after
it's loaded) to join the swarm for that torrent. This way, any assets on
the page would be fetched by Bit Torrent from the swarm so as soon as
our Slashdot friends arrive our bandwidth and our servers are spared the
majority of the load.

Of course we'd have to implement this in a backwards compatible way, the
HTML link element could provide the solution, something like this:

    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
    <html lang="en">
        <head>
            <title>Page to be Slashdotted</title>
            <link type="text/css" rel="stylesheet" href="default.css">
            <link type="application/x-bittorrent" rel="torrent" href="heavy-lifting.torrent">
        </head>
        <body>
            <h1>Welcome Slashdotters</h1>
            <p>Here's the big image you were after:</p>
            <img src="big-image.jpg">
        </body>
    </html>

Upon spotting the "torrent" link element, our Bit Torrent enabled
browser would leap into action, downloading the torrent file and joining
the swarm. Then for any inline resources that we need to download, we
can check the swarm and grab the file from it rather than issuing a HTTP
GET to the server.

Our server would obviously have to act as a Bit Torrent tracker and
seeder, but this would be easy to implement as an Apache module,
automatically seeding each asset of a particular mimetype.

I'm sure that either people are working on this right now, or there's
something fundamentally wrong with my idea, either way, there are still
plenty of Web problems out there to be solved.