<?php
$cn=0; //main server
if($cn==0) {	//local ias
  $conn_host = "localhost";
  $conn_user = "root";
  $conn_pass = "";
  $conn_name = "dtr_db";
  //$conn_name = "iasimis";
}else if($cn==1) {	// main sever
  $conn_host = "127.0.0.1"; 
  $conn_user = "root";
  $conn_pass = "";
  $conn_name = "dtr_db";
}else if($cn==2) {	//hostinger
  $conn_host = "185.224.138.112";
	$conn_user = "u442399508_user_po";
	$conn_pass = "Tubig5115";
	$conn_name = "u442399508_po";
}else if($cn==3) {	// remote local JBE Comp
  //$conn_host = "192.168.254.120"; 
  $conn_host = "127.0.0.1"; 
  $conn_host = "192.168.19.2"; 
  $conn_user = "root";
  $conn_pass = "";
  $conn_name = "ias";  
}else if($cn==4) {	// for error checking
  $conn_host = "192.168.19.2"; 
  $conn_user = "root";
  $conn_pass = "";
  $conn_name = "ias";  
}else if($cn==5) {	// for testing 
  $conn_host = "192.168.0.133"; 
  $conn_user = "root";
  $conn_pass = "systemvariable9";
  $conn_name = "iasimis";
}

try {
  $DBserver = new PDO("mysql:host={$conn_host};charset=utf8;dbname={$conn_name}",$conn_user,$conn_pass); 
  $DBserver->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
  echo "ERROR : ".$e->getMessage();
}
?>