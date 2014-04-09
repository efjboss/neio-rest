<?php
header('Content-type: application/json');

$db = realpath(__DIR__) . '/db.sqlite';
$dbh = new PDO('sqlite:' . $db);

$data = file_get_contents('php://input');
if ($data) {
    $req = json_decode($data, true);
    $name = $req['name'];

    if (!empty($name)) {
        $query = "INSERT OR REPLACE INTO `template` (`name`, `data`) VALUES (:name, :data)";
        $sth = $dbh->prepare($query);
        $sth->bindParam(':name', $name);
        $sth->bindParam(':data', $data);
        $sth->execute();
        if ($res !== false) {
            echo json_encode(['status' => 'success', 'data' => $req]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Could not insert/update template' . var_export($dbh->errorInfo(), true)]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid format, no name found']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No data found']);
}

$dbh = null;
