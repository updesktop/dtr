<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$response = array();

$data = json_decode(file_get_contents("php://input"));
$request = $data->request;
//$clientno = $data->clientno;
include('refreshDB.php');

/*
if($request == 0){      
  //$response=returnAllData("select usercode,userid,username,pword,usertype from user","");  
  $response=returnAllData("select * from user","");  
  echo json_encode($response);
  exit;
}
*/

// Fetch all records
if($request == 0){      
  $usercode = $data->usercode;
  $response[0]=returnAllData("select * from daily","");  
  $response[1]=returnAllData("select * from monthly","");  
  $response[2]=returnAllData("select * from sig","");  
  $response[3]=returnAllData("select * from sysfile","");  
  //$response[4]=returnAllData("select * from user WHERE usercode=:usercode",array(':usercode' => $usercode));  
  $response[4]=returnAllData("select * from user","");  
  echo json_encode($response);
  exit;
}

if($request == 1){      
  $tbl = $data->tbl;   
  $response=returnAllData("select * from :tbl",array(':tbl' => $tbl));  
  echo json_encode($response);
  exit;
}

if($request == 2){    
  $response[0]=returnAllData("select CUSTNO,ACCTNAME,ADDRESS1,METERNO,SERIALNO,MTRSTAT,GEOLAT,GEOLONG,BRGYNO,CLUSNO,MTRSERV,LASTDAT,READDAT,LASTREAD,CURREAD from custmast WHERE CLUSNO=:clusno ORDER BY METERNO",
    array(':clusno' => $clusno)
  );    
  echo json_encode($response);
  exit;
}

if($request == 10){    
  $vdate = $data->vdate; 
  //$vvdate=date('Y-m-d h:i:s', strtotime($vdate));
  echo json_encode(returnAllData("select * from monthly where date = :date",array(':date' => $vdate)));
  exit;
}

if($request == 123){ 
  include 'server.php';
  
  $vdate = $data->vdate;
  $mm = $data->mm;
  $aryItems = json_decode($data->aryItems,true);   
   //$aryItems = $data->aryItems;
  // $sysdate=date('Y-m-d h:i:s', strtotime($sysdate));
  //Delete first
  $sql="DELETE FROM daily WHERE year(date)=:yyyy and month(date)=:mm";
  $stmt = $DBserver->prepare($sql);
  $stmt->execute(array(':yyyy' => $yyyy, ':mm' => $mm));
  //
  $max_Ctr=count($aryItems);
  for($i=0;$i<$max_Ctr;$i++) {	    
    //$mdate=date('Y-m-d h:i:s', strtotime($aryItems[$i]["date"]));
    $mdate=$aryItems[$i]["date"];
    $vValues="INSERT INTO `daily`(date,descrp) VALUES (:date,:descrp)"; 
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

if($request == 200){ 
//  include 'server.php';
  
  $vdate = $data->vdate;
  $usercode = $data->usercode;
  $time1 = $data->time1;
  $time2 = $data->time2;
  $time3 = $data->time3;
  $time4 = $data->time4;
  
  $mode=0;
  if($time1 && $time2 && $time3 && $time4){ $mode=1; }

  //Delete first
  $response=returnAllData("DELETE FROM daily WHERE date=:vdate and usercode=:usercode",
     array(':vdate' => $vdate, ':usercode' => $usercode)
  );  
   
  if($mode==1){
      $response=returnAllData("INSERT INTO `daily`(date,usercode, rank,time1,time2,time3,time4) VALUES (:vdate,:usercode,0,:time1,:time2,:time3,:time4)",
         array(':vdate' => $vdate, 
               ':usercode' => $usercode, 
               ':time1' => $time1,
               ':time2' => $time2,
               ':time3' => $time3,
               ':time4' => $time4                          
          ));	
  }
  
  $response=returnAllData("select * from daily","");   
  echo json_encode($response);
  exit; 
}
?>