<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$response = array();

$data = json_decode(file_get_contents("php://input"));
$request = $data->request;
$clientno = $data->clientno;
include('refreshDB.php');

// Fetch All records
if($request == 0){      
  $response=returnAllData("select * from user","");  
  echo json_encode($response);
  exit;
}

// Fetch a record only 1
if($request == 1){  
    $response=returnAllData("select * from user","");  
  echo json_encode($response);
  exit;
}

//kkkk

// Add record
if($request == 2){ 
  include 'server.php';
  $sysdate = $data->sysdate; 
  $sysdate=date('Y-m-d h:i:s', strtotime($sysdate));
  
  $sql="UPDATE sysfile SET sys_date=:sysdate";
  $stmt = $DBserver->prepare($sql);
  $stmt->execute(array(':sysdate'  => $sysdate));		

  $response=returnAllData("select * from sysfile","");  
  echo json_encode($response);
  exit; 
}

//Add record expi
if($request == 22){ 
  $sysdate = $data->sysdate; 
  $aryItems = 1; //json_decode($data->aryItems,true);   
  
  $sysdate=date('Y-m-d h:i:s', strtotime($sysdate));
  //$arry = $data->arry; 
  //$mm = month($date);
  //$yyyy = year($date);
  
  $sql="UPDATE sysfile SET sys_date=:sysdate";
  $stmt = $DBcon->prepare($sql);
  $stmt->execute(array(':sysdate'  => $sysdate));		
  //$response[0]=returnAllData("user","");  
  $response[0]=returnAllData("select * from daily","");  
  echo json_encode($response);
  exit;
}

// Update record
if($request == 3){
  $usercode = $data->usercode;
  $userid = $data->userid;
  $pword = $data->pword;
  $username = $data->username;
  $usertype = $data->usertype;
  $photo = $data->photo;
  $addrss = $data->addrss;
  $celno = $data->celno;
  $lat = $data->lat; 
  $lng = $data->lng; 
  $fb = '';
  $email='';
  
  $sql="UPDATE user SET usercode=:usercode,userid=:userid,username=:username,pword=:pword,usertype=:usertype,photo=:photo,addrss=:addrss,
      celno=:celno,fb=:fb,email=:email where usercode=:usercode and clientno=:clientno";
  $stmt = $DBcon->prepare($sql);
  $stmt->execute(array( ':usercode'  => $usercode,
                        ':userid'  => $userid,
                        ':username'  => $username,
                        ':pword'  => $pword,
                        ':usertype'  => $usertype,
                        ':photo'  => $photo,
                        ':addrss'  => $addrss,
                        ':celno'  => $celno,
                        ':fb'  => $fb,
                        ':email'  => $email,          
                        ':clientno' => $clientno
                        ));
  echo json_encode(returnAllData($clientno,'user',''));
  exit;
}
if($request == 301){
  $usercode = $data->usercode;
  $usertype = $data->usertype;
  
  $sql="UPDATE user SET usertype=:usertype where usercode=:usercode and clientno=:clientno";
  $stmt = $DBcon->prepare($sql);
  $stmt->execute(array( ':usercode'  => $usercode,
                        ':usertype'  => $usertype,
                        ':clientno' => $clientno
                        ));
  echo json_encode(returnAllData('user',''));
  exit;
}
if($request == 302){
  $lat = $data->lat;
  $lng = $data->lng;
  $usercode = $data->usercode;
  $sql="UPDATE user SET lat=:lat, lng=:lng where usercode=:usercode and clientno=:clientno";
  $stmt = $DBcon->prepare($sql);
  $stmt->execute(array(
                        ':lat'  => $lat,
                        ':lng'  => $lng,
                        ':usercode'  => $usercode,                    
                        ':clientno' => $clientno
                        ));
  echo json_encode(returnAllData($clientno,"user",""));
  exit;
}

// Delete record
if($request == 4){
  $usercode = $data->usercode; 
  $photo = $data->photo;
	$ddir = $data->ddir;
  $sql="DELETE FROM user WHERE usercode=:usercode and clientno=:clientno";
  $stmt = $DBcon->prepare($sql);
  $stmt->execute(array(':usercode' => $usercode,':clientno' => $clientno));
   
  //Delete user image      
	if(file_exists($ddir.$photo)) {
    unlink($ddir.$photo);
  }
  echo json_encode(returnAllData($clientno,'user',''));
  exit;
}