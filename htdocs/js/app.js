var app = angular.module('game', [  'ngMap' ] )

    .factory('game', function ($http) {
	
	var api_url = "/api/api.php";

	function api_command (command) {
	    var req = {
		method: "GET",
                url:    api_url+"?cmd="+command
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
	    
	    console.log("triangle controller");

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
		console.log ("setttings changed");
		
		map.addListener('click', function(event) {
		    //$scope.fakepos(event.latLng);
		});
		recenter();		
	    });

	    function draw_targets () {
		NgMap.getMap().then(function(map) {
                    game.api_command("targets").then(function(res) {
                        ctrl.targets = res;
			if (ctrl.targets_markers == undefined) {
			    for (t in ctrl.targets) {
				var target = ctrl.targets[t];
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
			    }
			}
			for (t in ctrl.targets_markers) {
			    var target = ctrl.target[t];
			    if (target.flagged == 1) {
				ctrl.targets_markers[t].setOptions({
				    strokeColor: '#00FF00',
				    fillColor  : '#00FF00'
				});
			    }
			    else {
				ctrl.targets_markers[t].setOptions({
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
			    var wpsCircle = new google.maps.Circle({
				strokeColor: '#FFFF00',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FFFF00',
				clickable: false,
				fillOpacity: 0.35,
				map: map,
				center: {lat: parseFloat(probe.lat), lng: parseFloat(probe.lon)},
				radius: 200
			    });
			    map
			}
		    });
		});
	    };
	    
	    function update () {

		game.api_command("probes").then (function (res_probe) {

		});
		
		game.api_command("ping").then (function (res) {
		    game.api_command("update").then(function (res2) {

		    });
		});
	    }
	    
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
