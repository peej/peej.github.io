<?php
/*
include 'httpdigest.php';

$HTTPDigest =& new HTTPDigest();
$users = array(
    'user' => md5('user:'.$HTTPDigest->getRealm().':password')
);

if (!$HTTPDigest->getAuthHeader()) {
    $HTTPDigest->send();
    echo 'You hit cancel, good on you.';
} elseif ($username = $HTTPDigest->authenticate($users)) {
    echo "<p>Hello $username.</p>";
    echo "<p>This resource is protected by HTTP digest.</p>";
} else {
    header('HTTP/1.0 401 Unauthorized');
    echo "<p>You shall not pass!</p>";
} 
//*/
//*
define('USER', 'user');
define('PASSWORD', 'password');

if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])) {
    header('WWW-Authenticate: Basic realm="Basic Auth"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'You hit cancel, good on you.';
} elseif (isset($_SERVER['PHP_AUTH_USER']) && $_SERVER['PHP_AUTH_USER'] == USER && isset($_SERVER['PHP_AUTH_PW']) && $_SERVER['PHP_AUTH_PW'] == PASSWORD) {
    echo "<p>Hello {$_SERVER['PHP_AUTH_USER']}.</p>";
    echo "<p>You entered '{$_SERVER['PHP_AUTH_PW']}' as your password.</p>";
    echo '<p><a href="index.html">Back to the log in screen</a></p>';
} else {
    header('HTTP/1.0 401 Unauthorized');
    echo "<p>You shall not pass!</p>";
}
//*/
?>
