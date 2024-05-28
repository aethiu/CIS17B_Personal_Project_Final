<?php
require_once("../User.php");
require_once('../../dbconnect.php');

switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST": {
        break;
    }

    case "GET": {
        $sql = "SELECT * FROM ".User::table;
        if (array_key_exists("sku", $_GET)) {
            $sql .= " WHERE sku = ".$_GET["sku"];
        }
        $sql .= ";";
        $statement = $conn->prepare($sql);
        $statement->setFetchMode(PDO::FETCH_CLASS, "Item");
        $statement->execute();

        echo json_encode($statement->fetchAll());
        break;
    }
}