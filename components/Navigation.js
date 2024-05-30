function getCookie(name) {
    return document.cookie.split("; ").find(row => row.startsWith(name))?.split('=')[1];
}

function Navigation() {
    const loggedInCookie = getCookie("logged_in");
    const usernameCookie = getCookie("username");
    const adminCookie = getCookie("admin");

    return (
        <nav>
            <a className="logo" href="index.php">CATALOG</a>
            {adminCookie && <a href="admin.php">Admin Panel</a>}            
            {loggedInCookie == "true" ? "Welcome, "+usernameCookie : <><a>Sign Up</a><a href="login.php">Login</a></>}
            <a href="cart.php">Cart</a>
        </nav>
    );
}