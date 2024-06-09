<?php
require_once("../Item.php");
require_once("../Order.php");
require_once("../../dbconnect.php");

session_start();

const tax_rate = 0.07;
const shipping = 12.00;

switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST": {
        // Check login status
        if (!isset($_SESSION["user_id"])) { 
            http_response_code(401);
            echo "{error: 'Not logged in'}";
            return; 
        }

        // Check request body
        $body = json_decode(file_get_contents("php://input"));
        if (empty($body->cart)) {
            http_response_code(400);
            echo "{error: 'Missing cart'}";
            return;
        }

        // Create order
        $order = new Order();
        $order->user_id = $_SESSION["user_id"];

        // Resolve SKUs and calculate subtotal
        $order->subtotal = 0;
        $cart = $body->cart;
        $items = [];
        foreach ($cart as $sku => $quantity) {
            $item = Item::get($conn, $sku);
            if ($item && $item->quantity >= $quantity) {
                $order->subtotal += $item->price * $quantity;
                $order->items[$sku] = $quantity;
                array_push($items, $item);
            }
        }

        // Calculate total
        $order->tax = tax_rate * $order->subtotal;
        $order->shipping = shipping;
        $order->total = $order->subtotal + $order->tax + $order->shipping;

        // Store order and response with a representation of the order
        $json = json_encode($order);
        $_SESSION["order"] = $json;
        $_SESSION["order_items"] = json_encode($items);
        echo $_SESSION["order"];
        echo $_SESSION["order_items"];
        echo $json;
        
        break;
    }

    case "PUT": {
        if (!isset($_SESSION["order"])) {
            http_response_code(400);
            return;
        }

        $order = json_decode($_SESSION["order"]);

        $conn->beginTransaction();
        
        // Insert new order
        // Must be inserted first to initialize order and data 
        // and satisfy xref foreign key constraints
        $orderTable = Order::table;
        $conn->exec("INSERT INTO $orderTable (user_id, subtotal, tax, shipping, total) VALUES ($order->user_id, $order->subtotal, $order->tax, $order->shipping, $order->total);\n");

        // Update order object
        $order->number = $conn->lastInsertId();
        $order->date = $conn->query("SELECT date FROM $orderTable WHERE number=$order->number")->fetch()[0];

        // Build queries to modify stock quantities and insert 
        // items into order-item xref table
        $itemTable = Item::table;
        $xrefTable = "xref_order_item";
        $itemSql = "";
        $xrefOrderItemSql = "INSERT INTO $xrefTable (order_number, sku, quantity) VALUES ";
        foreach ($order->items as $sku => $quantity) {
            $itemSql .= "UPDATE $itemTable SET quantity=quantity-$quantity WHERE sku=$sku;\n";
            $xrefOrderItemSql .= "($order->number, $sku, $quantity), ";
        }
        $xrefOrderItemSql = substr($xrefOrderItemSql, 0, -2).";";
        
        // Execute item and xref queries
        $conn->exec($itemSql);
        $conn->exec($xrefOrderItemSql);

        // Commit transaction
        if ($conn->commit()) {
            http_response_code(201);

            // Cleanup order and cart
            $_SESSION["order"] = null;
            $_SESSION["order_items"] = null;
            
            echo json_encode($order);
        } else {
            http_response_code(500);
        }

        break;
    }


    case "GET": {
        if (isset($_SESSION["order"]) && isset($_SESSION["order_items"])) {
            echo '{"order":'.$_SESSION["order"].',"items":'.$_SESSION["order_items"].'}';
        }
        break;
    }
}