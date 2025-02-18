<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$response = array();

$data = json_decode(file_get_contents("php://input"));
$request = $data->request;
$clientno = $data->clientno;
include('refreshDB.php');

// Add record
if($request == 2){ 
  include 'server.php';
  
  $yyyy = $data->yyyy;
  $mm = $data->mm;
  $aryItems = json_decode($data->aryItems,true);   
   //$aryItems = $data->aryItems;
  // $sysdate=date('Y-m-d h:i:s', strtotime($sysdate));
  //Delete first
  $sql="DELETE FROM monthly WHERE year(date)=:yyyy and month(date)=:mm";
  $stmt = $DBserver->prepare($sql);
  $stmt->execute(array(':yyyy' => $yyyy, ':mm' => $mm));
  //
  $max_Ctr=count($aryItems);
  for($i=0;$i<$max_Ctr;$i++) {	    
    //$mdate=date('Y-m-d h:i:s', strtotime($aryItems[$i]["date"]));
    $mdate=$aryItems[$i]["date"];
    $vValues="INSERT INTO `monthly`(date,descrp) VALUES (:date,:descrp)"; 
    $stmt = $DBserver->prepare($vValues);
    $stmt->execute(array(
      ':date'  => date('Y-m-d h:i:s', strtotime($aryItems[$i]["date"])),
       //':date'  => $mdate,
       ':descrp'  => $aryItems[$i]["descrp"]
    ));	
  } //$aryItems[$i]['idcode']
  
  $response=returnAllData("select * from monthly","");   
  echo json_encode($response);
  exit; 
}

