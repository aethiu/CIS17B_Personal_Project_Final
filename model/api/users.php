<?php
require_once("../User.php");
require_once('../../dbconnect.php');

switch ($_SERVER["REQUEST_METHOD"]) {
    case "PATCH": {
        $sql = "UPDATE ".User::table." SET ";
        foreach ($_POST as $key => $val) {
            $sanitized_key = htmlspecialchars($key);
            $sanitized_val = htmlspecialchars($val);
            $sql .= $sanitized_key."='".$sanitized_val."', ";
        }
        $sql = substr($sql, 0, -2)." WHERE id='".htmlspecialchars($_POST["id"])."';";
        $conn->exec($sql);
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