<?php

$dsn = 'mysql:dbname=catalog;host=localhost:3306';
$user = 'admin';
$password = 'password';

$conn = new PDO($dsn, $user, $password);