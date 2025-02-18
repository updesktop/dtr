<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$response = array();

$data = json_decode(file_get_contents("php://input"));
$request = $data->request;
//$clientno = $data->clientno;
include('refreshDB.php');


if($request == 0){    
  $vdate = $data->vdate; 
  $usercode = $data->usercode; 
  //$sdate=date('Y-m-d h:i:s', strtotime($vdate));
  $response=returnAllData("select * from daily where date = :vdate and usercode=:usercode",array(':vdate' => $vdate,':usercode' => $usercode));
  echo json_encode($response);
  exit;
}
?>
  