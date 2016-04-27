var app = angular.module('AngularGoogleMap', ['ngResource','google-maps']);

app.factory('MarkerCreatorService', function () {

    var markerId = 0;

    function create(latitude, longitude) {
        var marker = {
            options: {
                animation: 0,
                labelAnchor: "28 -5",
                labelClass: 'markerlabel'  
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
                    var Taxis = $resource("http://localhost:8080/SpringMVCHibernate/stand/"+standId);
                    var stringTaxiIds = '';
                    var arrayTaxi = $scope.taxis = Taxis.query(function(){
                        for (var j=0; j<arrayTaxi.length; j++) {
                            stringTaxiIds = stringTaxiIds + ' ' + arrayTaxi[j].taxiId;
                        }
                        marker.options.labelContent = stringTaxiIds;
                    });
                    marker.options.title = arrayStand[i].name;
                    marker.options.icon = 'icons/TaxiStand.jpg';
                    $scope.marker = marker;
                });
                $scope.map.markers.push($scope.marker);
            }
        });
        
        $scope.addAddress = function() {
            var address = $scope.address;
            if (address !== '') {
                MarkerCreatorService.createByAddress(address, function(marker) {
                	marker.options.labelContent = 'Client';
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

        

