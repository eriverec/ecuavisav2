<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://200.7.199.70:10001/api/Trx/mdb/ISugerencia',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'{
    "_id": "659ecf46f88896ff346d3bbf",
    "description": "asasss",
    "title": "pruebaa2",
    "estado": false,
    "meta_existe": true,
    "users_suscribed": 0,
    "data": [],
    "created_at": "2023-04-28T03:43:57.278Z"
}',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;

