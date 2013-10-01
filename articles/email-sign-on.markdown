---
layout: article
title: E-mail Sign On
date: Dec 5, 2008
---

Single sign on, a great thing, saving us from "yet another password", or
is it? [OpenID](http://www.google.com/search?q=openid) is great, I have
huge respect for all the people involved in the generation of this
awesome specification, but is all this really needed? After all, we all
already have a password and a distributed system for proving we know it.

Yes, e-mail.

E-mail as login credentials
---------------------------

Imagine this.

1.  You come to my site and I need you to log in for some reason.
2.  So I prompt you for your e-mail address and you kindly provide it.
3.  I send you an e-mail and then tell you to go check your inbox.
4.  You go grab your mail, however you like to do that, and follow a
    link in the e-mail to a unique one time signin page.
5.  That page gets your browser to set a cookie and effectively logs you
    in.

Simple, and no username or password in sight, apart from the ones you
use to access your e-mail already. If you need to log in again, you just
follow the process again. Simple.

Plus most sites do this already with forgotten password functionality so
it's not a foreign experience to Web users.

This is basically what OpenID does but without the human intervention of
having to open an e-mail and click a link. I think having to check your
e-mail and click a link is a pretty good compromise for not having to
set up some new authentication system that may or may not be usable on
the site you're visiting.

Benefits
--------

Everyone has an e-mail address, I mean, why reinvent the wheel when we
already have a system for doing this that everyone already uses. You're
not going to get every Web user to start using OpenID, it's just to much
bother when they can just remember (or get their browser to remember) a
username/password pair.

One of the problems with any single sign on provider is that you have to
trust that provider excusively (sure you can run your own OpenID server
but who actually does that?). Everyone already implicitly trusts their
e-mail provider, at least they do with their e-mail, which in all sense
and purposes is all that counts due to forgotten password e-mails. I
know that I'd prefer to only have to trust one entity, rather than an
OpenID provider too.

Disadvantages
-------------

The main advantage of OpenID is that once you've authorised a site, you
don't have to lift a finger again, the negotiation occurs in the
background between the site and your OpenID provider without you doing a
thing.

But this too could be handled via Web-mail providers and some browser
hackery:

1.  Rather than tell you to go check your e-mail in point 3 above, if I
    can detect that you are using a Web-mail provider, I can stuff an
    `iframe` into the page pointing to a specific Web page provided by
    your Web-mail provider that supports this technique.
2.  This page will of cource be on your Web-mails domain and so as long
    as you are logged into your Web-mail, will be authenticated as you
    and can thus show the latest e-mail in your inbox sent from me.
3.  You can then click straight away back into my site without leaving
    your browser or even having to do any funky redirection or message
    passing magic.

Not quite as seemless as OpenID, but a hell of a lot simpler, and the
infrastructure from a user point of view is already there.

How I detect that you're using a Web-mail provider and where their
little iframe page is is a little more tricky. We could do add a TXT
entry to DNS for the domain to point to the pages URL, or maybe
eventually we can just rely on the browser to provide the users e-mail
address and Web-mail provider details automatically on the click of a
button. Who knows, there's plenty to inovate around in this space.

Conclusion
----------

Yes, existing identity providers opening up their systems to support
OpenID helps since it gives many "normal" folk an instant OpenID, but
many of these users don't understand what OpenID is or that they can use
their Yahoo ID to log into OpenID supporting sites.

Using e-mail as an authentication mechanism makes sense. It makes sense
for users and it makes sense for site developers, and it can be
implemented and used today, without any additional infrastructure or
extra support from 3rd parties.

Although I've never used it, apparently [Craigslist](http://www.craigslist.org/) do something very
similar to this. You can create a posting without signing up to an
account and all you have to provide is an e-mail address to which they
send you a link that allows you to update your posting.

Some would call this security by obscurity, others would call it
capability-based security, I call it clever.