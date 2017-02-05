<?php


function distance($lat1, $lon1, $lat2, $lon2, $unit) {

  $theta = $lon1 - $lon2;
  $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
  $dist = acos($dist);
  $dist = rad2deg($dist);
  $miles = $dist * 60 * 1.1515;
  $unit = strtoupper($unit);

  if ($unit == "K") {
    return ($miles * 1.609344);
  } else if ($unit == "N") {
    return ($miles * 0.8684);
  } else {
    return $miles;
  }
}


function update_targets ($targets) {
  $date = new DateTime();
  $unix = $date->getTimestamp();

  foreach ($targets as $t) {
    if (distance($_SESSION["POSITION"]["lat"] , $_SESSION["POSITION"]["lon"],
		  $t["lat"], $t["lon"], "K") < 0.5) {
      // 500 meters
      $_SESSION["TARGET"][$t["name"]] = $unix;
    }
    else {
      if ($_SESSION["TARGET"][$t["name"]] == NULL ||
	  ($unix - $_SESSION["TARGET"][$t["name"]]) > 1800) {
	$_SESSION["TARGET"][$t["name"]] =0;
      }
    }
  }

  $count = 0;
  $tar = $_SESSION["TARGET"];
  foreach ($tar as $t => $val) {
    if ($val != 0) {
      $count ++ ;
    }
  }

  if ($count == sizeof($targets)) {
    $_SESSION["FLAG"] = file("../flag/flag") [0];
  }
}


function update_position ($probes) {
  $max=0;
  foreach ($_SESSION["RESULTS"] as $v) {
    if ($v > $max)
      $max = $v;
  }
  $new_max=40;
  
  $LatA  = $probes[0]["lat"];
  $LonA  = $probes[0]["lon"];
  $DistA = $_SESSION["RESULTS"][0]*$new_max/$max ;
  $LatB  = $probes[1]["lat"];	   
  $LonB  = $probes[1]["lon"];
  $DistB = $_SESSION["RESULTS"][1]*$new_max/$max ;
  $LatC  = $probes[2]["lat"];	   
  $LonC  = $probes[2]["lon"];	   
  $DistC = $_SESSION["RESULTS"][2]*$new_max/$max ;

  print "max:".$max;
  //system("pwd");

  print ("../bin/position.py $LatA $LonA $DistA $LatB $LonB $DistB $LatC $LonC $DistC") ;

  exec ("../bin/position.py $LatA $LonA $DistA $LatB $LonB $DistB $LatC $LonC $DistC", $position) ;

  if (preg_match ("/([\d\.]+) ([\d\.]+)/", $position[0], $res)) {
    print ("Position : ");
    $_SESSION["POSITION"] = array("lat" => $res[1], "lon" => $res[2] );
  }
  
};



function do_ping($probes, $targets) {
  print "blabla";

  $count = 0;
  $_SESSION["RESULTS"] = NULL;

  foreach ($probes as $p) {
    $ip = $p["ip"];
    print "ip: ".$ip;
    $res = ping_client($ip, $_SESSION["CLIENT_IP"]);
    $_SESSION["RESULTS"][$count] = $p["lag"] + (int)$res ;
    $count++;
  }
  print json_encode ($_SESSION);

  update_position ($probes);
  update_targets  ($targets);

}

function ping_client ($source_ip, $destination_ip) {
  exec ("ping -I $source_ip -c 3 $destination_ip", $ping_res);
  
  $average = 0;
  $count   = 0;

  foreach ($ping_res as $line) {
    if (preg_match("/time\=([\d\.]+)\s/s", $line, $matches)) {
      $count++;
      $average+=$matches[1];
    }
  }

  $average /= $count;

  if ($average < 1) {
    $average = 1;
  }
  return $average;
}

?>
