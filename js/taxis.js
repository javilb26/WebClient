var app = angular.module('taxiRecords', [])
        .constant('API_URL', 'http://localhost:8080/SpringMVCHibernate/');

app.controller('taxisController', function($scope, $http, API_URL) {
    //retrieve taxis listing from API
    $http.get(API_URL + "taxis")
            .success(function(response) {
                $scope.taxis = response;
            });

    $http.get(API_URL + "countries")
            .success(function(response) {
                $scope.countries = response;
            });
    
    $scope.getRegions = function(countryId) {
        $http.get(API_URL + "countries/" + countryId)
            .success(function(response) {
                $scope.regions = response;
            });
        setTimeout(function(){
            $('#regionsDropdown li').on('click', function(){
                document.getElementById("regionsbutton").innerHTML=$(this).text();
                $scope.regionIdSelected = $(this).text().trim().substring(0,$(this).text().trim().indexOf("-"));
            });
        }, 50);
    }

    $scope.getCities = function(regionId) {
        $http.get(API_URL + "regions/" + regionId)
            .success(function(response) {
                $scope.cities = response;
            });
        setTimeout(function(){
            $('#citiesDropdown li').on('click', function(){
                document.getElementById("citiesbutton").innerHTML=$(this).text();
                $scope.cityIdSelected = $(this).text().trim().substring(0,$(this).text().trim().indexOf("-"));
            });
        }, 500);
    }

    $scope.selectcountry = function () {
        $('#countriesDropdown li').on('click', function(){
            document.getElementById("countriesbutton").innerHTML=$(this).text();
            $scope.countryIdSelected = $(this).text().trim().substring(0,$(this).text().trim().indexOf("-"));
        });
    }

    //show modal form
    $scope.toggle = function(modalstate, id) {
        $scope.modalstate = modalstate;

        switch (modalstate) {
            case 'add':
                var url = API_URL + "taxis";
                $http({
                    method: 'POST',
                    url: url
                }).success(function(response) {
                    console.log(response);
                    location.reload();
                }).error(function(response) {
                    console.log(response);
                    alert('This is embarassing. An error has occured. Please check the log for details');
                });
                break;
            case 'edit':
                $scope.form_title = "Select the city belongs to the taxi";
                $scope.id = id;
                $http.get(API_URL + 'taxis/' + id)
                        .success(function(response) {
                            console.log(response);
                            $scope.taxi = response;
                        });
                $('#myModal').modal('show');
                break;
            default:
                break;
        }
        console.log(id);
        
    }

    //update existing record
    $scope.save = function(taxiId, cityId) {
        var url = API_URL + "taxis/" + taxiId + "/cities/" + cityId;
        
        $http({
            method: 'PUT',
            url: url
        }).success(function(response) {
            console.log(response);
            location.reload();
        }).error(function(response) {
            console.log(response);
            alert('This is embarassing. An error has occured. Please check the log for details');
        });
    }

});
