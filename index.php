<!DOCTYPE html>

<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <header>
            <nav>
                <div></div>
            </nav>
        </header>
        <main>
            <div id="items"></div>
            <?
            $conn = new mysqli("localhost:3306", "admin", "password", "catalog");
            if ($conn->connect_error) {
                echo "<h1 style='color:red;'>Connection error</h1>";
            } else {
                echo "<h1 style='color:green;'>Connection successful</h1>";
            }
            ?>
        </main>
        <footer>

        </footer>
    </body>
</html>
