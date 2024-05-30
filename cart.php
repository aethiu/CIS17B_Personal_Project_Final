<!DOCTYPE html>

<html>
    <head>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script type="text/babel" src="Item.js"></script>
        <script type="text/babel" src="Cart.js"></script>
        <script type="text/babel" src="Controller.js"></script>
        <script type="text/babel" data-presets="react" src="cart_view.js"></script>
        <meta charset="UTF-8">
        <title>Cart</title>
    </head>
    <body>
        <div id="items_container"></div>
        <button type="button">Submit order</button>
    </body>
</html>