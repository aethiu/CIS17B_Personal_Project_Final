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
        <script type="text/babel" src="Item.js"></script>
        <script type="text/babel" src="Cart.js"></script>
        <script type="text/babel" src="Controller.js"></script>
        <script type="text/babel" data-presets="react" src="components/Navigation.js"></script>
        <script type="text/babel" data-presets="react" src="admin.js"></script>
        <meta charset="UTF-8">
        <title>Admin Panel</title>
    </head>
    <body>
        <nav id="nav"></nav>
        <div id="root"></div>

        <h2>Items</h2>
        <table id="item_table">
            <tr>
                <td id="item_sku">SKU</td>
                <td id="item_quantity">Stock</td>
                <td id="item_name">Name</td>
                <td id="item_description">Description</td>
                <td id="item_price">Price</td>
                <td id="item_edit">Edit</td>
            </tr>
            <?php
                foreach (fetchClass($conn, "SELECT * FROM ".Item::table, "Item") as $item) {
                    echo "<tr id='item_$item->sku'>
                    <td>".$item->sku."</td>
                    <td>".$item->quantity."</td>
                    <td>".$item->name."</td>
                    <td>".$item->description."</td>
                    <td>".$item->price."</td>
                    <td>
                        <div>
                            <button onclick=\"handleEditClick('item_table', 'item_$item->sku', 'model/api/items.php?sku=$item->sku')\">Edit</button>
                            <button onclick=\"handleDeleteClick('model/api/items.php?sku=$item->sku')\">Delete</button>
                        </div>
                    </td>
                    </tr>";
                }
            ?>
        </table>

        <h2>Users</h2>
        <button type="button" onclick="document.getElementById('add_user_dialog').showModal()">Add User</button>
        <table id="user_table">
            <tr>
                <td id="user_id">ID</td>
                <td id="user_username">Username</td>
                <td id="user_passhash">Password Hash</td>
                <td id="user_admin">Is Admin?</td>
                <td id="user_actions">Actions</td>
            </tr>
            <?php
                foreach (fetchClass($conn, "SELECT * FROM ".User::table, "User") as $user) {
                    echo "<tr id='user_$user->id'>
                    <td>".$user->id."</td>
                    <td>".$user->username."</td>
                    <td>".$user->passhash."</td>
                    <td>".$user->admin."</td>
                    <td>
                        <div>
                            <button onclick=\"handleEditClick('user_table','user_$user->id', 'model/api/users.php?id=$user->id')\">Edit</button>
                            <button onclick=\"handleDeleteClick('model/api/users.php?id=$user->id')\">Delete</button>
                        </div>
                    </td>
                    </tr>";
                }
            ?>
        </table>

        <dialog id="edit_dialog">
            <form id="edit_form" method="dialog"></form>
        </dialog>

        <dialog id="add_user_dialog">
            <form d="add_user_form" method="dialog">
                <div>
                    <label for="username">Username</label>
                    <input name="username"></input>
                </div>
                <div>
                    <label for="password">Password</label>
                    <input name="password" type="password"></input>
                </div>
                <div>
                    <label for="admin">Admin?</label>
                    <input name="admin" type="checkbox" value="1"></input>
                </div>
                <div>
                    <button onclick="handleSubmitClick(this, 'model/api/users.php', 'POST')">Submit</button>
                    <button type="button" onclick="document.getElementById('add_user_dialog').close()">Cancel</button>
        </dialog>
    </body>
</html>
