function User(id, name, passhash, is_admin) {
    this.id = id;
    this.name = name;
    this.passhash = passhash;
    this.admin = is_admin;
}

User.prototype.api_uri = "model/api/users.php";

User.prototype.getUser = async function (id) {
    const response = await fetch(User.prototype.api_uri+"?id="+id);
    const users = await response.json();
    return users && Object.setPrototypeOf(users[0], User.prototype);
}

User.prototype.getUsers = async function getUsers() {
    const response = await fetch(User.prototype.api_uri);
    const users = await response.json();
    return users && users.map((user) => Object.setPrototypeOf(user, User.prototype));
}