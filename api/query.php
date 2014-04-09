<?php

$data = file_get_contents('php://input');
if ($data) {
    header('Content-type: application/json');

    $request = json_decode($data, true);

    $url = $request['url'];
    $method = $request['method'];
    $params = $request['data'];

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 5);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);


    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    }

    $res = curl_exec($ch);

    //list($header, $content) = explode("\r\n\r\n", $res, 2);
    $content = $res;
    $headers = curl_getinfo($ch);
    $info = curl_getinfo($ch);
    //$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    echo json_encode(['headers' => $headers, 'content' => $content, 'status' => 0, 'info' => $info]);
}
