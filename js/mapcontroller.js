(function(){

    var app = angular.module('TaxiCentral');

    app.controller('mapcontroller', ['MarkerCreatorService', '$scope', '$resource', '$interval', function (MarkerCreatorService, $scope, $resource, $interval) {
            
        $scope.address = '';
        var actualTaxi = 0;

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

        $interval(refreshMap, 10000);

    	function refreshMap() {

    		$scope.map.markers = [];

    		var Stands = $resource("http://localhost:8080/TaxiCentral/stands");
            var arrayStand = $scope.stands = Stands.query(function(){
                for (var i=0; i<arrayStand.length; i++) {
                    MarkerCreatorService.createByCoords(arrayStand[i].location.coordinates[1], arrayStand[i].location.coordinates[0], function (marker) {
                        var standId = arrayStand[i].standId;
                        var TaxiStand = $resource("http://localhost:8080/TaxiCentral/stands/"+standId);
                        var stringTaxiIds = '';
                        var arrayTaxi = $scope.taxis = TaxiStand.query(function(){
                            for (var j=0; j<arrayTaxi.length; j++) {
                                if (arrayTaxi[j].actualState !== 'AVAILABLE') {
                                    stringTaxiIds = stringTaxiIds + ' ' + arrayTaxi[j].taxiId;
                                }
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

            var Taxis = $resource("http://localhost:8080/TaxiCentral/taxis/operating");
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

            var Clients = $resource("http://localhost:8080/TaxiCentral/clients");
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

            var TaxiIdWithTokenAndClient = $resource("http://localhost:8080/TaxiCentral/taxiclient");
            var taxiClient = TaxiIdWithTokenAndClient.get(function(){
                //alert("taxiClient.taxiId: "+taxiClient.taxiId);
                //alert("actualTaxi: "+actualTaxi);
    	     	//if(actualTaxi != taxiClient.taxiId){
    	     	//	actualTaxi = taxiClient.taxiId;
                //if(actualTaxi == taxiClient.taxiId){
                //Espera 10 segundos si tal
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
    	        //}
            });

        	$scope.addClient = function() {
                var client = $scope.client;
                if (client !== '') {
                    MarkerCreatorService.createByAddress(client, function(marker) {
                        Clients.save([marker.latitude,marker.longitude]);
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

    	}

        

    }]);

})();