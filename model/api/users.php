<?php
require_once("../User.php");
require_once('../../dbconnect.php');

switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST": {
        break;
    }

    case "GET": {
        $sql = "SELECT * FROM ".User::table;
        if (array_key_exists("username", $_GET)) {
            $sql .= ' WHERE username="'.$_GET["username"].'"';
        }
        $sql .= ";";
        $statement = $conn->prepare($sql);
        $statement->setFetchMode(PDO::FETCH_CLASS, "User");
        $statement->execute();

        echo json_encode($statement->fetchAll());
        break;
    }
}