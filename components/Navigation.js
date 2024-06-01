function getCookie(name) {
    return document.cookie.split("; ").find(row => row.startsWith(name))?.split('=')[1];
}

function Navigation() {
    const loggedInCookie = getCookie("logged_in");
    const usernameCookie = getCookie("username");
    const adminCookie = getCookie("admin");

    let welcomePrompt;
    if (loggedInCookie == "1") {
        welcomePrompt = <><div id="welcome_message">Welcome, {usernameCookie}</div><a href="logout.php">Log Out</a></>
    } else {
        welcomePrompt = <><a>Sign Up</a><a href="login.php">Login</a></>
    }

    return (
        <nav>
            <a className="logo" href="index.php">CATALOG</a>
            {adminCookie && <a href="admin.php">Admin Panel</a>}            
            {welcomePrompt}
            <a href="cart.php">Cart</a>
        </nav>
    );
}