function User(id, name, passhash, is_admin) {
    this.id = id;
    this.name = name;
    this.passhash = passhash;
    this.admin = is_admin;
}

User.prototype.api_uri = "model/api/users.php";