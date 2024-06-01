<?php
require_once('../Item.php');
require_once('../../dbconnect.php');

switch ($_SERVER["REQUEST_METHOD"]) {
    case "PATCH": {
        $sql = "UPDATE ".Item::table." SET ";

        // Check for SKU query
        if (!array_key_exists("sku", $_GET)) {
            http_response_code(400);
            break;
        } 

        // Parse JSON body
        $data = json_decode(file_get_contents("php://input"));
        if (!$data) {
            http_response_code(400);
            break;
        }
        if (empty($data)) {
            http_response_code(204);
            break;
        }

        // Build SQL query
        foreach ($data as $key => $val) {
            $sanitized_key = htmlspecialchars($key);
            $sanitized_val = htmlspecialchars($val);
            $sql .= $sanitized_key."='".$sanitized_val."', ";
        }
        $sql = substr($sql, 0, -2)." WHERE sku=".htmlspecialchars($_GET["sku"]).";";
        // Execute SQL query
        try {
            if ($conn->exec($sql) === false) {
                http_response_code(500);
            } else {
                echo json_encode($data);
            }
        } catch (PDOException $e) {
            http_response_code(500);
        }

        break;
    }


    case "GET": {
        $sql = "SELECT * FROM ".Item::table;
        if (array_key_exists("sku", $_GET)) {
            $sql .= " WHERE sku=".htmlspecialchars($_GET["sku"]);
        }
        if (array_key_exists("sort", $_GET)) {
            $sql .= " ORDER BY ".htmlspecialchars($_GET["sort"]);
        }
        if (array_key_exists("page", $_GET)) {
            $page = htmlspecialchars($_GET["page"]) - 1;
            $limit = htmlspecialchars($_GET["limit"] ?? 10);
            $offset = $page * $limit;
            $sql .= " LIMIT $offset, $limit";
        }
        $sql .= ";"
        ;
        echo json_encode(fetchClass($conn, $sql, "Item"));

        break;
    }
}