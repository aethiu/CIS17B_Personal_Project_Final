<?php
session_start();

if (isset($_SESSION["user_id"])) {
    if (session_destroy()) {
        setcookie("PHPSESSID", "", time()-3600, '/', '', 0, 0);
        setcookie("admin", "", time()-3600);
        setcookie("logged_in", "", time()-3600);
        setcookie("username", "", time()-3600);
        $_SESSION = array();
    }
} 

header("Location: index.php");