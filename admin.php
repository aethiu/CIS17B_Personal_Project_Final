<?php
require_once("model/Item.php");
require_once("model/User.php");
require_once("dbconnect.php");

function is_admin($conn, $id) {
    $sql = "SELECT admin FROM ".User::table." WHERE id='$id'";
    return $conn->query($sql)->fetch()[0];
}

session_start();

// Authorize logged in user
$authorized = false;
if (isset($_SESSION['user_id']) && is_admin($conn, $_SESSION['user_id'])) {
    $authorized = true;
} else {
    http_response_code(401);
    header("Location: index.php");
}

?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="styles.css" />
        <style>
            form {
                display: flex;
                flex-direction: column;
                align-content: space-between;
            }
            form > * {
                margin: 5px;
            }
            input {
                display: flex;
                justify-content: space-between;
            }
        </style>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script type="text/babel" src="User.js"></script>
        <script type="text/babel" src="Item.js"></script>
        <script type="text/babel" src="Cart.js"></script>
        <script type="text/babel" src="Controller.js"></script>
        <script type="text/babel" data-presets="react" src="components/Navigation.js"></script>
        <script type="text/babel" data-presets="react" src="components/ModalDialog.js"></script>
        <script type="text/babel" data-presets="react" src="admin.js"></script>
        <meta charset="UTF-8">
        <title>Admin Panel</title>
    </head>
    <body>
        <nav id="nav"></nav>
        <div id="root"></div>
    </body>
</html>
