<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$response = array();

$data = json_decode(file_get_contents("php://input"));
$request = $data->request;
//include 'server.php';
include('refreshDB.php');

// Fetch All records
if($request == 0){      
  $response=returnAllData("select * from user","");  
  echo json_encode($response);
  exit;
}

// Fetch a record only 1
if($request == 1){  
  $usercode = $data->usercode; 
  echo json_encode(returnAllData('user'));
  exit;
}

if($request == 101){    
  $userid = $data->userid; 
  $pword = $data->pword; 
  $response=returnAllData("SELECT * from user WHERE userid=:userid and pword=:pword",
    array(':userid'  => $userid,':pword'  => $pword)
  );    
  echo json_encode($response);
  exit;
}

if($request == 1101){  
  $userid = $data->userid; 
  $pword = $data->pword; 
    
  $stmt = $DBcon->prepare("SELECT * from user WHERE userid=:userid and pword=:pword and clientno=:clientno");
  $stmt->execute(array(':userid'  => $userid,':pword'  => $pword,':clientno'  => $clientno));
  while($rows=$stmt->FETCH(PDO::FETCH_ASSOC)) {     
    $response[] = $rows;    
  } 
  echo json_encode($response);    
  exit;
}

// Add record
if($request == 2){ 
  include 'server.php';
  $usercode = $data->usercode; 
  $userid = $data->userid; 
  $pword = $data->pword; 
  $username = $data->username; 
  $fullname = $data->fullname; 
  $photo = $data->photo;
  $addrss = $data->addrss; 
  $celno = $data->celno; 
  $lat = $data->lat; 
  $lng = $data->lng; 
  $usertype = 0;
  $fb='';
  $email='';
  $d_active = date('Y-m-d H:i:s');

  $sql0="SELECT * from user WHERE userid=:userid and pword=:pword";
  $stmt = $DBserver->prepare($sql0);
  $stmt->execute(array(':userid'  => $userid, ':pword'  => $pword));		
  $vrow=$stmt->rowCount();
  if($stmt->rowCount()){
    echo "EXIST " & $vrow;
  }else{
    $sql="INSERT INTO `user` (usercode,userid,username,username2,fullname,pword,usertype,photo,addrss,celno,fb,email,d_active,lat,lng)
        VALUES (:usercode,:userid,:username,:username2,:fullname,:pword,:usertype,:photo,:addrss,:celno,:fb,:email,:d_active,:lat,:lng)";
    $stmt = $DBserver->prepare($sql);
    $stmt->execute(array( 
                          ':usercode'  => $usercode,
                          ':userid'  => $userid,
                          ':username'  => $username,
                          ':username2'  => $username,
                          ':fullname' => $fullname,
                          ':pword'  => $pword,
                          ':usertype'  => $usertype,
                          ':photo'  => $photo,
                          ':addrss'  => $addrss,
                          ':celno'  => $celno,
                          ':fb'  => $fb,
                          ':email'  => $email,                          
                          ':d_active'  => $d_active,
                          ':lat'  => $lat,
                          ':lng'  => $lng
                          ));
    //echo "ADDED";
    echo json_encode(returnAllData('select * from user',''));
  }
  exit;
}

// Update record
if($request == 3){
  include 'server.php';
  $usercode = $data->usercode;
  $userid = $data->userid;
  $pword = $data->pword;
  $username = $data->username;
  $username2 = $data->username2;
  $fullname = $data->fullname; 
  $photo = $data->photo;
  
  $addrss = $data->addrss;
  $celno = $data->celno;
  
  $sql="UPDATE user SET userid=:userid,username=:username,username2=:username2,fullname=:fullname,pword=:pword,photo=:photo,addrss=:addrss,
      celno=:celno where usercode=:usercode";
  $stmt = $DBserver->prepare($sql);
  $stmt->execute(array( 
                        ':usercode'  => $usercode,
                        ':userid'  => $userid,
                        ':username'  => $username,
                        ':username2'  => $username,
                        ':fullname' => $fullname,
                        ':pword'  => $pword,                     
                        ':photo'  => $photo,
                        ':addrss'  => $addrss,
                        ':celno'  => $celno
                        ));
  echo json_encode(returnAllData('select * from user',''));
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
  echo json_encode(returnAllData($clientno,'user',''));
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