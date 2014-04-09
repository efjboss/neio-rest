<?php
header('Content-type: application/json');

$db = realpath(__DIR__) . '/db.sqlite';
$dbh = new PDO('sqlite:' . $db);

$dbh->query('CREATE TABLE IF NOT EXISTS `template` (`name` TEXT PRIMARY KEY, `data` TEXT NOT NULL)');
$dbh = null;
