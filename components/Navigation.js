function Navigation() {
    const loggedInCookie = document.cookie.split(';').find(row => row.startsWith("logged_in"))?.split('=')[1];

    return (
        <nav>
            <a className="logo" href="index.php">CATALOG</a>
            {loggedInCookie == '1' ? <a>Admin Panel</a> : <><a>Sign Up</a><a href="login.php">Login</a></>}
            <a href="cart.php">Cart</a>
        </nav>
    );
}