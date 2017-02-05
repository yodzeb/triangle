var app = angular.module('game', [  'ngMap' ] )

    .factory('game', function ($http) {
	
	var api_url = "/api/api.php";

	function api_command (command, other_params) {
	    if (other_params == undefined)
		other_params = "";
	    var req = {
		method: "GET",
                url:    api_url+"?cmd="+command+other_params
	    };
	    return $http(req).then(function (res) {
		return res.data;
	    });
	}
	
	return {
	    api_command: api_command
	}

    })


    .component ('game', {
	templateUrl: 'game.html',
	controller : function (game, NgMap, $interval) {
	    var ctrl = this;
	    
	    function recenter () {
		NgMap.getMap().then(function(map) {
		
		    var center = new google.maps.LatLng("49.258329","4.031696000000011");
		    map.setCenter(center);
		});
	    }


	    NgMap.getMap().then(function(map) {
		var opts = {
		    zoom: 11,
		    zoomControl: false,
		    scaleControl: false,
		    mapTypeControl: false,
		    streetViewControl: false,
		    mapTypeId: 'terrain',
		    styles: mapStyle
		};
		map.setOptions(opts);
		
		map.addListener('click', function(event) {
		    //$scope.fakepos(event.latLng);
		});
		recenter();		
	    });

	    function draw_targets () {
		NgMap.getMap().then(function(map) {
                    game.api_command("targets").then(function(res) {
			
			for (t in res) {
			    if (ctrl.targets[res[t]["name"]] == undefined)
				ctrl.targets[res[t]["name"]] = {};
                            ctrl.targets[res[t]["name"]]["value"] = res[t];
			}

			
			for (t in ctrl.targets) {
			    var target = ctrl.targets[t]["value"];
			    if (ctrl.targets[t]["marker"] == undefined) {
				
				var wpsCircle = new google.maps.Circle({
				    strokeColor: '#FF0000',
				    strokeOpacity: 0.8,
				    strokeWeight: 2,
				    fillColor: '#FF0000',
				    clickable: false,
				    fillOpacity: 0.35,
				    map: map,
				    center: {lat: parseFloat(target.lat), lng: parseFloat(target.lon)},
				    radius: 500
				});
				ctrl.targets[t]["marker"] = wpsCircle;
			    }

			    if (target.flagged == 1) {
				ctrl.targets[t]["marker"].setOptions({
				    strokeColor: '#00FF00',
				    fillColor  : '#00FF00'
				});
			    }
			    else {
				ctrl.targets[t]["marker"].setOptions({
				    fillColor: '#FF0000',
				    strokeColor: '#FF0000'
				});
			    }

			}

		    });
		});
	    }

	    function draw_probes () {
		NgMap.getMap().then(function(map) {

		    game.api_command ("probes").then (function(res) {
			ctrl.probes = res;
			
			for (p in ctrl.probes) {
			    var probe = ctrl.probes[p];
			    var position = new google.maps.LatLng( parseFloat(probe.lat), parseFloat(probe.lon) );
			    var image = {
				url: '../images/radar.gif',
				scaledSize: new google.maps.Size(40, 40), // scaled size5D
				origin: new google.maps.Point(0,0), // origin
				anchor: new google.maps.Point(0, 0) // anchor
			    };
			    var marker = new google.maps.Marker({
				map: map,
				draggable:false,
				position: position,
				icon: image,
				optimized: false
			    }); 
			}
		    });
		});
	    };
	    
	    function draw_position () {
		NgMap.getMap().then(function(map) {
		    var new_pos = new google.maps.LatLng(ctrl.position.lat, ctrl.position.lon);
		    if (ctrl.my_position == undefined)  
			ctrl.my_position = new google.maps.Marker({
			    position: new_pos,
			    title:"Me!",
			    map: map
			});
		    ctrl.my_position.setPosition(new_pos);
		});
	    }

	    function update () {
		var other_params="";
		if (ctrl.tcp != undefined && ctrl.tcp)
		    other_params = "&probe=tcp";
		else if (ctrl.tcp != undefined &&  !ctrl.tcp) {
		    other_params = "&probe=icmp";
		}

		game.api_command("ping", other_params).then (function (res) {
		    draw_targets();
		    game.api_command("update").then(function (res2) {
			if (res2.PROBING === "tcp")
			    ctrl.tcp = true;
			ctrl.position = res2.POSITION;
			ctrl.flag     = res2.FLAG; // hihi
			draw_position();
		    });
		});
	    }

	    ctrl.update = function () {
		update();
	    }
	    
	    ctrl.targets = {};	    
	    draw_targets();
	    draw_probes();
	    update();
	    $interval ( update, 10000 );	    
	    
	}
});

var mapStyle=[
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {
	featureType: 'administrative.locality',
	elementType: 'labels.text.fill',
	stylers: [{color: '#d59563'}]
    },
    {
	featureType: 'poi',
	elementType: 'labels.text.fill',
	stylers: [{color: '#d59563'}]
    },
    {
	featureType: 'poi.park',
	elementType: 'geometry',
	stylers: [{color: '#263c3f'}]
    },
    {
	featureType: 'poi.park',
	elementType: 'labels.text.fill',
	stylers: [{color: '#6b9a76'}]
    },
    {
	featureType: 'road',
	elementType: 'geometry',
	stylers: [{color: '#38414e'}]
    },
    {
	featureType: 'road',
	elementType: 'geometry.stroke',
	stylers: [{color: '#212a37'}]
    },
    {
	featureType: 'road',
	elementType: 'labels.text.fill',
	stylers: [{color: '#9ca5b3'}]
    },
    {
	featureType: 'road.highway',
	elementType: 'geometry',
	stylers: [{color: '#746855'}]
    },
    {
	featureType: 'road.highway',
	elementType: 'geometry.stroke',
	stylers: [{color: '#1f2835'}]
    },
    {
	featureType: 'road.highway',
	elementType: 'labels.text.fill',
	stylers: [{color: '#f3d19c'}]
    },
    {
	featureType: 'transit',
	elementType: 'geometry',
	stylers: [{color: '#2f3948'}]
    },
    {
	featureType: 'transit.station',
	elementType: 'labels.text.fill',
	stylers: [{color: '#d59563'}]
    },
    {
	featureType: 'water',
	elementType: 'geometry',
	stylers: [{color: '#17263c'}]
    },
    {
	featureType: 'water',
	elementType: 'labels.text.fill',
	stylers: [{color: '#515c6d'}]
    },
    {
	featureType: 'water',
	elementType: 'labels.text.stroke',
	stylers: [{color: '#17263c'}]
    }
];
