<?php
session_start();

if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
}

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
        <script type="text/babel" data-presets="react" src="checkout.js"></script>
        <meta charset="UTF-8">
        <title>Checkout</title>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>