<!DOCTYPE html>
<html lang="en-US" ng-app="TaxiCentral">
    <head>
        <title>TaxiCentral Admin</title>

        <!-- Load Bootstrap CSS -->
        <link href="styles/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <!--<h2>Taxis Database</h2>-->
        <div ng-controller="taxiscontroller">

            <!-- Table-to-load-the-data Part -->
            <table class="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Position</th>
                        <th>Actual State</th>
                        <th>Future State</th>
                        <th>Client</th>
                        <th>City</th>
                        <th><button id="btn-add" class="btn btn-primary btn-xs" ng-click="toggle('add', 0)">Add New Taxi</button></th>
                    </tr>
                </thead>
                <tbody>
                    <tr ng-repeat="taxi in taxis">
                        <td>{{ taxi.taxiId }}</td>
                        <td>{{ taxi.position.coordinates }}</td>
                        <td>{{ taxi.actualState }}</td>
                        <td>{{ taxi.futureState }}</td>
                        <td>{{ taxi.client.clientId }}</td>
                        <td>{{ taxi.city.cityId }}</td>
                        <td>
                            <button class="btn btn-info btn-xs btn-detail" ng-click="toggle('edit', taxi.taxiId)">Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- End of Table-to-load-the-data Part -->
            <!-- Modal (Pop up when detail button clicked) -->
            <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="myModalLabel">{{form_title}}</h4>
                        </div>
                        <div class="modal-body">
                            <form name="frmEmployees" class="form-horizontal" novalidate="">

                                <div class="form-group">
                                    <label for="countrylbl" class="col-sm-3 control-label">Country</label>
                                    <div class="col-sm-9">
                                        <div class="dropdown">
                                            <button ng-click="selectcountry()" ID="countriesbutton" class="btn btn-info dropdown-toggle" type="button" data-toggle="dropdown">Select Country <span class="caret"></span></button>
                                                <ul id="countriesDropdown" class="dropdown-menu">
                                                  <li ng-repeat="country in countries"><a>
                                                    {{ country.countryId }} - {{ country.name }}
                                                  </a></li>
                                                </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="regionlbl" class="col-sm-3 control-label">Region</label>
                                    <div class="col-sm-9">
                                        <div class="dropdown">
                                            <button ng-model="countryIdSelected" ng-click="getRegions(countryIdSelected)"  ID="regionsbutton" class="btn btn-info dropdown-toggle" type="button" data-toggle="dropdown">Select Region <span class="caret"></span></button>
                                                <ul id="regionsDropdown" class="dropdown-menu">
                                                  <li ng-repeat="region in regions"><a>
                                                    {{ region.regionId }} - {{ region.name }}
                                                  </a></li>
                                                </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="citylbl" class="col-sm-3 control-label">City</label>
                                    <div class="col-sm-9">
                                        <div class="dropdown">
                                            <button ng-model="regionIdSelected" ng-click="getCities(regionIdSelected)" ID="citiesbutton" class="btn btn-info dropdown-toggle" type="button" data-toggle="dropdown">Select City <span class="caret"></span></button>
                                                <ul id="citiesDropdown" class="dropdown-menu">
                                                  <li ng-repeat="city in cities"><a>
                                                    {{ city.cityId }} - {{ city.name }}
                                                  </a></li>
                                                </ul>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="btn-save" ng-model="cityIdSelected" ng-click="save(taxi.taxiId, cityIdSelected)" ng-disabled="frmEmployees.$invalid">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Load Javascript Libraries (AngularJS, JQuery, Bootstrap) -->
        <script src="js/lib/angularjs.min.js"></script>
        <script src="js/lib/jquery.min.js"></script>
        <script src="js/lib/bootstrap.min.js"></script>
        
        <!-- AngularJS Application Scripts -->
        <script src="js/app.js"></script>
        <script src="js/taxiscontroller.js"></script>

    </body>
</html>