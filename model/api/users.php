<?php
require_once("../User.php");
require_once('../../dbconnect.php');

switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST": {
        $columns = "(";
        $values = "("; 
        foreach($_POST as $key => $value) {
            $column = htmlspecialchars($key);
            $value = htmlspecialchars($value);

            if ($column == "password") {
                $column = "passhash";
                $value = password_hash($value, PASSWORD_DEFAULT);
            }

            $columns .= "$column, ";
            $values .= "'$value', ";
        }
        $columns = substr($columns, 0, -2).")";
        $values = substr($values, 0, -2).")";
        $sql = "INSERT INTO ".User::table." $columns VALUES $values;";
        if ($conn->exec($sql) === false) {
            http_response_code(500);
        } else {
            http_response_code(201);

        }
        break;
    }

    case "PATCH": {
        $sql = "UPDATE ".User::table." SET ";

        // Check for ID query
        if (!array_key_exists("id", $_GET)) {
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
        $sql = substr($sql, 0, -2)." WHERE id=".htmlspecialchars($_GET["id"]).";";
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

    case "DELETE": {
        $sql = "DELETE FROM ".User::table." WHERE id=".htmlspecialchars($_GET["id"].";");
        echo $conn->exec($sql);
        break;
    }

    case "GET": {
        $sql = "SELECT * FROM ".User::table;
        if (array_key_exists("username", $_GET)) {
            $sql .= ' WHERE username="'.$_GET["username"].'"';
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
        $sql .= ";";
        echo json_encode(fetchClass($conn, $sql, "User"));
        break;
    }
}