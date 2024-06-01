<?php
require_once("../User.php");
require_once('../../dbconnect.php');


switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST": {
        foreach ($_POST as $key => $val) {
            echo "$key\t$val<br/>";
        }
        break;
    }

    case "GET": {
        $sql = "SELECT * FROM ".User::table;
        if (array_key_exists("username", $_GET)) {
            $sql .= ' WHERE username="'.$_GET["username"].'"';
        }
        $sql .= ";";
        echo json_encode(fetchClass($conn, $sql, "User"));
        break;
    }
}