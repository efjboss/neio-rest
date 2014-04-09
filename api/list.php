<?php
header('Content-type: application/json');

$db = realpath(__DIR__) . '/db.sqlite';
$dbh = new PDO('sqlite:' . $db);

$rows = [];
foreach($dbh->query('SELECT * FROM `template`') as $row) {
    array_push($rows, json_decode($row['data'], true));
}

echo json_encode($rows);

$dbh = null;
