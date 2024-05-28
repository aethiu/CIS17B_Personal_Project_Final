<?php
require_once('../Item.php');
require_once('../../dbconnect.php');

switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST": {
        break;
    }

    case "GET": {
        $sql = "SELECT * FROM ".Item::table;
        // Search for specific SKU
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