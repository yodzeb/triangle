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
		       "name" => "Univ",
		       "lat"  => "49.239009",
		       "lon"  => "4.003143",
		       )
		 );


$probes     = array(array(
			  "name"=> "chenay",
			  "ip"  => "192.168.0.43",
			  "lag" => "5000",
			  "lat" => "49.297255",
			  "lon" => "3.93023",
			  ),
		    array("name" => "Witry-les-Reims",
			  "ip"   => "192.168.0.44",
			  "lag"  => "5000",
			  "lat"  => "49.291993",
			  "lon"  => "4.127941",
			  ),
		    array(
			  "name" => "Sermiers",
			  "ip"  => "192.168.0.45",
			  "lag" => "5000",
			  "lat" => "49.162849",
			  "lon" => "3.983402",
			  )
		    );



include("functions.php");


$command = $_GET["cmd"];

if ($command === "targets") {
  foreach ($targets as &$t) {
    if ($_SESSION["TARGET"][$t["name"]] > 0) {
      $t["flagged"] =1;
    }
  }
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

  do_ping($probes, $targets);
}
    


?>