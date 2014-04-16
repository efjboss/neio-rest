<?php

$data = file_get_contents('php://input');
if ($data) {
    header('Content-type: application/json');

    $request = json_decode($data, true);

    $url = $request['url'];
    $method = $request['method'];
    $requestHeaders = $request['headers'];
    $params = $request['data'];

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $requestHeaders);
    if (!ini_get('open_basedir')) {
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 5);
    }
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);


    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    }

    $res = curl_exec($ch);

    $content = $res;
    $headers = curl_getinfo($ch);
    $info = curl_getinfo($ch);

    curl_close($ch);

    echo json_encode(['headers' => $headers, 'content' => $content, 'status' => 0]);
}
