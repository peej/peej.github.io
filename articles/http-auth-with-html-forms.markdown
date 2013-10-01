---
layout: article
title: HTTP Authentication with HTML Forms
date: Feb 3, 2006
---

Authentication in Web applications has been highjacked, HTTP defines a
standard way of providing authentication but most apps use the evil
spawn of Netscape, otherwise known as cookies. Why is this? Cookies
aren't designed for authentication, they're a pain to use for it,
insecure unless you know what you're doing, non-standard, and unRESTful.

**Warning:** The solution outlined in this article is experimental and
might be a complete lie, be warned that your mileage may/will vary.

The main reason people walk away from using HTTP authentication is that
they want control over the look of the login form and most browsers
display an awful looking dialog box. So what we need is a way for HTML
forms to pass HTTP auth data when it's submitted. The HTML spec provides
HTML forms as a way to create queries and to POST urlencoded data to a
URL, but can we subvert it?

With the power of Javascript we can
-----------------------------------

We could add an `onsubmit` event to our login form that pushes the
username and password values within our form into the URL in the forms
`action` attribute. That way our login request would supply the users
credentials in the URL and avoid the server returning a 401 response and
causing our browser from showing the HTTP auth box.

Great, and pretty easy. We could even write the HTML form out with
Javascript and provide a simple link to non-Javascript enabled browsers.
But there's a problem, IE doesn't support usernames and passwords in
URLs, [they were removed due to a security
scare](http://support.microsoft.com/kb/834489), and anyway, the HTTP
spec doesn't say we're allowed to have URLs with usernames and passwords
in them so we can't guarentee that they work anywhere else either.

So is there an alternative way that doesn't require us to mung the
username and password into the URL? Yes, our new friend, XMLHTTPRequest,
it can submit the correct HTTP auth headers for us. Rather than
adjusting the URL the form submits to, we can use XMLHTTPRequest to do a
request before the form submits supplying the entered username and
password. This will set up the browser with the HTTP auth credentials so
it'll also send them with our actual form submission login request.

An example
----------

Enough talking, here's some code. This is our login function that we
bind to our form submission:

    function login() {
        var username = document.getElementById(this.id + "-username").value;
        var password = document.getElementById(this.id + "-password").value;
        this.http.open("get", this.action, false, username, password);
        this.http.send("");
        if (http.status == 200) {
            document.location = this.action;
        } else {
            alert("Incorrect username and/or password.");
        }
        return false;
    }

It sends our XHR request with the given username and password, and then
redirects the client on success or displays a Javascript alert on error.
We need our standard `getHTTPObject()` function [that I introduced
here](/articles/rich-user-experience.html), and then some code to create
our login form and set everything up:

    window.onload = function() {
        var http = getHTTPObject();
        if (http) {
            var anchors = document.getElementsByTagName("a");
            for (var foo = 0; foo < anchors.length; foo++) {
                if (anchors[foo].className == "httpauth") {
                    createForm(anchors[foo]);
                }
            }
        }
    }
    function createForm(jshttpauth) {
        var form = document.createElement("form");
        form.action = jshttpauth.href;
        form.method = "get";
        form.onsubmit = login;
        form.id = httpauth.id;
        var username = document.createElement("label");
        var usernameInput = document.createElement("input");
        usernameInput.name = "username";
        usernameInput.type = "text";
        usernameInput.id = httpauth.id + "-username";
        username.appendChild(document.createTextNode("Username:"));
        username.appendChild(usernameInput);
        var password = document.createElement("label");
        var passwordInput = document.createElement("input");
        passwordInput.name = "password";
        passwordInput.type = "password";
        passwordInput.id = httpauth.id + "-password";
        password.appendChild(document.createTextNode("Password:"));
        password.appendChild(passwordInput);
        var submit = document.createElement("input");
        submit.type = "submit";
        submit.value = "Log in";
        form.appendChild(username);
        form.appendChild(password);
        form.appendChild(submit);
        jshttpauth.parentNode.replaceChild(form, jshttpauth);
    }

This looks for all anchors with the class of `httpauth` and replaces it
with a nice HTML form with the `login()` function bound to it's
`onsubmit` event.

So now if we set up a HTML page like the following, the login link will
be replaced with a login form (if the user has Javascript support) but
authenticate the user using HTTP auth:

    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
    <html lang="en">
        <head>
            <title>Javascript HTTP Auth Test</title>
            <script type="text/javascript" src="jshttpauth.js"></script>
        </head>
        <body>
            <a class="httpauth" id="private" href="private.php">Log in</a>
        </body>
    </html>

If our `private.php` looks like this, then we'll see that everything
works as we'd like:

    <?php
        define('USER', 'user');
        define('PASSWORD', 'password');
        if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])) {
            header('WWW-Authenticate: Basic realm="My Realm"');
            header('HTTP/1.0 401 Unauthorized');
            echo 'You hit cancel, good on you.';
        } elseif (isset($_SERVER['PHP_AUTH_USER']) && $_SERVER['PHP_AUTH_USER'] == USER && isset($_SERVER['PHP_AUTH_PW']) && $_SERVER['PHP_AUTH_PW'] == PASSWORD) {
            echo "<p>Hello {$_SERVER['PHP_AUTH_USER']}.</p>";
            echo "<p>You entered '{$_SERVER['PHP_AUTH_PW']}' as your password.</p>";
        } else {
            header('HTTP/1.0 400 Bad Request');
            echo "<p>You shall not pass!</p>";
        }
    ?>

