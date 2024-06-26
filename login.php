<?php
require_once("model/User.php");
require_once("dbconnect.php");

session_start();

$error = "";
$logged_in = false; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $statement = $conn->prepare('SELECT * FROM '.User::table.' WHERE username="'.htmlspecialchars($_POST["username"]).'"');
    $statement->setFetchMode(PDO::FETCH_CLASS, "User");
    $statement->execute();

    $user = $statement->fetch();

    if (!$user) {
        $error = "User not found.";
    } elseif (!password_verify(htmlspecialchars($_POST["password"]), $user->passhash)) {
        $error = "Incorrect password.";
    } else {
        $logged_in = true;
        $_SESSION["user_id"] = $user->id;
        if ($user->admin) {
            setcookie("admin", "1"); // Tells the UI to display a link to the Admin Panel
        }
        setcookie("username", $user->username);
        setcookie("logged_in", "1");
    }
} 
// Logged in cookie isn't visible until page reload
if ($logged_in == true OR isset($_COOKIE["logged_in"]) && $_COOKIE["logged_in"] == "1") {
    header('Location: index.php');
}

?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="styles.css" />
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script type="text/babel" data-presets="react" src="components/Navigation.js"></script>
        <script type="text/babel" data-presets="react">
            const root = ReactDOM.createRoot(document.getElementById("nav"));
            root.render(<Navigation/>);
        </script>
        <meta charset="UTF-8">
        <title>Login</title>
    </head>
    <body>
        <nav id="nav"></nav>
        <span style="color:red"><?php echo $error ?></span>
        <form method="post">
            <label for="username">Username</label>
            <input type="text" name="username" min=3 max=32 required></input>
            <br/>
            <!-- <label for="email">E-Mail</label>
            <input type="email" name="email" required></input> -->
            <br/>
            <label for="password">Password</label>
            <input type="password" name="password" min=8 max=64 required></input>
            <br/>
            <button>Login</button>
        </form>
    </body>
</html>