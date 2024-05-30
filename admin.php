<?php
require_once("model/Item.php");
require_once("model/User.php");
require_once("dbconnect.php");
?>
<!DOCTYPE html>

<html>
    <head>
        <link rel="stylesheet" href="styles.css" />
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script type="text/babel" src="Item.js"></script>
        <script type="text/babel" src="Cart.js"></script>
        <script type="text/babel" src="Controller.js"></script>
        <script type="text/babel" data-presets="react" src="components/Navigation.js"></script>
        <script type="text/babel" data-presets="react">
            ReactDOM.createRoot(document.getElementById("nav")).render(<Navigation />);
        </script>
        <meta charset="UTF-8">
        <title>Admin Panel</title>
    </head>
    <body>
        <nav id="nav"></nav>
        <table id="admin_item_table">
            <tr>
                <td>SKU</td>
                <td>Stock</td>
                <td>Name</td>
                <td>Description</td>
                <td>Price</td>
                <td>Edit</td>
            </tr>
            <?php
                foreach (fetchClass($conn, "SELECT * FROM ".Item::table, "Item") as $item) {
                    echo "<tr>
                    <td>".$item->sku."</td>
                    <td>".$item->quantity."</td>
                    <td>".$item->name."</td>
                    <td>".$item->description."</td>
                    <td>$".$item->price."</td>
                    <td><a href='edit_item.php?sku=".$item->sku."'><button>Edit</button></a></td>
                    </tr>";
                }
            ?>
        </table>
        <h2>Users</h2>
        <table id="admin_user_table">
            <tr>
                <td>ID</td>
                <td>Username</td>
                <td>Password Hash</td>
                <td>Is Admin?</td>
                <td>Edit</td>
            </tr>
            <?php
                foreach (fetchClass($conn, "SELECT * FROM ".User::table, "User") as $user) {
                    echo "<tr>
                    <td>".$user->id."</td>
                    <td>".$user->username."</td>
                    <td>".$user->passhash."</td>
                    <td>".$user->admin."</td>
                    <td><a href='edit_user.php?user_id=".$user->id."'><button>Edit</button></a></td>
                    </tr>";
                }
            ?>
        </table>
    </body>
</html>