The thing to notice about this script is the third part of the 'if'
statement. If the request doesn't have any auth details we send a
standard auth response, if it does and the details are correct then we
let them in, otherwise we send back a 400 error. This stops the clients
browser from asking the user for details again allowing the Javascript
to process the failure.

This also means that if the client doesn't have Javascript and fails to
authenticate correctly, it will never be asked for new credentials as
long as it keeps sending the bad auth data (which browsers will do).

Problems
--------

It's not all good just yet, this technique works in IE6 and Firefox but
is known not to work in both Opera and Safari, so if you care about
those browsers you may want to think again about using this (or to spend
some time investigating why it fails in those browsers).

HTTP Digest Auth
----------------

HTTP Digest is a way of authenticating a client while never sending the
clients password over the wire. To use Digest rather than Basic HTTP
Auth, we only need to adjust our PHP script to implement digest:

    <?php
        include 'digest.php';
        $HTTPDigest =& new HTTPDigest();
        $users = array(
            'user' => md5('user:'.$HTTPDigest->getRealm().':password')
        );
        if (!$HTTPDigest->getAuthHeader()) {
            $HTTPDigest-\>send();
            echo 'You hit cancel, good on you.';
        } elseif ($username = $HTTPDigest->authenticate($users)) {
            echo "<p>Hello $username.</p>";
            echo "<p>This resource is protected by HTTP digest.</p>";
        } else {
            header('HTTP/1.0 400 Bad Request');
            echo "<p>You shall not pass!</p>";
        }
    ?>

Conclusion
----------

So there we have it, there is no need for HTTP authentication to be
shunned, even for aesthetic reasons. HTTP auth offers lots of advantages
over using cookies:

-   It's simple to implement and no hassle to use, and clients love it.
-   It carries no baggage unlike cookies.
-   It's tried and tested, it's a standard and it works, your cookie
    based security model won't be as good.
-   We can use HTTP Digest which is pretty secure.
-   It's about as RESTful as you can get with authentication.

So we should be using it, there's no excuses anymore.

[I have put up an example of this code as a
demonstration](/sandbox/htmlhttpauth/).

**Note:** I was first introduced to this idea by Christian Jensen and
Jan Algermissen on [the REST Discuss mailing
list](http://groups.yahoo.com/group/rest-discuss/message/5623), so
credit should be sent their way.

**Update:** [Dimitri Glazkov](http://glazkov.com/) made me revisit using
HTTP Digest with this technique and realise that it does actually work,
thanks Dimitri.

**Update:** Travis Estill and [David
Kleinschmidt](http://david.kleinschmidt.name) reminded me that 401
responses shouldn't be returned without an Auth header and so a 403 is a
better response code. This also helps to make Safari behave too.