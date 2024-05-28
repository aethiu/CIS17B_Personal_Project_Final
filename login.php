<?php
require_once("model/User.php");
require_once("dbconnect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $statement = $conn->prepare("SELECT * FROM ".User::table." WHERE username=".htmlspecialchars($_POST["username"]));
    $statement->setFetchMode(PDO::FETCH_CLASS, "User");
    $statement->execute();

    $user = $statement->fetch();

    if (password_verify(htmlspecialchars($_POST["password"]), $user->passhash)) {
        setcookie("user_id", $user->id);
        setcookie("logged_in", "true");
        header('Location: index.php');
    }
} elseif (isset($_COOKIE["logged_in"]) && $_COOKIE["logged_in"] == "true") {
    header('Location: index.php');
}
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Login</title>
    </head>
    <bodY>
        <form method="post">
            <label for="username">Username</label>
            <input type="text" name="username" min=3 max=32 required></input>
            <br/>
            <label for="email">E-Mail</label>
            <input type="email" name="email" required></input>
            <br/>
            <label for="password">Password</label>
            <input type="password" name="password" min=8 max=64 required></input>
            <br/>
            <button>Login</button>
        </form>
    </bodY>
</html>