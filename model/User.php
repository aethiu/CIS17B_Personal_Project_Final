<?php
class User {
    public $id = 0;
    public $admin = false;
    public $username = "";
    public $passhash= "";
    const table = "entity_user";
}