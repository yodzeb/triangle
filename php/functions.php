<?php

function update_targets () {
  foreach ($probes as $probe) {
    
  }
}

function update_position () {
  $earthR = 6371;

  // From http://gis.stackexchange.com/questions/66/trilateration-using-3-latitude-and-longitude-points-and-3-distances
  $LatA  = $targets[0]["lat"];
  $LonA  = $targets[0]["lon"];
  $DistA = $_SESSION["RESULTS"][0];
  $LatB  = $targets[1]["lat"];	   
  $LonB  = $targets[1]["lon"];
  $DistB = $_SESSION["RESULTS"][1];
  $LatC  = $targets[2]["lat"];	   
  $LonC  = $targets[2]["lon"];	   
  $DistC = $_SESSION["RESULTS"][2];

  $xA = $earthR *(cos(deg2rad($LatA)) * cos(deg2rad($LonA)));
  $yA = $earthR *(cos(deg2rad($LatA)) * sin(deg2rad($LonA)));
  $zA = $earthR *(sin(deg2rad($LatA)));

  $xB = $earthR *(cos(deg2rad($LatB)) * cos(deg2rad($LonB)));
  $yB = $earthR *(cos(deg2rad($LatB)) * sin(deg2rad($LonB)));
  $zB = $earthR *(sin(deg2rad($LatB)));

  $xC = $earthR *(cos(deg2rad($LatC)) * cos(deg2rad($LonC)));
  $yC = $earthR *(cos(deg2rad($LatC)) * sin(deg2rad($LonC)));
  $zC = $earthR *(sin(deg2rad($LatC)));


  
};

function do_$ping() {
  print json_encode ($probes_ips);
  
  $count = 0;
  foreach ($probes_ips as $ip) {
  
    $res = ping_client($ip, $_SESSION["CLIENT_IP"]);
    
    $_SESSION["RESULTS"][$count] = (int)$res;
  }

  update_position ();
  update_targets  ();
}

function ping_client ($source_ip, $destination_ip) {
  exec ("ping -I $source_ip -c 3 $destination_ip", $ping_res);
  
  $average = 0;

  foreach ($ping_res as $line) {
    preg_match("/time\=([\d\.]+)\s/s", $line, $matches);
    $count++;
    $average+=$matches[1];
  }

  $average /= $count;

  if ($average < 1) {
    $average = 1;
  }
  return $average;
}

?>
