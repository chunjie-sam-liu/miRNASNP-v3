"use strict";

angular.module('miRNASNP3')
    .controller('HomeController', HomeController);

function HomeController($scope,$http,$rootScope) {
    console.log("HomeController loaded");
    $scope.search_query = function () {
        $rootScope.search_ids = $scope.search_ids
    }
}


