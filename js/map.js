var app = angular.module('AngularGoogleMap', ['ngResource','google-maps']);

app.factory('MarkerCreatorService', function () {

    var markerId = 0;

    function create(latitude, longitude) {
        var marker = {
            options: {
                animation: 0,
                labelAnchor: "28 -5",
                //labelClass: 'markerlabel'
                icon: 'icons/clientwaiting.png'  
            },
            latitude: latitude,
            longitude: longitude,
            id: ++markerId          
        };
        return marker;        
    }

    function invokeSuccessCallback(successCallback, marker) {
        if (typeof successCallback === 'function') {
            successCallback(marker);
        }
    }

    function createByCoords(latitude, longitude, successCallback) {
        var marker = create(latitude, longitude);
        invokeSuccessCallback(successCallback, marker);
    }

    function createByAddress(address, successCallback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address' : address}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var firstAddress = results[0];
                var latitude = firstAddress.geometry.location.lat();
                var longitude = firstAddress.geometry.location.lng();
                var marker = create(latitude, longitude);
                invokeSuccessCallback(successCallback, marker);
            } else {
                alert("Unknown address: " + address);
            }
        });
    }

    return {
        createByCoords: createByCoords,
        createByAddress: createByAddress
    };

});

app.controller('MapCtrl', ['MarkerCreatorService', '$scope', '$resource', function (MarkerCreatorService, $scope, $resource) {
        
        $scope.address = '';

        $scope.map = {
            center: {
                latitude: 43.3415225,
                longitude: -8.4477031
            },
            zoom: 12,
            markers: [],
            control: {},
            options: {
                scrollwheel: true
            }
        };

        var Stands = $resource("http://localhost:8080/SpringMVCHibernate/stands");
        var arrayStand = $scope.stands = Stands.query(function(){
            for (var i=0; i<arrayStand.length; i++) {
                MarkerCreatorService.createByCoords(arrayStand[i].location.coordinates[1], arrayStand[i].location.coordinates[0], function (marker) {
                    var standId = arrayStand[i].standId;
                    var TaxiStand = $resource("http://localhost:8080/SpringMVCHibernate/stands/"+standId);
                    var stringTaxiIds = '';
                    var arrayTaxi = $scope.taxis = TaxiStand.query(function(){
                        for (var j=0; j<arrayTaxi.length; j++) {
                            stringTaxiIds = stringTaxiIds + ' ' + arrayTaxi[j].taxiId;
                        }
                        marker.options.labelContent = stringTaxiIds;
                    });
                    //marker.options.title = stringTaxiIds;
                    marker.options.icon = 'icons/stand.png';
                    $scope.marker = marker;
                });
                $scope.map.markers.push($scope.marker);
            }
        });

        //while (true) {
        var Taxis = $resource("http://localhost:8080/SpringMVCHibernate/taxis/operating");
        var arrayTaxi = $scope.taxis = Taxis.query(function(){
            for (var i=0; i<arrayTaxi.length; i++) {
            	if (arrayTaxi[i].actualState !== 'INSTAND') {
            		MarkerCreatorService.createByCoords(arrayTaxi[i].position.coordinates[1], arrayTaxi[i].position.coordinates[0], function (marker) {
                    	marker.options.title = 'Id: ' + arrayTaxi[i].taxiId + ', State: ' + arrayTaxi[i].actualState;
                    	if (arrayTaxi[i].actualState === 'AVAILABLE') {
                    		marker.options.icon = 'icons/taxiavailable.png';
                    	}
                    	if (arrayTaxi[i].actualState === 'BUSY') {
                    		marker.options.icon = 'icons/taxibusy.png';
                    	}
                    	$scope.marker = marker;
                	});
                	$scope.map.markers.push($scope.marker);
            	}
            }
        });

        var Clients = $resource("http://localhost:8080/SpringMVCHibernate/clients");
        var arrayClient = $scope.clients = Clients.query(function(){
            for (var i=0; i<arrayClient.length; i++) {
                MarkerCreatorService.createByCoords(arrayClient[i].location.coordinates[1], arrayClient[i].location.coordinates[0], function (marker) {
                    marker.options.title = 'Id: ' + arrayClient[i].clientId + ', State: ' + arrayClient[i].clientState + ', Entry: ' + arrayClient[i].entry + ', Origin: ' + arrayClient[i].originAddress.name + ', ' + arrayClient[i].originCity.name + ', ' + arrayClient[i].originRegion.name + ', ' + arrayClient[i].originCountry.name;
                    if (arrayClient[i].clientState === 'WAITING') {
                    	marker.options.icon = 'icons/clientwaiting.png';
                    }
                    if (arrayClient[i].clientState === 'ASSIGNED') {
                    	marker.options.icon = 'icons/clientassigned.png';
                    }
                    $scope.marker = marker;
                });
                $scope.map.markers.push($scope.marker);
            }
        });
        //setTimeout(function(){}, 3000);
        //}

        var TaxiIdWithTokenAndClient = $resource("http://localhost:8080/SpringMVCHibernate/taxiclient");
        var taxiClient = TaxiIdWithTokenAndClient.get(function(){
     		var data = {
  				"to" : taxiClient.token,
  				"data" : {
					"clientId": taxiClient.clientId,
					"country": taxiClient.country,
					"region": taxiClient.region,
					"city": taxiClient.city,
					"address": taxiClient.address
   				}
			}
			var PostFirebase = $resource("https://fcm.googleapis.com/fcm/send", data, {
				post: {
					method: 'POST',
					headers: {'Authorization': 'key=AIzaSyDuJHUIiXZGWgul-eH_28qugSELqErrsOc'}
				}
			});
			PostFirebase.post();
        });

        //Obtener TaxiCLient y hacer post a gcm -> mandar a android la info e implementar los botones de alerta

        $scope.addClient = function() {
            var client = $scope.client;
            if (client !== '') {
                MarkerCreatorService.createByAddress(client, function(marker) {
                    Clients.save([marker.latitude,marker.longitude]);
                    //Hacer comprobacion -> si no guarda en bd no pongas marcador (hay formas meter el marcador como resultado de la peticion rest)
                	//marker.options.labelContent = 'Client';
                    $scope.map.markers.push(marker);
                    refresh(marker);
                });
            }
        };

        function refresh(marker) {
            $scope.map.control.refresh({latitude: marker.latitude,
                longitude: marker.longitude});
        }

    }]);

        

