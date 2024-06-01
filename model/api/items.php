<?php
require_once('../Item.php');
require_once('../../dbconnect.php');

switch ($_SERVER["REQUEST_METHOD"]) {
    case "PATCH": {
        $sql = "UPDATE ".Item::table." SET ";
        foreach ($_POST as $key => $val) {
            $sanitized_key = htmlspecialchars($key);
            $sanitized_val = htmlspecialchars($val);
            $sql .= $sanitized_key."='".$sanitized_val."', ";
        }
        $sql = substr($sql, 0, -2)." WHERE sku='".htmlspecialchars($_POST["sku"])."';";
        $conn->exec($sql);
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