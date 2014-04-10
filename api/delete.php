<?php
header('Content-type: application/json');

$db = realpath(__DIR__) . '/db.sqlite';
$dbh = new PDO('sqlite:' . $db);

$data = file_get_contents('php://input');
if ($data) {
    $req = json_decode($data, true);
    $name = $req['name'];

    if (!empty($name)) {
        $query = "DELETE FROM `template` WHERE `name` = :name";
        $sth = $dbh->prepare($query);
        $sth->bindParam(':name', $name);
        $sth->execute();
        if ($res !== false) {
            echo json_encode(['status' => 'success', 'message' => 'Deleted ' . $name . ' successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Could not delete template' . var_export($dbh->errorInfo(), true)]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No template found' . var_export($data, true)]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No data found']);
}

$dbh = null;
