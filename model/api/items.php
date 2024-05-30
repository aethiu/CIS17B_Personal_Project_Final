<?php
require_once('../Item.php');
require_once('../../dbconnect.php');

switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST": {
        break;
    }

    case "GET": {
        $sql = "SELECT * FROM ".Item::table;
        if (array_key_exists("sku", $_GET)) {
            $sql .= ' WHERE sku="'.$_GET["sku"].'"';
        }
        $sql .= ";";
        echo json_encode(fetchClass($conn, $sql, "Item"));
        break;
    }
}