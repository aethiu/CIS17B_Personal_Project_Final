<?php
require_once "../../dbconnect.php";
require_once "../Item.php";
require_once "../Order.php";

switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET": {
        echo json_encode(Order::get($conn, @$_GET["number"]));

        break;
    }
}