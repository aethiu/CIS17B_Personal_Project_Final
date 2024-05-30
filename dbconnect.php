<?php

$dsn = 'mysql:dbname=catalog;host=localhost:3306';
$user = 'admin';
$password = 'password';

$conn = new PDO($dsn, $user, $password);

function fetchClass($conn, $sql, $className) {
    $statement = $conn->prepare($sql);
    $statement->setFetchMode(PDO::FETCH_CLASS, $className);
    $statement->execute();
    return $statement->fetchAll();
}