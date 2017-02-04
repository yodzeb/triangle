<?php

session_start();
  

$targets = array(
		 array(
		       "name" => "Cathedrale",
		       "lat"  => "49.253885",
		       "lon"  => "4.033999"
		       ),
		 array(
		       "name" => "Champfleury",
		       "lat"  => "49.196064",
		       "lon"  => "4.013958",
		       ),
		 array(
		       "Univ" => "Univ",
		       "lat"  => "49.239009",
		       "lon"  => "4.003143",
		       )
		 );


$probes_ips = array( "192.168.0.43", "192.168.0.44", "192.168.0.45");
$probes     = array(
		    "chenay" => array(
				   "lat" => "49.297255",
				   "lon" => "3.93023",
				   ),
		    "Witry-les-Reims" => array(
				   "lat" => "49.291993",
				   "lon" => "4.127941",
				   ),
		    "Sermiers" => array(
				     "lat" => "49.162849",
				     "lon" => "3.983402",
				     )
		    );



include_once("functions.php");


$command = $_GET["cmd"];

if ($command === "targets") {
  print json_encode ($targets);
}
elseif ($command === "update") {
  $_SESSION["CLIENT_IP"] = $_SERVER['REMOTE_ADDR'];
  print (json_encode ($_SESSION));
}
  elseif ($command === "probes") {
  print json_encode ( $probes );
}
  elseif ($command === "ping") {
  do_ping();
}
    


?>