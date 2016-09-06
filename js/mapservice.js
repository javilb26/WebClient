(function(){

    var app = angular.module('TaxiCentral');

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

})();