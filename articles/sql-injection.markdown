---
layout: article
title: SQL Injection
date: Aug 1, 2001
---

The checking of user input is often overlooked by web developers but is
very important to close serious vulnerabilities in web systems. I am
currently working on a project for a client that involves rewriting and
designing their existing web application. This process started with
looking at their existing system.

Within 10 minutes of investigation I was able to drop their entire
database just through their web sites log in box. I was able to do this
for the following reasons:

-   The log in form textbox had no maximum input length set, allowing me
    to enter a large input string including my concoction of SQL. This
    hole is not required as I could have written a spoof form without a
    maximum input length, but it made my life easier non-the-less.
-   There was no length checking for the username field. Their username
    database field is 10 chars long, and yet the server code did not
    check to make sure my input was 10 or fewer characters.
-   There was no invalid character stripping or conversion. By allowing
    me to place a single quote in the input text, I was able to fool
    their system into allowing me to run arbitrary SQL code on their
    database server.
-   The database user had full permissions on the database, including
    delete and drop permission.

By submitting code similar to what I've written below, I was able to
execute whatever SQL I wanted on their database just through my web
browser:

> '; DROP DATABASE dbname; SELECT \* FROM tbluser WHERE username = '

When this input is concatenated with the rest of the database query
string, the following SQL query is created and executed on the database:

> SELECT \* FROM tbluser WHERE username = ''; DROP DATABASE dbname;
> SELECT \* FROM tbluser WHERE username = '';

The first two characters of the user input terminate the first select
statement, the next statement does the malicious drop of the database,
and the last select statement is a dummy statement to use the original
closing quote and make sure the whole query string is valid.

Of course, the attacker needs to know the name of the database or any
other database structures that they need to reference, but these are
often easy to guess by trial and error or by making the database throw
up errors if they are not caught by the web application.

I hope this little demonstration of web app security is useful to web
developers and makes clear the point of why checking user input from web
forms is important.

This type of web application attack has been given the name of an "SQL
Injection" attack since I originally wrote this article, so the title of
the article has been changed to reflect this fact even though the
validation of user input effects more than just SQL injection attacks.